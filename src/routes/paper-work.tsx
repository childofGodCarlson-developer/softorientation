import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/site-chrome";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/paper-work")({ component: PaperWorkPage });

type LetterType = "motivation" | "application" | "personal";
type FormState = {
  name: string;
  address: string;
  email: string;
  phone: string;
  university: string;
  programme: string;
  qualification: string;
  experience: string;
  reasons: string;
  goals: string;
  strengths: string;
};

const initial: FormState = {
  name: "",
  address: "",
  email: "",
  phone: "",
  university: "",
  programme: "",
  qualification: "",
  experience: "",
  reasons: "",
  goals: "",
  strengths: "",
};

const templates: Record<LetterType, string[]> = {
  motivation: ["Academic focus", "Career change", "Scholarship-focused"],
  application: ["Formal admission", "Transfer applicant", "Graduate applicant"],
  personal: ["Personal journey", "Community impact", "Research potential"],
};

function PaperWorkPage() {
  const { t } = useI18n();
  const [type, setType] = useState<LetterType>("motivation");
  const [template, setTemplate] = useState(templates.motivation[0]);
  const [form, setForm] = useState<FormState>(initial);
  const [letter, setLetter] = useState("");
  const update = (key: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const generate = (event: FormEvent) => {
    event.preventDefault();
    const salutation =
      type === "application" ? "Subject: Application for admission" : "Dear Admissions Committee,";
    const opening =
      type === "personal"
        ? `My journey toward ${form.programme} has been shaped by curiosity, persistence and a desire to use education in service of others.`
        : `I am writing to ${type === "motivation" ? "express my strong motivation to join" : "formally apply for admission to"} ${form.programme} at ${form.university}.`;
    const focus =
      type === "application"
        ? `I respectfully request consideration for admission and am prepared to complete every academic, administrative and language requirement for this programme.`
        : `The programme is a natural next step because ${form.reasons}. It connects my preparation with my goal to ${form.goals}.`;
    setLetter(
      `${form.name}\n${form.address}\n${form.email} | ${form.phone}\n\n${new Date().toLocaleDateString()}\n\n${salutation}\n\n${opening} I hold ${form.qualification} and have developed my interest through ${form.experience || "academic studies, independent learning and personal projects"}.\n\n${focus}\n\nMy strengths include ${form.strengths || "discipline, collaboration, clear communication and a willingness to learn from feedback"}. I would bring a thoughtful and dependable attitude to your classrooms, projects and wider student community. I understand that successful study requires consistent work, respect for different perspectives and responsible use of university resources.\n\nI have researched the expectations of ${form.university} and I am particularly attracted by the opportunity to learn in an international academic environment. I will contribute through active participation, honest work and the practical experience I have gained so far. My long-term objective is to ${form.goals}, while remaining open to mentorship and new responsibilities.\n\nThank you for considering this ${template.toLowerCase()} draft. I would welcome the opportunity to provide transcripts, references or any additional information required. I look forward to the possibility of joining your institution and contributing positively to its academic community.\n\nYours faithfully,\n${form.name}`,
    );
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
          {t("page.paperwork")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
          {t("page.paperwork.title")}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {t("page.paperwork.lead")} Choose a style, complete the form and personalise the generated
          draft before sending it.
        </p>
        <form
          onSubmit={generate}
          className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2"
        >
          <label className="text-sm font-medium">
            Letter type
            <select
              value={type}
              onChange={(e) => {
                const next = e.target.value as LetterType;
                setType(next);
                setTemplate(templates[next][0]);
              }}
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
            >
              <option value="motivation">Motivation letter</option>
              <option value="personal">Personal statement</option>
              <option value="application">Application letter</option>
            </select>
          </label>
          <label className="text-sm font-medium">
            Template style
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
            >
              {templates[type].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          {(
            [
              "name",
              "address",
              "email",
              "phone",
              "university",
              "programme",
              "qualification",
            ] as const
          ).map((key) => (
            <label key={key} className="text-sm font-medium capitalize">
              {key}
              <input
                required
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              />
            </label>
          ))}
          {(
            [
              ["experience", "Academic experience"],
              ["reasons", "Why this university/programme?"],
              ["goals", "Career goals"],
              ["strengths", "Strengths, achievements or community work"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="text-sm font-medium sm:col-span-2">
              {label}
              <textarea
                required={key !== "experience" && key !== "strengths"}
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                className="mt-1 min-h-20 w-full rounded-xl border border-input bg-background px-3 py-2"
              />
            </label>
          ))}
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground sm:col-span-2"
          >
            Generate longer draft
          </button>
        </form>
        {letter && (
          <section className="mt-8 rounded-2xl border border-secondary/40 bg-secondary/5 p-6">
            <h2 className="font-display text-xl font-semibold">Generated draft</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              This is an assisted writing template, not legal or admissions advice. Verify every
              claim and requirement.
            </p>
            <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {letter}
            </pre>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(letter)}
              className="mt-5 rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary"
            >
              Copy letter
            </button>
          </section>
        )}
      </section>
    </PageShell>
  );
}
