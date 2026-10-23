"use client";

import { FormEvent, useEffect, useState } from "react";
import { configReady, deleteProject, listProjects, PortfolioProject, saveProject, signIn, uploadAsset, uploadCover } from "@/lib/supabase-rest";

const categories = ["Reels & Shorts", "YouTube Videos", "Podcasts", "Commercial Ads", "Cinematic Edits", "Motion Design"];

const blankForm = { title: "", description: "", category: categories[0], video_url: "", thumbnail_url: "", file_url: "" };

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [projectSearch, setProjectSearch] = useState("");
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState<string | number | undefined>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio_admin_token");
    if (saved) setToken(saved);
    const savedUserId = window.localStorage.getItem("portfolio_admin_user_id");
    if (savedUserId) setUserId(savedUserId);
  }, []);

  useEffect(() => {
    if (!token) return;
    listProjects(token).then(setProjects).catch((e) => {
      setError(e.message || "تعذر تحميل المشاريع. راجع صلاحيات Supabase والجدول.");
      if (/jwt|token|auth/i.test(e.message || "")) {
        window.localStorage.removeItem("portfolio_admin_token");
        setToken("");
      }
    });
  }, [token]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try {
      const session = await signIn(email.trim(), password);
      window.localStorage.setItem("portfolio_admin_token", session.access_token);
      window.localStorage.setItem("portfolio_admin_user_id", session.user.id);
      setUserId(session.user.id);
      setToken(session.access_token);
      setPassword("");
      setMessage("تم تسجيل الدخول.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل تسجيل الدخول.");
    } finally { setBusy(false); }
  }

  function startEdit(project: PortfolioProject) {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      category: project.category || categories[0],
      video_url: project.video_url || "",
      thumbnail_url: project.thumbnail_url || "",
      file_url: project.file_url || "",
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(undefined);
    setForm(blankForm);
  }

  async function handleUpload(file?: File) {
    if (!file || !token) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const url = await uploadCover(file, token, userId);
      setForm((current) => ({ ...current, thumbnail_url: url }));
      setMessage("اترفعت صورة الغلاف بنجاح.");
    } catch (e) {
      setError((e instanceof Error ? e.message : "فشل رفع الصورة.") + " تأكد من إعدادات bucket باسم portfolio-assets وصلاحيات الرفع.");
    } finally { setBusy(false); }
  }

  async function handleAssetUpload(file?: File) {
    if (!file || !token) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const url = await uploadAsset(file, token, userId);
      if (file.type.startsWith("image/")) {
        setForm((current) => ({ ...current, thumbnail_url: url }));
        setMessage("تم رفع الصورة واستخدامها كغلاف.");
      } else if (file.type.startsWith("video/")) {
        setForm((current) => ({ ...current, file_url: url, video_url: url }));
        setMessage("تم رفع الفيديو. سيظهر كرابط للمشاهدة.");
      } else {
        setForm((current) => ({ ...current, file_url: url }));
        setMessage("تم رفع الملف وإرفاقه بالمشروع.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل رفع الملف.");
    } finally { setBusy(false); }
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    setBusy(true); setError(""); setMessage("");
    try {
      await saveProject({
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        video_url: form.video_url.trim() || null,
        file_url: form.file_url.trim() || null,
        thumbnail_url: form.thumbnail_url.trim() || null,
      }, token, userId, editingId);
      setProjects(await listProjects(token));
      resetForm();
      setMessage(editingId === undefined ? "تمت إضافة المشروع." : "تم تحديث المشروع.");
    } catch (e) {
      setError((e instanceof Error ? e.message : "تعذر حفظ المشروع.") + " لو ظهر خطأ أعمدة، ابعتهولي نصًا.");
    } finally { setBusy(false); }
  }

  async function handleDelete(id: string | number) {
    if (!token || !window.confirm("متأكد إنك عايز تحذف المشروع؟")) return;
    setBusy(true); setError(""); setMessage("");
    try {
      await deleteProject(id, token);
      setProjects(await listProjects(token));
      if (editingId === id) resetForm();
      setMessage("تم حذف المشروع.");
    } catch (e) { setError(e instanceof Error ? e.message : "تعذر حذف المشروع."); }
    finally { setBusy(false); }
  }

  const filteredProjects = projects.filter((project) => `${project.title} ${project.category} ${project.description || ""}`.toLowerCase().includes(projectSearch.trim().toLowerCase()));
  const categoryCount = new Set(projects.map((project) => project.category)).size;
  const projectsWithVideo = projects.filter((project) => Boolean(project.video_url || project.file_url)).length;

  function logout() {
    window.localStorage.removeItem("portfolio_admin_token");
    window.localStorage.removeItem("portfolio_admin_user_id");
    setToken("");
    setUserId(""); setProjects([]); resetForm(); setMessage("تم تسجيل الخروج.");
  }

  return (
    <main className="admin-shell">
      <style jsx global>{`
        body { background:#090909; color:#f5f5f5; }
        .admin-shell { min-height:100vh; padding:clamp(20px,5vw,64px); max-width:1180px; margin:auto; font-family:Arial,sans-serif; }
        .admin-top { display:flex; justify-content:space-between; align-items:center; gap:18px; margin-bottom:34px; }
        .admin-brand { font-size:13px; letter-spacing:3px; color:#aaa; text-transform:uppercase; }
        .admin-brand strong { color:#fff; }
        .admin-shell h1 { font-size:clamp(32px,6vw,54px); letter-spacing:-2px; margin:0 0 10px; }
        .admin-sub { color:#999; margin:0 0 30px; line-height:1.7; }
        .admin-panel { background:#111; border:1px solid #292929; border-radius:18px; padding:clamp(18px,3vw,30px); margin-bottom:24px; }
        .admin-panel h2 { font-size:18px; margin:0 0 20px; }
        .admin-form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:15px; }
        .admin-field { display:flex; flex-direction:column; gap:8px; min-width:0; }
        .admin-field.full { grid-column:1/-1; }
        .admin-field label { color:#bbb; font-size:12px; letter-spacing:1px; }
        .admin-field input,.admin-field textarea,.admin-field select { width:100%; border:1px solid #333; border-radius:9px; padding:13px 14px; background:#080808; color:#fff; font:inherit; outline:none; }
        .admin-field textarea { min-height:95px; resize:vertical; }
        .admin-field input:focus,.admin-field textarea:focus,.admin-field select:focus { border-color:#eee; }
        .admin-actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:18px; }
        .admin-btn { border:1px solid #eee; background:#eee; color:#111; padding:11px 16px; border-radius:999px; cursor:pointer; font-weight:700; }
        .admin-btn.secondary { background:transparent; color:#eee; border-color:#444; }
        .admin-btn.danger { background:transparent; border-color:#6c3333; color:#ffb7b7; }
        .admin-btn:disabled { opacity:.5; cursor:wait; }
        .admin-msg { border-radius:10px; padding:12px 14px; margin:14px 0; background:#15251a; color:#a8f0ba; overflow-wrap:anywhere; }
        .admin-error { background:#2b1717; color:#ffb7b7; }
        .admin-dashboard-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin:0 0 24px; }\n        .admin-stat { padding:18px; border:1px solid #292929; border-radius:14px; background:linear-gradient(145deg,#151515,#0d0d0d); }\n        .admin-stat span { display:block; color:#999; font-size:11px; margin-bottom:10px; }\n        .admin-stat strong { display:block; color:#d6ff3f; font-size:clamp(25px,4vw,36px); letter-spacing:-1px; }\n        .admin-search { width:100%; border:1px solid #333; border-radius:10px; padding:13px 14px; background:#080808; color:#fff; font:inherit; margin-bottom:14px; }\n        .admin-projects { display:grid; gap:12px; }
        .admin-project { display:flex; align-items:center; gap:16px; padding:14px; border:1px solid #292929; border-radius:12px; }
        .admin-project img { width:90px; height:64px; object-fit:cover; border-radius:7px; background:#222; }
        .admin-project-info { flex:1; min-width:0; }
        .admin-project-info strong { display:block; margin-bottom:5px; overflow-wrap:anywhere; }
        .admin-project-info span { color:#999; font-size:12px; }
        .admin-login { max-width:480px; margin:9vh auto; }
        @media(max-width:650px) { .admin-dashboard-stats { grid-template-columns:1fr; } .admin-form-grid { grid-template-columns:1fr; } .admin-field.full { grid-column:auto; } .admin-project { align-items:flex-start; flex-wrap:wrap; } .admin-project-info { min-width:calc(100% - 110px); } }
      `}</style>

      <div className="admin-top">
        <div className="admin-brand"><strong>MUHAMMED MUSTAFA</strong> / ADMIN</div>
        {token && <button className="admin-btn secondary" onClick={logout}>تسجيل الخروج</button>}
      </div>

      {!configReady() && <div className="admin-msg admin-error">متغيرات Supabase غير موجودة في إعدادات Vercel. أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY ثم أعد النشر.</div>}
      {message && <div className="admin-msg">{message}</div>}
      {error && <div className="admin-msg admin-error">{error}</div>}

      {!token ? (
        <section className="admin-panel admin-login">
          <h1>لوحة التحكم.</h1>
          <p className="admin-sub">سجّل الدخول لإدارة مشاريع البورتفوليو.</p>
          <form onSubmit={handleLogin}>
            <div className="admin-form-grid">
              <div className="admin-field full"><label htmlFor="admin-email">EMAIL</label><input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="admin-field full"><label htmlFor="admin-password">PASSWORD</label><input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            </div>
            <div className="admin-actions"><button className="admin-btn" disabled={busy || !configReady()}>{busy ? "جاري الدخول..." : "دخول"}</button><a className="admin-btn secondary" href="/">العودة للموقع</a></div>
          </form>
        </section>
      ) : (
        <>
          <h1>إدارة المشاريع.</h1>
          <p className="admin-sub">أضف مشروعًا جديدًا أو عدّل المشاريع الموجودة. التغييرات تُحفظ في Supabase.</p>
          <section className="admin-panel">
            <h2>{editingId === undefined ? "إضافة مشروع جديد" : "تعديل المشروع"}</h2>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-field"><label htmlFor="project-title">اسم المشروع *</label><input id="project-title" required maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="admin-field"><label htmlFor="project-category">التصنيف *</label><select id="project-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
                <div className="admin-field full"><label htmlFor="project-description">الوصف</label><textarea id="project-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="admin-field full"><label htmlFor="project-video">رابط الفيديو (YouTube / Vimeo / MP4)</label><input id="project-video" type="url" placeholder="https://..." value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} /></div>
                <div className="admin-field full"><label htmlFor="project-cover">صورة الغلاف (رابط أو ارفع صورة)</label><input id="project-cover" type="url" placeholder="https://..." value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} /><input aria-label="رفع صورة الغلاف" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => handleUpload(e.target.files?.[0])} /></div>
                <div className="admin-field full"><label htmlFor="project-asset">رفع فيديو أو ملف للمشروع (حتى 100 ميجابايت)</label><input id="project-asset" type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime,video/x-matroska,application/pdf,application/zip,application/x-zip-compressed,text/plain" onChange={(e) => handleAssetUpload(e.target.files?.[0])} /><input aria-label="رابط الملف المرفق" type="url" placeholder="أو ضع رابط ملف موجود https://..." value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} /></div>
              </div>
              {form.thumbnail_url && <p><img src={form.thumbnail_url} alt="معاينة الغلاف" style={{ maxWidth:220, maxHeight:140, objectFit:"cover", borderRadius:8 }} /></p>}
              <div className="admin-actions"><button className="admin-btn" disabled={busy}>{busy ? "جاري الحفظ..." : editingId === undefined ? "حفظ المشروع" : "حفظ التعديلات"}</button>{editingId !== undefined && <button type="button" className="admin-btn secondary" onClick={resetForm}>إلغاء التعديل</button>}</div>
            </form>
          </section>
          <section className="admin-panel">
            <h2>المشاريع الحالية ({projects.length})</h2>
            {projects.length === 0 ? <p className="admin-sub">لا توجد مشاريع حتى الآن.</p> : <div className="admin-projects">{projects.map((project) => <article className="admin-project" key={project.id}>{project.thumbnail_url ? <img src={project.thumbnail_url} alt="" /> : <div style={{width:90,height:64,background:"#222",borderRadius:7}} />}<div className="admin-project-info"><strong>{project.title}</strong><span>{project.category}</span><span style={{display:"block",marginTop:5,color:project.video_url || project.file_url ? "#d6ff3f" : "#999"}}>{project.video_url || project.file_url ? "● محتوى مرفق" : "○ بدون رابط فيديو/ملف"}</span></div><div className="admin-actions"><button className="admin-btn secondary" onClick={() => startEdit(project)}>تعديل</button><button className="admin-btn danger" onClick={() => handleDelete(project.id)} disabled={busy}>حذف</button></div></article>)}</div>}
          </section>
        </>
      )}
    </main>
  );
}
