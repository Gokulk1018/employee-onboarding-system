const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Employee = require('../models/Employee');
const connectDB = require('../config/db');

dotenv.config({ path: path.join(__dirname, '../.env') });

const employees = [
    {
        name: "James Wilson",
        email: "james.wilson@example.com",
        role: "Developer",
        department: "Engineering",
        status: "Active",
        joinDate: new Date("2023-09-15"),
        avatar: "https://i.pravatar.cc/150?u=james"
    },
    {
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        role: "Manager",
        department: "Product",
        status: "Active",
        joinDate: new Date("2023-11-20"),
        avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        name: "Marcus Thorne",
        email: "marcus.t@example.com",
        role: "Designer",
        department: "Design",
        status: "On Leave",
        joinDate: new Date("2024-01-10"),
        avatar: "https://i.pravatar.cc/150?u=marcus"
    },
    {
        name: "Emma Rodriguez",
        email: "emma.r@example.com",
        role: "QA",
        department: "Engineering",
        status: "Active",
        joinDate: new Date("2023-08-05"),
        avatar: "https://i.pravatar.cc/150?u=emma"
    },
    {
        name: "Liam O'Connor",
        email: "liam.oc@example.com",
        role: "Intern",
        department: "Engineering",
        status: "Active",
        joinDate: new Date("2024-02-01"),
        avatar: "https://i.pravatar.cc/150?u=liam"
    },
    {
        name: "Olivia Pope",
        email: "olivia.p@example.com",
        role: "Manager",
        department: "HR",
        status: "Active",
        joinDate: new Date("2023-06-12"),
        avatar: "https://i.pravatar.cc/150?u=olivia"
    },
    {
        name: "Noah Varma",
        email: "noah.v@example.com",
        role: "Developer",
        department: "Marketing",
        status: "Active",
        joinDate: new Date("2023-10-30"),
        avatar: "https://i.pravatar.cc/150?u=noah"
    },
    {
        name: "Sophia Loren",
        email: "sophia.l@example.com",
        role: "Designer",
        department: "Design",
        status: "Probation",
        joinDate: new Date("2024-01-25"),
        avatar: "https://i.pravatar.cc/150?u=sophia"
    },
    {
        name: "Ethan Hunt",
        email: "ethan.h@example.com",
        role: "QA",
        department: "Engineering",
        status: "Active",
        joinDate: new Date("2023-04-10"),
        avatar: "https://i.pravatar.cc/150?u=ethan"
    },
    {
        name: "Ava Gardner",
        email: "ava.g@example.com",
        role: "Developer",
        department: "Product",
        status: "Active",
        joinDate: new Date("2023-12-15"),
        avatar: "https://i.pravatar.cc/150?u=ava"
    },
    {
        name: "Lucas Black",
        email: "lucas.b@example.com",
        role: "Intern",
        department: "Marketing",
        status: "Inactive",
        joinDate: new Date("2024-02-05"),
        avatar: "https://i.pravatar.cc/150?u=lucas"
    },
    {
        name: "Mia Hamm",
        email: "mia.h@example.com",
        role: "Manager",
        department: "Operations",
        status: "Active",
        joinDate: new Date("2023-07-22"),
        avatar: "https://i.pravatar.cc/150?u=mia"
    },
    {
        name: "Oliver Twist",
        email: "oliver.t@example.com",
        role: "Developer",
        department: "Engineering",
        status: "Active",
        joinDate: new Date("2023-03-01"),
        avatar: "https://i.pravatar.cc/150?u=oliver"
    },
    {
        name: "Isabella Swan",
        email: "isabella.s@example.com",
        role: "QA",
        department: "Product",
        status: "Active",
        joinDate: new Date("2023-10-18"),
        avatar: "https://i.pravatar.cc/150?u=isabella"
    },
    {
        name: "William Tell",
        email: "william.t@example.com",
        role: "Manager",
        department: "Finance",
        status: "Active",
        joinDate: new Date("2023-05-30"),
        avatar: "https://i.pravatar.cc/150?u=william"
    },
    {
        name: "Charlotte Bronte",
        email: "charlotte.b@example.com",
        role: "Designer",
        department: "Marketing",
        status: "On Leave",
        joinDate: new Date("2023-02-14"),
        avatar: "https://i.pravatar.cc/150?u=charlotte"
    },
    {
        name: "Benjamin Franklin",
        email: "ben.f@example.com",
        role: "Developer",
        department: "Engineering",
        status: "Active",
        joinDate: new Date("2024-01-05"),
        avatar: "https://i.pravatar.cc/150?u=ben"
    },
    {
        name: "Amelia Earhart",
        email: "amelia.e@example.com",
        role: "QA",
        department: "Engineering",
        status: "Inactive",
        joinDate: new Date("2023-11-20"),
        avatar: "https://i.pravatar.cc/150?u=amelia"
    },
    {
        name: "Harry Potter",
        email: "harry.p@example.com",
        role: "Intern",
        department: "Design",
        status: "Active",
        joinDate: new Date("2023-06-01"),
        avatar: "https://i.pravatar.cc/150?u=harry"
    },
    {
        name: "Luna Lovegood",
        email: "luna.l@example.com",
        role: "Designer",
        department: "Marketing",
        status: "Active",
        joinDate: new Date("2023-01-01"),
        avatar: "https://i.pravatar.cc/150?u=luna"
    },
    {
        name: "Albus Dumbledore",
        email: "albus.d@example.com",
        role: "Manager",
        department: "Executive",
        status: "Active",
        joinDate: new Date("2023-01-01"),
        avatar: "https://i.pravatar.cc/150?u=albus"
    },
    {
        name: "Peter Parker",
        email: "peter.p@example.com",
        role: "Intern",
        department: "Engineering",
        status: "Probation",
        joinDate: new Date("2024-02-10"),
        avatar: "https://i.pravatar.cc/150?u=peter"
    },
    {
        name: "Bruce Wayne",
        email: "bruce.w@example.com",
        role: "Manager",
        department: "Executive",
        status: "Active",
        joinDate: new Date("2022-12-01"),
        avatar: "https://i.pravatar.cc/150?u=bruce"
    },
    {
        name: "Clark Kent",
        email: "clark.k@example.com",
        role: "Developer",
        department: "Product",
        status: "Active",
        joinDate: new Date("2023-07-15"),
        avatar: "https://i.pravatar.cc/150?u=clark"
    },
    {
        name: "Diana Prince",
        email: "diana.prince@example.com",
        role: "QA",
        department: "Engineering",
        status: "Active",
        joinDate: new Date("2023-11-25"),
        avatar: "https://i.pravatar.cc/150?u=diana"
    },
    {
        name: "Barry Allen",
        email: "barry.a@example.com",
        role: "Developer",
        department: "Engineering",
        status: "Active",
        joinDate: new Date("2024-02-05"),
        avatar: "https://i.pravatar.cc/150?u=barry"
    },
    {
        name: "Hal Jordan",
        email: "hal.j@example.com",
        role: "Designer",
        department: "Design",
        status: "Active",
        joinDate: new Date("2023-05-20"),
        avatar: "https://i.pravatar.cc/150?u=hal"
    },
    {
        name: "Arthur Curry",
        email: "arthur.c@example.com",
        role: "Manager",
        department: "Operations",
        status: "Active",
        joinDate: new Date("2023-08-30"),
        avatar: "https://i.pravatar.cc/150?u=arthur"
    },
    {
        name: "Victor Stone",
        email: "victor.s@example.com",
        role: "QA",
        department: "Engineering",
        status: "Probation",
        joinDate: new Date("2024-01-15"),
        avatar: "https://i.pravatar.cc/150?u=victor"
    },
    {
        name: "Stephen Strange",
        email: "stephen.s@example.com",
        role: "Manager",
        department: "Executive",
        status: "On Leave",
        joinDate: new Date("2023-04-01"),
        avatar: "https://i.pravatar.cc/150?u=strange"
    },
    {
        name: "Natasha Romanoff",
        email: "natasha.r@example.com",
        role: "QA",
        department: "HR",
        status: "Active",
        joinDate: new Date("2023-09-10"),
        avatar: "https://i.pravatar.cc/150?u=natasha"
    },
    {
        name: "Wanda Maximoff",
        email: "wanda.m@example.com",
        role: "Designer",
        department: "Design",
        status: "Active",
        joinDate: new Date("2023-12-05"),
        avatar: "https://i.pravatar.cc/150?u=wanda"
    },
    {
        name: "Vision",
        email: "vision@example.com",
        role: "Developer",
        department: "Engineering",
        status: "Active",
        joinDate: new Date("2024-02-08"),
        avatar: "https://i.pravatar.cc/150?u=vision"
    },
    {
        name: "Sam Wilson",
        email: "sam.w@example.com",
        role: "Intern",
        department: "Marketing",
        status: "Active",
        joinDate: new Date("2023-10-25"),
        avatar: "https://i.pravatar.cc/150?u=sam"
    },
    {
        name: "Bucky Barnes",
        email: "bucky.b@example.com",
        role: "QA",
        department: "Operations",
        status: "Active",
        joinDate: new Date("2023-06-15"),
        avatar: "https://i.pravatar.cc/150?u=bucky"
    },
    {
        name: "Carol Danvers",
        email: "carol.d@example.com",
        role: "Manager",
        department: "Sales",
        status: "Active",
        joinDate: new Date("2023-02-20"),
        avatar: "https://i.pravatar.cc/150?u=carol"
    }
];

const seedEmployees = async () => {
    try {
        await connectDB();

        // Clear existing employees
        await Employee.deleteMany({});
        console.log('Cleared existing employees');

        // Insert seed data
        await Employee.insertMany(employees);
        console.log('Seeded 20 employees successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedEmployees();
