const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type PortfolioProject = {
  id: number | string;
  title: string;
  description: string | null;
  category: string;
  video_url: string | null;
  thumbnail_url: string | null;
  created_at?: string;
};

export function configReady() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

function headers(token?: string, extra: Record<string, string> = {}) {
  if (!SUPABASE_KEY) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${token || SUPABASE_KEY}`,
    ...extra,
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.text();
  let data: any = null;
  try { data = body ? JSON.parse(body) : null; } catch { data = body; }
  if (!response.ok) {
    throw new Error(data?.message || data?.msg || data?.error_description || data?.error || `Supabase request failed (${response.status})`);
  }
  return data as T;
}

export async function signIn(email: string, password: string) {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  return parseResponse<{access_token: string; refresh_token: string; user: {email?: string}}>(
    await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: headers(undefined, { "Content-Type": "application/json" }),
      body: JSON.stringify({ email, password }),
    })
  );
}

export async function listProjects(token?: string) {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  return parseResponse<PortfolioProject[]>(
    await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`, {
      headers: headers(token),
      cache: "no-store",
    })
  );
}

export async function saveProject(
  project: Omit<PortfolioProject, "id" | "created_at">,
  token: string,
  id?: string | number
) {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  const editing = id !== undefined;
  const url = `${SUPABASE_URL}/rest/v1/projects${editing ? `?id=eq.${encodeURIComponent(String(id))}` : ""}`;
  return parseResponse<PortfolioProject[]>(
    await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: headers(token, {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      }),
      body: JSON.stringify(project),
    })
  );
}

export async function deleteProject(id: string | number, token: string) {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  await parseResponse<unknown>(
    await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${encodeURIComponent(String(id))}`, {
      method: "DELETE",
      headers: headers(token, { Prefer: "return=minimal" }),
    })
  );
}

export async function uploadCover(file: File, token: string) {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const path = `${Date.now()}-${safeName}`;
  const bucket = "project-covers";
  const uploaded = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: headers(token, {
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    }),
    body: file,
  });
  await parseResponse<unknown>(uploaded);
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
