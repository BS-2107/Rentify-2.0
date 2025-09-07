import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://awngilvqwxukikhtfmjw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bmdpbHZxd3h1a2lraHRmbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzIxMDAsImV4cCI6MjA3MjgwODEwMH0.oB4A0uKSZDuuijeDmkYqm0zT6jxHJOJ5u_6P-z_CbZk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define the payment record interface
export interface PaymentRecord {
  id?: string
  payment_id: string
  payer_id?: string
  amount: number
  currency: string
  status: string
  tool_name: string
  quantity: number
  duration: string
  customer_email?: string
  customer_name?: string
  payment_method: string
  created_at?: string
  updated_at?: string
}

// Function to save payment to Supabase
export async function savePaymentRecord(paymentData: Omit<PaymentRecord, 'id' | 'created_at' | 'updated_at'>) {
  try {
    console.log('💾 Starting Supabase save operation with data:', paymentData);
    
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()

    if (error) {
      console.error('❌ Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error
    }

    console.log('✅ Payment record saved successfully to Supabase:', data)
    return data
  } catch (error) {
    console.error('❌ Failed to save payment record - full error:', error)
    throw error
  }
}

// Function to get payment records
export async function getPaymentRecords() {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payment records:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to fetch payment records:', error)
    throw error
  }
}
