import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

declare global {
  interface Window {
    Clerk: {
      session?: {
        getToken: (options: { template: string }) => Promise<string>;
      };
    };
  }
}

function createClerkSupabaseClient() {
  console.log("createClerkSupabaseClient called"); 
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        try {
          if (typeof window !== 'undefined' && window.Clerk && window.Clerk.session) {
            const clerkToken = await window.Clerk.session.getToken({
              template: 'supabase',
            });

            const headers = new Headers(options?.headers);
            headers.set('Authorization', `Bearer ${clerkToken}`);

            return fetch(url, {
              ...options,
              headers,
            });
          } else {
            return fetch(url, options);
          }
        } catch (error) {
          console.error('Error fetching with Clerk token:', error);
          throw error;
        }
      },
    },
  });
}

export const client = createClerkSupabaseClient();
