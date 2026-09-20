import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { submitContactForm } from "@/lib/api/contact";
import { MonoLabel, Tape } from "@/components/ui/paper-bits";

const schema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(255, "Email is too long"),
  message: z
    .string()
    .trim()
    .min(1, "Please write a message")
    .max(1000, "Message must be under 1000 characters"),
});

const fieldClass =
  "mt-1.5 w-full rounded-[3px] border border-border bg-background px-3 py-2.5 font-mono text-[13px] text-ink outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary";

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    setSending(true);
    const result = await submitContactForm(parsed.data);
    setSending(false);

    if (!result.success) {
      toast.error(result.message || "Message could not be sent. Please try email instead.");
      return;
    }
    toast.success(result.message || "Message sent — I'll get back to you soon.");
    setValues({ name: "", email: "", message: "" });
  };

  return (
    <form
      onSubmit={submit}
      className="paper relative h-full rotate-[0.6deg] p-5 sm:p-7"
      noValidate
    >
      <Tape className="-top-3 left-10 w-24 -rotate-2" />

      <MonoLabel>Message form</MonoLabel>
      <h3 className="mt-1 font-display text-xl font-semibold text-ink">
        Send a note
      </h3>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="cf-name" className="mono-label">
            Name
          </label>
          <input
            id="cf-name"
            value={values.name}
            maxLength={100}
            required
            aria-required="true"
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className={fieldClass}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="cf-email" className="mono-label">
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            value={values.email}
            maxLength={255}
            required
            aria-required="true"
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="cf-message" className="mono-label">
            Message
          </label>
          <textarea
            id="cf-message"
            rows={5}
            value={values.message}
            maxLength={1000}
            required
            aria-required="true"
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
            className={`${fieldClass} resize-none`}
            placeholder="What would you like to build?"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="group mt-6 inline-flex items-center gap-2 rounded-[3px] bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send message"}
        <Send className="size-3.5 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
