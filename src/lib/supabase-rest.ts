const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
// Clean common copy/paste artifacts (quotes, whitespace, and invisible Unicode marks).
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ?.replace(/[\u200B-\u200D\uFEFF]/g, "")
  .trim()
  .replace(/^(["'])(.*)\1$/, "$2")
  .replace(/\s+/g, "");

export type PortfolioProject = {
  id: number | string;
  title: string;
  description: string | null;
  category: string;
  video_url: string | null;
  file_url?: string | null;
  thumbnail_url: string | null;
  published?: boolean;
  created_at?: string;
};

export function configReady() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

function headers(token?: string, extra: Record<string, string> = {}) {
  if (!SUPABASE_KEY) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
  // Accept only known Supabase public key formats after cleaning copy/paste artifacts.
  if (!/^(sb_publishable_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9._-]+)$/.test(SUPABASE_KEY)) {
    throw new Error("قيمة NEXT_PUBLIC_SUPABASE_ANON_KEY في Vercel مش مفتاح Supabase صالح. انسخ Publishable key أو anon key فقط من Supabase والصقه من جديد.");
  }
  if (token && /[^\x20-\x7E]/.test(token)) {
    throw new Error("جلسة تسجيل الدخول غير صالحة. سجّل الخروج وادخل مرة أخرى.");
  }
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

// The existing Supabase schema uses cover_url + published, so translate them
// to the UI's thumbnail_url field rather than creating a second set of columns.
function normalizeProject(row: any): PortfolioProject {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    category: row.category,
    video_url: row.video_url ?? null,
    file_url: row.file_url ?? null,
    thumbnail_url: row.cover_url ?? row.thumbnail_url ?? null,
    published: row.published ?? row.is_published ?? true,
    created_at: row.created_at,
  };
}

export async function signIn(email: string, password: string) {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  return parseResponse<{access_token: string; refresh_token: string; user: {id: string; email?: string}}>(
    await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: headers(undefined, { "Content-Type": "application/json" }),
      body: JSON.stringify({ email, password }),
    })
  );
}

export async function listProjects(token?: string) {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  const rows = await parseResponse<any[]>(
    await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`, {
      headers: headers(token),
      cache: "no-store",
    })
  );
  return rows.map(normalizeProject);
}

export async function saveProject(
  project: Omit<PortfolioProject, "id" | "created_at" | "published">,
  token: string,
  userId: string,
  id?: string | number
) {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  const editing = id !== undefined;
  const url = `${SUPABASE_URL}/rest/v1/projects${editing ? `?id=eq.${encodeURIComponent(String(id))}` : ""}`;
  const payload: Record<string, unknown> = {
    title: project.title,
    description: project.description,
    category: project.category,
    video_url: project.video_url,
    file_url: project.file_url ?? null,
    cover_url: project.thumbnail_url,
  };
  if (!editing) payload.user_id = userId;
  return parseResponse<any[]>(
    await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: headers(token, {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      }),
      body: JSON.stringify(payload),
    })
  ).then((rows) => rows.map(normalizeProject));
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

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/avif",
  "video/mp4", "video/webm", "video/quicktime", "video/x-matroska",
  "application/pdf", "application/zip", "application/x-zip-compressed", "text/plain",
]);

export async function uploadAsset(file: File, token: string, userId: string) {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("الحد الأقصى لحجم الملف 100 ميجابايت.");
  if (!ALLOWED_UPLOAD_TYPES.has(file.type)) throw new Error("نوع الملف غير مدعوم. استخدم صورة أو فيديو MP4/WebM/MOV/MKV أو PDF أو ZIP أو TXT.");
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(-120) || "upload";
  const path = userId + "/" + Date.now() + "-" + safeName;
  const bucket = "portfolio-assets";
  const uploaded = await fetch(SUPABASE_URL + "/storage/v1/object/" + bucket + "/" + path, {
    method: "POST",
    headers: headers(token, { "Content-Type": file.type, "x-upsert": "false" }),
    body: file,
  });
  await parseResponse<unknown>(uploaded);
  return SUPABASE_URL + "/storage/v1/object/public/" + bucket + "/" + path;
}

export async function uploadCover(file: File, token: string, userId: string) {
  if (!file.type.startsWith("image/")) throw new Error("ملف الغلاف لازم يكون صورة.");
  return uploadAsset(file, token, userId);
}

export async function listPublicProjects() {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  const rows = await parseResponse<any[]>(
    await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*&published=eq.true&order=created_at.desc`, {
      headers: headers(),
      cache: "no-store",
    })
  );
  return rows.map(normalizeProject);
}
