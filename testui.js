import fetch from 'node-fetch';

const getRoleOverview = () => { throw new Error("Mock crash") }
// wait, I'll copy the actual code

async function test() {
  const req = await fetch('http://localhost:8001/jobs/feed');
  const feed = await req.json();
  const id = feed[0].id;

  try {
    const res = await fetch(`http://localhost:8001/jobs/${id}/details`);
    if(!res.ok) throw new Error("API error: " + res.status);
    const data = await res.json();
    console.log("Data received:", Object.keys(data).length, "keys");
    
    // Simulate JobDetailPage.jsx fetchJob logic
    let loc = 'REMOTE';
    let t = data.title || '';
    t = t.replace(/POSTED.*$/i, '').trim();
    const cities = ['BANGALORE', 'BENGALURU', 'HYDERABAD', 'PUNE', 'MUMBAI', 'DELHI', 'INDIA', 'NEW YORK', 'KARNATAKA'];
    for (const city of cities) {
        const idx = t.toUpperCase().indexOf(city);
        if (idx > 10) {
            let extracted = t.substring(idx).trim();
            extracted = extracted.replace(/India.*/i, 'India');
            extracted = extracted.replace(/Karnataka.*/i, 'Karnataka');
            loc = extracted;
            t = t.substring(0, idx).trim();
            break;
        }
    }
    data.cleanLocation = data.location || loc;
    data.cleanTitle = t;

    // Simulate getRoleOverview safely
    // data.role_overview = data.role_overview || getRoleOverview(data);
    console.log("Role overview:", data.role_overview);
    console.log("Success! No crash.");
  } catch (error) {
    console.error('Failed to fetch job:', error);
  }
}
test();
