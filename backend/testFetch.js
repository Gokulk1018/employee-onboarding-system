async function test() {
    console.log("--- START FETCH TEST ---");
    const id = '698e97f0ff329f1d86abf3e7';
    const url = `http://localhost:5000/api/offers/${id}/convert`;

    try {
        console.log(`Connecting to: ${url}`);
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        console.log(`Response Status: ${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log("Response Data:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("CRITICAL FETCH ERROR:", e.message);
        if (e.code) console.error("Error Code:", e.code);
    }
    console.log("--- END FETCH TEST ---");
}

test();
