import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Boxes,
  Briefcase,
  FileText,
  BarChart3,
  Mail,
  LogOut,
  Lock,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Eye,
  Upload,
  RefreshCw,
} from "lucide-react";
import { useAdminAuth, signInAdmin, signOutAdmin } from "@/lib/api/auth";
import {
  getAllProjectsAdmin,
  createProjectAdmin,
  updateProjectAdmin,
  deleteProjectAdmin,
  type DbProject,
} from "@/lib/api/projects";
import {
  getContactMessagesAdmin,
  updateMessageStatusAdmin,
  deleteMessageAdmin,
  type DbContactMessage,
} from "@/lib/api/contact";
import {
  getAllResumesAdmin,
  uploadNewResumeAdmin,
  setActiveResumeAdmin,
  deleteResumeAdmin,
  type DbResumeDocument,
} from "@/lib/api/resume";
import { getAnalyticsAdmin, type DbAnalyticsEvent } from "@/lib/api/analytics";
import { uploadFileAdmin } from "@/lib/api/storage";
import { MonoLabel, Tape } from "@/components/ui/paper-bits";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Portal — Abhijit Das Portfolio" }],
  }),
  component: AdminPage,
});

type Tab = "dashboard" | "projects" | "messages" | "resume" | "analytics";

function AdminPage() {
  const { session, isAuthenticated, loading } = useAdminAuth();
  const [tab, setTab] = useState<Tab>("dashboard");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background font-mono text-sm text-ink">
        <div className="flex items-center gap-3 rounded-[3px] border border-border bg-paper p-6 shadow-sm">
          <span className="size-2 animate-ping rounded-full bg-primary" />
          Authenticating System...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-[3px] border border-ink bg-primary font-mono text-xs font-bold text-primary-foreground">
              AD
            </span>
            <div>
              <h1 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-ink">
                Admin Control
              </h1>
              <p className="mono-label text-[9px] text-primary">// PORTFOLIO V1 CMS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden font-mono text-[11px] text-muted-foreground sm:inline-block">
              {session?.user?.email}
            </span>
            <button
              onClick={() => void signOutAdmin()}
              className="flex items-center gap-1.5 rounded-[3px] border border-border bg-background px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-destructive hover:text-destructive"
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-dashed border-rule bg-paper/50">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-4 py-2 sm:px-6">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "projects", label: "Projects CMS", icon: Briefcase },
            { id: "messages", label: "Messages", icon: Mail },
            { id: "resume", label: "Resume Manager", icon: FileText },
            { id: "analytics", label: "Analytics", icon: Boxes },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as Tab)}
                className={`flex items-center gap-2 rounded-[3px] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  isActive
                    ? "border border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border border-transparent text-muted-foreground hover:border-border hover:bg-paper hover:text-ink"
                }`}
              >
                <Icon className="size-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        {tab === "dashboard" && <AdminDashboardOverview onNavigate={(t) => setTab(t)} />}
        {tab === "projects" && <AdminProjectsCMS />}
        {tab === "messages" && <AdminMessagesManager />}
        {tab === "resume" && <AdminResumeManager />}
        {tab === "analytics" && <AdminAnalyticsDashboard />}
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ADMIN LOGIN FORM                                                           */
/* -------------------------------------------------------------------------- */

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signInAdmin(email, password);
    setSubmitting(false);

    if (error) {
      toast.error(error || "Invalid login credentials");
    } else {
      toast.success("Welcome back, Admin");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="paper relative w-full max-w-md rotate-[-0.5deg] p-6 sm:p-8"
      >
        <Tape className="-top-3 left-10 w-24 -rotate-2" />
        <div className="flex items-center gap-2 border-b border-dashed border-rule pb-3">
          <Lock className="size-4 text-primary" />
          <MonoLabel>Authorized Access Only</MonoLabel>
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-ink">
          Admin Portal Login
        </h2>
        <p className="mt-1 font-mono text-[11.5px] leading-relaxed text-muted-foreground">
          Sign in with your owner credentials to manage portfolio projects, messages, resume and analytics.
        </p>

        <div className="mt-6 space-y-4 font-mono">
          <div>
            <label className="mono-label block pb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full rounded-[3px] border border-border bg-background px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mono-label block pb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-[3px] border border-border bg-background px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-[3px] bg-primary py-3 font-mono text-xs uppercase tracking-[0.16em] text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {submitting ? "Verifying…" : "Authenticate →"}
        </button>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. DASHBOARD OVERVIEW                                                      */
/* -------------------------------------------------------------------------- */

function AdminDashboardOverview({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    featuredProjects: 0,
    unreadMessages: 0,
    activeResume: "Standard Static PDF",
    totalEvents: 0,
  });

  useEffect(() => {
    void Promise.all([
      getAllProjectsAdmin().catch(() => []),
      getContactMessagesAdmin().catch(() => []),
      getAllResumesAdmin().catch(() => []),
      getAnalyticsAdmin().catch(() => ({ events: [], counts: {} })),
    ]).then(([projects, messages, resumes, analytics]) => {
      const activeRes = resumes.find((r) => r.is_active);
      setStats({
        totalProjects: projects.length,
        publishedProjects: projects.filter((p) => p.status === "published").length,
        featuredProjects: projects.filter((p) => p.featured).length,
        unreadMessages: messages.filter((m) => m.status === "unread").length,
        activeResume: activeRes ? `${activeRes.file_name} (${activeRes.version})` : "Static Resume PDF",
        totalEvents: analytics.events.length,
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-dashed border-rule pb-4">
        <div>
          <MonoLabel>System Overview</MonoLabel>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Dashboard</h2>
        </div>
        <MonoLabel>Live Metrics</MonoLabel>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          onClick={() => onNavigate("projects")}
          className="paper cursor-pointer p-5 transition-transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <MonoLabel>Projects CMS</MonoLabel>
            <Briefcase className="size-4 text-primary" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-ink">{stats.totalProjects}</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            {stats.publishedProjects} Published · {stats.featuredProjects} Featured
          </p>
        </div>

        <div
          onClick={() => onNavigate("messages")}
          className="paper cursor-pointer p-5 transition-transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <MonoLabel>Inbox</MonoLabel>
            <Mail className="size-4 text-primary" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-ink">{stats.unreadMessages}</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            {stats.unreadMessages > 0 ? "Unread contact messages" : "All messages read"}
          </p>
        </div>

        <div
          onClick={() => onNavigate("resume")}
          className="paper cursor-pointer p-5 transition-transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <MonoLabel>Resume Status</MonoLabel>
            <FileText className="size-4 text-primary" />
          </div>
          <p className="mt-3 truncate font-mono text-sm font-semibold text-ink">
            {stats.activeResume}
          </p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">Click to upload or manage</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. PROJECT CMS                                                             */
/* -------------------------------------------------------------------------- */

function AdminProjectsCMS() {
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<DbProject> | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllProjectsAdmin();
      setProjects(data);
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleSave = async (data: Partial<DbProject>) => {
    if (!data.title || !data.slug || !data.summary) {
      toast.error("Title, slug, and summary are required.");
      return;
    }

    try {
      if (data.id) {
        await updateProjectAdmin(data.id, data);
        toast.success("Project updated.");
      } else {
        await createProjectAdmin({
          slug: data.slug,
          index_label: data.index_label || "00" + (projects.length + 1),
          title: data.title,
          subtitle: data.subtitle || "Full-Stack Project",
          summary: data.summary,
          highlights: data.highlights || [],
          stack: data.stack || [],
          image_url: data.image_url || "/placeholder.svg",
          image_alt: data.image_alt || data.title,
          live_url: data.live_url || null,
          github_url: data.github_url || "https://github.com/abhijit5996",
          status: data.status || "published",
          featured: !!data.featured,
          year: data.year || "2026",
          sort_order: data.sort_order ?? projects.length + 1,
        });
        toast.success("Project created.");
      }
      setEditing(null);
      void loadData();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project from database?")) return;
    try {
      await deleteProjectAdmin(id);
      toast.success("Project deleted.");
      void loadData();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploadingImg(true);
    try {
      const url = await uploadFileAdmin(file, "portfolio-assets", "projects");
      toast.success("Image uploaded successfully.");
      return url;
    } catch (err: unknown) {
      toast.error((err as Error).message);
      return "";
    } finally {
      setUploadingImg(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-rule pb-4">
        <div>
          <MonoLabel>Content Management</MonoLabel>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Projects CMS</h2>
        </div>
        <button
          onClick={() =>
            setEditing({
              title: "",
              slug: "",
              index_label: `00${projects.length + 1}`,
              subtitle: "",
              summary: "",
              highlights: [],
              stack: [],
              github_url: "https://github.com/abhijit5996",
              status: "published",
              featured: false,
              year: "2026",
              sort_order: projects.length + 1,
            })
          }
          className="flex items-center gap-1.5 rounded-[3px] bg-primary px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-primary-foreground shadow-sm hover:opacity-90"
        >
          <Plus className="size-4" />
          Add New Project
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-muted-foreground">Loading projects...</div>
      ) : (
        <div className="grid gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="paper flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.image_url}
                  alt={p.image_alt}
                  className="size-16 rounded-[3px] border border-border object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">[{p.index_label}]</span>
                    <h3 className="font-display text-lg font-bold text-ink">{p.title}</h3>
                    <span
                      className={`rounded-[3px] border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                        p.status === "published"
                          ? "border-emerald-500/40 bg-emerald-50 text-emerald-700"
                          : "border-amber-500/40 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                    {p.featured ? (
                      <span className="rounded-[3px] border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase text-primary">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{p.subtitle}</p>
                  {p.stack && p.stack.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.stack.map((tech, idx) => (
                        <span key={idx} className="rounded-[2px] border border-border/60 bg-paper/60 px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(p)}
                  className="flex items-center gap-1 rounded-[3px] border border-border bg-background px-3 py-1.5 font-mono text-xs text-ink hover:border-primary"
                >
                  <Edit className="size-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => void handleDelete(p.id)}
                  className="flex items-center gap-1 rounded-[3px] border border-border bg-background px-3 py-1.5 font-mono text-xs text-destructive hover:border-destructive"
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comprehensive Edit / Create Modal */}
      {editing ? (
        <ProjectModalForm
          initialData={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          uploadingImg={uploadingImg}
          onImageUpload={handleImageUpload}
        />
      ) : null}
    </div>
  );
}

function ProjectModalForm({
  initialData,
  onSave,
  onCancel,
  uploadingImg,
  onImageUpload,
}: {
  initialData: Partial<DbProject>;
  onSave: (data: Partial<DbProject>) => Promise<void>;
  onCancel: () => void;
  uploadingImg: boolean;
  onImageUpload: (file: File) => Promise<string>;
}) {
  const [form, setForm] = useState<Partial<DbProject>>(initialData);
  const [stackInput, setStackInput] = useState((initialData.stack || []).join(", "));
  const [highlightsInput, setHighlightsInput] = useState((initialData.highlights || []).join("\n"));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.summary) {
      toast.error("Title, slug, and summary are required.");
      return;
    }

    const stack = stackInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const highlights = highlightsInput
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean);

    void onSave({
      ...form,
      stack,
      highlights,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="paper my-8 w-full max-w-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto font-mono text-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-dashed border-rule pb-3">
          <h3 className="font-display text-xl font-bold text-ink">
            {form.id ? "Edit Project" : "New Project"}
          </h3>
          <span className="mono-label text-[10px] text-primary">
            {form.id ? `ID: ${form.id}` : "Creation Mode"}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Title */}
          <div>
            <label className="mono-label block pb-1">Title *</label>
            <input
              type="text"
              value={form.title || ""}
              onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))}
              required
              placeholder="e.g. FitEats"
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mono-label block pb-1">Slug *</label>
            <input
              type="text"
              value={form.slug || ""}
              onChange={(e) => setForm((v) => ({ ...v, slug: e.target.value }))}
              required
              placeholder="e.g. fiteats"
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="mono-label block pb-1">Subtitle</label>
            <input
              type="text"
              value={form.subtitle || ""}
              onChange={(e) => setForm((v) => ({ ...v, subtitle: e.target.value }))}
              placeholder="e.g. Food Ordering & Recommendation Platform"
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
          </div>

          {/* Index Label */}
          <div>
            <label className="mono-label block pb-1">Index Label (e.g. 001, 002)</label>
            <input
              type="text"
              value={form.index_label || ""}
              onChange={(e) => setForm((v) => ({ ...v, index_label: e.target.value }))}
              placeholder="001"
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
          </div>

          {/* Year */}
          <div>
            <label className="mono-label block pb-1">Year</label>
            <input
              type="text"
              value={form.year || "2026"}
              onChange={(e) => setForm((v) => ({ ...v, year: e.target.value }))}
              placeholder="2026"
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="mono-label block pb-1">Sort Order Number</label>
            <input
              type="number"
              value={form.sort_order ?? 1}
              onChange={(e) => setForm((v) => ({ ...v, sort_order: parseInt(e.target.value) || 0 }))}
              placeholder="1"
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
          </div>

          {/* Summary */}
          <div className="sm:col-span-2">
            <label className="mono-label block pb-1">Summary *</label>
            <textarea
              rows={3}
              value={form.summary || ""}
              onChange={(e) => setForm((v) => ({ ...v, summary: e.target.value }))}
              required
              placeholder="A brief overview of the application purpose and features..."
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
          </div>

          {/* Tech Stack */}
          <div className="sm:col-span-2">
            <label className="mono-label block pb-1">
              Tech Stack / Technologies Used (Comma-separated)
            </label>
            <input
              type="text"
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              placeholder="React.js, Node.js, Express.js, MongoDB"
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
            {stackInput ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {stackInput
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((tech, idx) => (
                    <span
                      key={idx}
                      className="rounded-[3px] border border-border bg-paper px-2 py-0.5 text-[10px] text-ink"
                    >
                      {tech}
                    </span>
                  ))}
              </div>
            ) : null}
          </div>

          {/* Key Project Highlights & Features */}
          <div className="sm:col-span-2">
            <label className="mono-label block pb-1">
              Key Architecture Highlights & Implementation Details (One bullet point per line)
            </label>
            <textarea
              rows={4}
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              placeholder={`Developed and deployed the full-stack ordering application on Render.
Personalized recommendation engine integrated into the ordering flow.`}
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none font-mono"
            />
          </div>

          {/* GitHub Repo URL */}
          <div>
            <label className="mono-label block pb-1">GitHub Repo URL</label>
            <input
              type="url"
              value={form.github_url || ""}
              onChange={(e) => setForm((v) => ({ ...v, github_url: e.target.value }))}
              placeholder="https://github.com/user/repo"
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
          </div>

          {/* Live Demo URL */}
          <div>
            <label className="mono-label block pb-1">Live Demo URL (Optional)</label>
            <input
              type="url"
              value={form.live_url || ""}
              onChange={(e) => setForm((v) => ({ ...v, live_url: e.target.value }))}
              placeholder="https://app.onrender.com"
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mono-label block pb-1">Status</label>
            <select
              value={form.status || "published"}
              onChange={(e) =>
                setForm((v) => ({ ...v, status: e.target.value as DbProject["status"] }))
              }
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="chk-modal-featured"
              checked={!!form.featured}
              onChange={(e) => setForm((v) => ({ ...v, featured: e.target.checked }))}
              className="size-4 rounded border-border text-primary"
            />
            <label htmlFor="chk-modal-featured" className="mono-label font-bold text-ink cursor-pointer">
              Featured Flagship Project
            </label>
          </div>

          {/* Image Asset URL + File Upload */}
          <div className="sm:col-span-2">
            <label className="mono-label block pb-1">Image Asset URL / Upload</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={form.image_url || ""}
                onChange={(e) => setForm((v) => ({ ...v, image_url: e.target.value }))}
                placeholder="/src/assets/project-fiteats.jpg"
                className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
              />
              <label className="cursor-pointer rounded-[3px] border border-border bg-paper px-3.5 py-2 font-mono text-xs text-ink hover:border-primary shrink-0">
                {uploadingImg ? "Uploading..." : "Upload File"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await onImageUpload(file);
                      setForm((v) => ({ ...v, image_url: url }));
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Image Alt Text */}
          <div className="sm:col-span-2">
            <label className="mono-label block pb-1">Image Alt Text (Accessibility Description)</label>
            <input
              type="text"
              value={form.image_alt || ""}
              onChange={(e) => setForm((v) => ({ ...v, image_alt: e.target.value }))}
              placeholder="FitEats meal ordering interface with nutrition summary"
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-dashed border-rule pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[3px] border border-border bg-background px-4 py-2 font-mono text-xs uppercase text-ink hover:bg-paper"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-[3px] bg-primary px-6 py-2 font-mono text-xs uppercase text-primary-foreground shadow-sm hover:opacity-90"
          >
            Save Project
          </button>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. MESSAGES MANAGER                                                        */
/* -------------------------------------------------------------------------- */

function AdminMessagesManager() {
  const [messages, setMessages] = useState<DbContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "archived">("all");

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getContactMessagesAdmin();
      setMessages(data);
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMessages();
  }, []);

  const handleStatus = async (id: string, status: "unread" | "read" | "archived") => {
    try {
      await updateMessageStatusAdmin(id, status);
      toast.success(`Message marked as ${status}.`);
      void loadMessages();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact message permanently?")) return;
    try {
      await deleteMessageAdmin(id);
      toast.success("Message deleted.");
      void loadMessages();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  };

  const filtered = messages.filter((m) => (filter === "all" ? true : m.status === filter));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-rule pb-4">
        <div>
          <MonoLabel>Inbox</MonoLabel>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Contact Messages</h2>
        </div>

        <div className="flex items-center gap-1 font-mono text-xs">
          {(["all", "unread", "read", "archived"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-[3px] px-3 py-1.5 uppercase transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-paper border border-border text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-muted-foreground">Loading inbox...</div>
      ) : filtered.length === 0 ? (
        <div className="paper p-8 text-center font-mono text-xs text-muted-foreground">No messages found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => (
            <div key={m.id} className="paper p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-rule pb-2">
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-ink">{m.name}</span>
                  <span className="font-mono text-xs text-primary">&lt;{m.email}&gt;</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>

              <p className="mt-3 font-mono text-xs font-semibold text-ink">{m.subject}</p>
              <p className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/85">
                {m.message}
              </p>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-dashed border-rule pt-3">
                {m.status !== "read" ? (
                  <button
                    onClick={() => void handleStatus(m.id, "read")}
                    className="flex items-center gap-1 rounded-[3px] border border-border bg-background px-3 py-1 font-mono text-[10px] uppercase text-ink hover:border-primary"
                  >
                    <CheckCircle2 className="size-3 text-emerald-600" /> Mark Read
                  </button>
                ) : null}
                {m.status !== "archived" ? (
                  <button
                    onClick={() => void handleStatus(m.id, "archived")}
                    className="flex items-center gap-1 rounded-[3px] border border-border bg-background px-3 py-1 font-mono text-[10px] uppercase text-ink hover:border-amber-500"
                  >
                    <XCircle className="size-3 text-amber-600" /> Archive
                  </button>
                ) : null}
                <button
                  onClick={() => void handleDelete(m.id)}
                  className="flex items-center gap-1 rounded-[3px] border border-border bg-background px-3 py-1 font-mono text-[10px] uppercase text-destructive hover:border-destructive"
                >
                  <Trash2 className="size-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. RESUME MANAGER                                                          */
/* -------------------------------------------------------------------------- */

function AdminResumeManager() {
  const [resumes, setResumes] = useState<DbResumeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [versionInput, setVersionInput] = useState("v1.0");

  const loadResumes = async () => {
    setLoading(true);
    try {
      const data = await getAllResumesAdmin();
      setResumes(data);
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadResumes();
  }, []);

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
    const file = fileInput?.files?.[0];

    if (!file) {
      toast.error("Please select a PDF file.");
      return;
    }

    setUploading(true);
    try {
      await uploadNewResumeAdmin(file, versionInput);
      toast.success("New resume uploaded and activated.");
      form.reset();
      void loadResumes();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      await setActiveResumeAdmin(id);
      toast.success("Resume activated.");
      void loadResumes();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete resume document record?")) return;
    try {
      await deleteResumeAdmin(id);
      toast.success("Resume record deleted.");
      void loadResumes();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-rule pb-4">
        <div>
          <MonoLabel>File Management</MonoLabel>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Resume Manager</h2>
        </div>
      </div>

      <form onSubmit={handleUpload} className="paper p-6 font-mono text-xs">
        <h3 className="font-display text-lg font-bold text-ink">Upload New PDF Resume</h3>
        <p className="mt-1 text-muted-foreground">
          Upload a new version to automatically update the public resume button across the site.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mono-label block pb-1">Version Label</label>
            <input
              type="text"
              value={versionInput}
              onChange={(e) => setVersionInput(e.target.value)}
              placeholder="v1.1"
              required
              className="w-full rounded-[3px] border border-border bg-background p-2 text-ink outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mono-label block pb-1">Select PDF File</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              required
              className="w-full rounded-[3px] border border-border bg-background p-1.5 text-ink outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="mt-4 inline-flex items-center gap-2 rounded-[3px] bg-primary px-5 py-2.5 font-mono text-xs uppercase text-primary-foreground disabled:opacity-50"
        >
          <Upload className="size-4" />
          {uploading ? "Uploading PDF..." : "Upload & Set Active"}
        </button>
      </form>

      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-muted-foreground">Loading documents...</div>
      ) : (
        <div className="space-y-3 font-mono text-xs">
          <MonoLabel>Resume Version History</MonoLabel>
          {resumes.map((r) => (
            <div key={r.id} className="paper flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink">{r.file_name}</span>
                  <span className="text-muted-foreground">({r.version || "v1.0"})</span>
                  {r.is_active ? (
                    <span className="rounded-[3px] border border-emerald-500/40 bg-emerald-50 px-2 py-0.5 font-mono text-[9px] uppercase text-emerald-700">
                      Active Public Version
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Uploaded: {new Date(r.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={r.file_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-1 rounded-[3px] border border-border bg-background px-3 py-1 text-ink hover:border-primary"
                >
                  <Eye className="size-3.5" /> View
                </a>
                {!r.is_active ? (
                  <button
                    onClick={() => void handleSetActive(r.id)}
                    className="flex items-center gap-1 rounded-[3px] border border-border bg-background px-3 py-1 text-primary hover:border-primary"
                  >
                    <RefreshCw className="size-3.5" /> Make Active
                  </button>
                ) : null}
                <button
                  onClick={() => void handleDelete(r.id)}
                  className="flex items-center gap-1 rounded-[3px] border border-border bg-background px-3 py-1 text-destructive hover:border-destructive"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. ANALYTICS DASHBOARD                                                      */
/* -------------------------------------------------------------------------- */

function AdminAnalyticsDashboard() {
  const [data, setData] = useState<{ events: DbAnalyticsEvent[]; counts: Record<string, number> }>({
    events: [],
    counts: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getAnalyticsAdmin()
      .then(setData)
      .catch((err: unknown) => toast.error((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-rule pb-4">
        <div>
          <MonoLabel>Telemetrics</MonoLabel>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">First-Party Analytics</h2>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
        {Object.entries(data.counts).map(([evt, count]) => (
          <div key={evt} className="paper p-4">
            <MonoLabel>{evt}</MonoLabel>
            <p className="mt-2 font-display text-2xl font-bold text-ink">{count}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-muted-foreground">Loading event logs...</div>
      ) : (
        <div className="space-y-3 font-mono text-xs">
          <MonoLabel>Recent Event Activity Stream</MonoLabel>
          <div className="paper overflow-x-auto p-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dashed border-rule text-muted-foreground uppercase text-[10px]">
                  <th className="pb-2">Event</th>
                  <th className="pb-2">Path</th>
                  <th className="pb-2">Target / Meta</th>
                  <th className="pb-2 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {data.events.slice(0, 30).map((e) => (
                  <tr key={e.id} className="border-b border-rule/40 last:border-0">
                    <td className="py-2.5 font-bold text-primary">{e.event_name}</td>
                    <td className="py-2.5 text-ink">{e.page_path}</td>
                    <td className="py-2.5 text-muted-foreground">
                      {e.project_id ? `Project: ${e.project_id}` : e.metadata ? JSON.stringify(e.metadata) : "-"}
                    </td>
                    <td className="py-2.5 text-right text-muted-foreground">
                      {new Date(e.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
