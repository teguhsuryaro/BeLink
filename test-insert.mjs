import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://asbmpbwlngkqcoaoxavw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYm1wYndsbmdrcWNvYW94YXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTg0MzAsImV4cCI6MjA5NjEzNDQzMH0.-u-Y_fB5jPstZdX6TGvWuy9A4tTa67V2QZGGlmmQKSg');

async function test() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'mitra1@belink.com',
    password: 'password123'
  });
  
  if (authErr || !authData.user) {
    return console.log('Auth error:', authErr);
  }
  
  const { error } = await supabase.from('deposit_transactions').insert({
    mitra_id: authData.user.id,
    type: 'topup',
    amount: 50000,
    balance_after: 50000,
    notes: 'Test top up'
  });
  console.log('Error from insert:', error);
}
test();
