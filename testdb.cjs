const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const db = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
    const { data: feedData } = await db.from('jobs_jobs').select('*').limit(1);
    console.log("FROM FEED:", feedData[0].id);

    const id = feedData[0].id;
    const { data: singleData, error } = await db.from('jobs_jobs').select('*').eq('id', id).maybeSingle();
    console.log("FROM SINGLE GET:", !!singleData);
    if (!singleData) console.log("ERROR IS:", error);
}
test();
