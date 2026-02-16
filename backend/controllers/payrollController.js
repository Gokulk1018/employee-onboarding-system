const PayrollProfile = require('../models/PayrollProfile');
const PayrollTransaction = require('../models/PayrollTransaction');
const Payslip = require('../models/Payslip');
const Employee = require('../models/Employee');

// A) Create Payroll Profile
exports.createProfile = async (req, res) => {
    try {
        const { employeeId, baseSalary, taxPercent, bankName, accountNumber } = req.body;

        // Check if employee exists
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if profile already exists
        const existingProfile = await PayrollProfile.findOne({ employeeId });
        if (existingProfile) {
            return res.status(400).json({ message: 'Payroll profile already exists for this employee' });
        }

        const profile = new PayrollProfile({
            employeeId,
            baseSalary,
            taxPercent,
            bankName,
            accountNumber
        });

        await profile.save();
        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// B) Run Monthly Payroll
exports.runPayroll = async (req, res) => {
    try {
        const { employeeId, month, year } = req.body;

        // 1) Fetch PayrollProfile
        const profile = await PayrollProfile.findOne({ employeeId });
        if (!profile) {
            return res.status(404).json({ message: 'Payroll profile not found. Please create one first.' });
        }

        // 2) Check if PayrollTransaction already exists
        const existingTransaction = await PayrollTransaction.findOne({ employeeId, month, year });
        if (existingTransaction) {
            return res.status(400).json({ message: 'Payroll already generated for this period' });
        }

        // 3) Calculate
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = monthNames.findIndex(m => month.startsWith(m)) + 1;

        if (monthIndex === 0) {
            return res.status(400).json({ message: 'Invalid month name' });
        }

        const grossSalary = profile.baseSalary;
        const taxAmount = (grossSalary * profile.taxPercent) / 100;
        const netSalary = grossSalary - taxAmount;

        // 4) Create PayrollTransaction
        const transaction = new PayrollTransaction({
            employeeId,
            month,
            year,
            monthIndex,
            grossSalary,
            taxAmount,
            netSalary,
            status: 'Paid'
        });

        await transaction.save();

        // 5) Create Payslip record
        const payslip = new Payslip({
            employeeId,
            transactionId: transaction._id,
            pdfUrl: `/payslips/${employeeId}-${month}-${year}.pdf`
        });

        await payslip.save();

        res.status(201).json({
            message: 'Payroll generated successfully',
            transaction,
            payslip
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// C) Get Payroll Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const yearParam = req.query.year;

        const query = {
            employeeId,
            year: yearParam ? Number(yearParam) : { $exists: true }
        };

        const transactions = await PayrollTransaction.find(query)
            .sort({ year: 1, monthIndex: 1 });

        if (!transactions || transactions.length === 0) {
            return res.json({
                monthlyNet: 0,
                totalEarnings: 0,
                totalTax: 0,
                salaryTrend: [],
                history: []
            });
        }

        // Filter and calculate based on selected year if any, otherwise latest year
        const targetYear = yearParam ? Number(yearParam) : transactions[transactions.length - 1].year;
        const yearTransactions = transactions.filter(t => t.year === targetYear);

        const totalEarnings = yearTransactions.reduce((sum, t) => sum + t.netSalary, 0);
        const totalTax = yearTransactions.reduce((sum, t) => sum + t.taxAmount, 0);
        const monthlyNet = yearTransactions.length > 0 ? yearTransactions[yearTransactions.length - 1].netSalary : 0;

        const salaryTrend = yearTransactions.map(t => ({
            month: t.month,
            net: t.netSalary,
            year: t.year
        }));

        const history = transactions.map(t => ({
            key: t._id,
            month: `${t.month} ${t.year}`,
            salary: `$${t.netSalary.toLocaleString()}`,
            status: t.status,
            breakdown: {
                month: `${t.month} ${t.year}`,
                basicPay: `$${Math.round(t.netSalary * 0.6).toLocaleString()}`,
                hra: `$${Math.round(t.netSalary * 0.2).toLocaleString()}`,
                allowances: `$${Math.round(t.netSalary * 0.1).toLocaleString()}`,
                bonus: `$0`,
                tax: `$${t.taxAmount.toLocaleString()}`,
                net: `$${t.netSalary.toLocaleString()}`
            }
        })).reverse(); // Latest first for history

        res.json({
            monthlyNet,
            totalEarnings,
            totalTax,
            salaryTrend,
            history
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// D) Get Payslip History
exports.getPayslipHistory = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const year = req.query.year ? parseInt(req.query.year) : null;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const query = { employeeId };
        if (year) query.year = year;

        const total = await PayrollTransaction.countDocuments(query);
        const transactions = await PayrollTransaction.find(query)
            .sort({ year: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            transactions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// E) Add Manual Payroll Entry
exports.addPayrollEntry = async (req, res) => {
    try {
        const { employeeId, year, month, grossSalary, taxAmount, status } = req.body;

        // 1. Check for duplicates
        const existing = await PayrollTransaction.findOne({ employeeId, year, month });
        if (existing) {
            return res.status(409).json({ message: 'Payroll record already exists for this month and year' });
        }

        // 2. Auto-calculate fields
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = monthNames.findIndex(m => month.startsWith(m)) + 1;

        if (monthIndex === 0) {
            return res.status(400).json({ message: 'Invalid month name' });
        }

        const netSalary = grossSalary - taxAmount;

        // 3. Create Transaction
        const transaction = new PayrollTransaction({
            employeeId,
            year,
            month,
            monthIndex,
            grossSalary,
            taxAmount,
            netSalary,
            status: status || 'Paid'
        });

        await transaction.save();

        // 4. Create Dummy Payslip (to keep data consistent for UI links)
        const payslip = new Payslip({
            employeeId,
            transactionId: transaction._id,
            pdfUrl: `/payslips/${employeeId}-${month}-${year}.pdf`
        });
        await payslip.save();

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// F) Add or Update Payroll Entry (Upsert)
exports.addOrUpdatePayrollEntry = async (req, res) => {
    try {
        const { employeeId, year, month, grossSalary, taxAmount, status } = req.body;

        // 1. Auto-calculate fields
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIndex = monthNames.findIndex(m => month.startsWith(m)) + 1;

        if (monthIndex === 0) {
            return res.status(400).json({ message: 'Invalid month name' });
        }

        const netSalary = grossSalary - taxAmount;

        // 2. Find and Update OR Create
        const filter = { employeeId, year, month };
        const update = {
            employeeId,
            year,
            month,
            monthIndex,
            grossSalary,
            taxAmount,
            netSalary,
            status: status || 'Paid'
        };
        const options = { new: true, upsert: true, setDefaultsOnInsert: true };

        const transaction = await PayrollTransaction.findOneAndUpdate(filter, update, options);

        // 3. Ensure dummy Payslip exists
        const existingPayslip = await Payslip.findOne({ transactionId: transaction._id });
        if (!existingPayslip) {
            const payslip = new Payslip({
                employeeId,
                transactionId: transaction._id,
                pdfUrl: `/payslips/${employeeId}-${month}-${year}.pdf`
            });
            await payslip.save();
        }

        res.status(200).json({
            message: 'Payroll entry saved successfully',
            data: transaction
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// G) Get Payroll Comparison (Month-to-Month)
exports.getPayrollComparison = async (req, res) => {
    try {
        const { employeeId, year, month } = req.params;
        const currentYear = parseInt(year);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentIndex = monthNames.indexOf(month);

        if (currentIndex === -1) {
            return res.status(400).json({ message: 'Invalid month name' });
        }

        // Determine Previous Month & Year
        let prevMonth, prevYear;
        if (currentIndex === 0) { // If Jan
            prevMonth = "Dec";
            prevYear = currentYear - 1;
        } else {
            prevMonth = monthNames[currentIndex - 1];
            prevYear = currentYear;
        }

        // Fetch Records
        const currentRecord = await PayrollTransaction.findOne({ employeeId, year: currentYear, month });
        const previousRecord = await PayrollTransaction.findOne({ employeeId, year: prevYear, month: prevMonth });

        if (!currentRecord || !previousRecord) {
            return res.json({
                hasPrevious: false,
                message: !currentRecord ? "Current record missing" : "Previous record missing"
            });
        }

        const currentNet = currentRecord.netSalary;
        const previousNet = previousRecord.netSalary;

        // Calculate Percentage Change
        let percentChange = 0;
        if (previousNet !== 0) {
            percentChange = ((currentNet - previousNet) / previousNet) * 100;
        }

        let direction = "same";
        if (percentChange > 0) direction = "up";
        if (percentChange < 0) direction = "down";

        res.json({
            hasPrevious: true,
            currentNet,
            previousNet,
            percentChange: Math.abs(percentChange).toFixed(1), // Return absolute value for UI, direction handles sign
            direction
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
