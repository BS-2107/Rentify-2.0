// Simple test to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://awngilvqwxukikhtfmjw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bmdpbHZxd3h1a2lraHRmbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzIxMDAsImV4cCI6MjA3MjgwODEwMH0.oB4A0uKSZDuuijeDmkYqm0zT6jxHJOJ5u_6P-z_CbZk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('payments').select('count', { count: 'exact' });
    
    if (error) {
      console.error('Supabase connection error:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('Payments table exists with', data.length, 'records');
    }
    
    // Test insert
    console.log('\nTesting insert...');
    const testPayment = {
      payment_id: 'TEST_' + Date.now(),
      amount: 99.99,
      currency: 'USD',
      status: 'COMPLETED',
      tool_name: 'Test Tool',
      quantity: 1,
      duration: '1 month',
      customer_email: 'test@example.com',
      customer_name: 'Test User',
      payment_method: 'PayPal'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('payments')
      .insert([testPayment])
      .select();
    
    if (insertError) {
      console.error('Insert error:', insertError);
    } else {
      console.log('✅ Test payment inserted successfully:', insertData);
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
