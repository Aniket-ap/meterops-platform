const jwt = require('jsonwebtoken');
// const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

async function run() {
  const timestamp = Date.now();
  const email = `debug.billing.${timestamp}@example.com`;
  const password = 'Password123!';
  const domain = `billing-debug-${timestamp}`;

  console.log(`1. Registering tenant: ${email}`);
  
  const regRes = await fetch(`${API_URL}/auth/register-tenant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyName: 'Billing Debug Corp',
      domain,
      email,
      password
    })
  });

  const regData = await regRes.json();
  if (!regRes.ok) {
    console.error('Registration failed:', regData);
    return;
  }
  
  const token = regData.token;
  console.log('   Token obtained.');

  console.log('\n2. Fetching Billing Summary...');
  const summaryRes = await fetch(`${API_URL}/billing/summary`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const summaryData = await summaryRes.json();
  console.log('   Status:', summaryRes.status);
  console.log('   Data:', JSON.stringify(summaryData, null, 2));

  console.log('\n3. Fetching Invoices...');
  const invoicesRes = await fetch(`${API_URL}/billing/invoices`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const invoicesData = await invoicesRes.json();
  console.log('   Status:', invoicesRes.status);
  console.log('   Data:', JSON.stringify(invoicesData, null, 2));
}

run();
