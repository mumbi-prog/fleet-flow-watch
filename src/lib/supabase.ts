import { createClient } from '@supabase/supabase-js';
import type { Database } from './database-types';

// For Lovable's native Supabase integration, environment variables are injected differently
// Using window.location.origin as fallback for development
const supabaseUrl = 'https://oawyeiytpcyrztbdzhgn.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hd3llaXl0cGN5cnp0YmR6aGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTE0MTEsImV4cCI6MjA3Mjk4NzQxMX0.8w9ruMqA-GMvdsMfMagbsHAvCcPitdMFlI02kKO_4ps'; // Replace with your Supabase anon key

// Create a placeholder client that will be replaced when you add your Supabase credentials
// export const supabase = createClient<Database>(
//   supabaseUrl || 'https://placeholder.supabase.co',
//   supabaseAnonKey || 'placeholder-key'
// );
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);


// Auth helpers
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
};