const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://rfpntwzclroksoajwqjm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcG50d3pjbHJva3NvYWp3cWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODI5NzMsImV4cCI6MjEwMDY1ODk3M30.0OSMCeiFJsigNjRNq8uqrHHLps9dlRzC-pfXqmtOPno');

async function run() {
  const { data, error } = await supabase.from('transactions').insert({
    invoice_no: 'TEST-TX-' + Date.now(),
    type: 'pengeluaran'
  });
  console.log('TX Insert Error:', error);
}
run();
