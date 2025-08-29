import { supabase } from './supabase';

export async function saveUserExtensions(userId: string, extensions: string[]) {
  const { data, error } = await supabase
    .from('user_extensions')
    .upsert(
      { user_id: userId, extensions },
      { onConflict: 'user_id' });
  console.log('[saveUserExtensions] Supabase response - data:', data);
  console.log('[saveUserExtensions] Supabase response - error:', error);
  if (error) {
    console.error('[saveUserExtensions] Supabase error (after logging):', error);
    throw error;
  }
  return data;
}

export async function getUserExtensions(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_extensions')
    .select('extensions')
    .eq('user_id', userId)
    .single();
  if (error) return [];
  return data?.extensions ?? [];
}
