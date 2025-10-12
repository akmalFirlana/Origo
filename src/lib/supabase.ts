import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        cache: "no-store",
      });
    },
  },
});

export async function createSupabaseServerClient() {
  const { getToken } = await auth();
  let token: string | null = null;

  try {
    token = await getToken({ template: "supabase" });
  } catch (error) {
    const maybeError = error as { status?: number } | undefined;

    if (maybeError?.status === 404) {
      console.warn(
        "Supabase token template not found in Clerk; falling back to default session token.",
      );

      token = await getToken();
    } else {
      throw error;
    }
  }
  const token = await getToken({ template: "supabase" });

  const globalHeaders: Record<string, string> = {};
  if (token) {
    globalHeaders.Authorization = `Bearer ${token}`;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: globalHeaders,
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          cache: "no-store",
        });
      },
    },
  });
}
