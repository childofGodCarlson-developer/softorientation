import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/site-chrome";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/gpa-conversion")({ component: GpaConversionPage });
type Certificate = "gce-al" | "gce-ol" | "bac" | "probatoire" | "ossd" | "ibdp" | "cambridge";
type Subject = { name: string; grade: string };
const labels: Record<Certificate, string> = {
  "gce-al": "Cameroon GCE Advanced Level",
  "gce-ol": "Cameroon GCE Ordinary Level",
  bac: "Baccalauréat",
  probatoire: "Probatoire",
  ossd: "OSSD",
  ibdp: "IB Diploma",
  cambridge: "Cambridge International",
};
const certificateGuidance: Record<Certificate, string> = {
  "gce-al":
    "Preserve the official GCE A-Level grade (A, B, C, D, E, O or F). The 4.0-scale result is an indicative comparison, not an official conversion.",
  "gce-ol":
    "Preserve the official GCE O-Level grade. Use the receiving institution's published subject and grade rules.",
  bac: "Enter each subject mark from 0 to 20. The official result and distinction remain more important than a third-party GPA estimate.",
  probatoire:
    "Enter each mark from 0 to 20. The original Probatoire result remains visible beside all reference comparisons.",
  ossd: "Enter the percentage shown on your transcript. OSSD admission is normally assessed with Grade 12 university-preparation courses.",
  ibdp: "Enter the total IB Diploma points from 0 to 45, or select subjects for an indicative comparison.",
  cambridge:
    "Use Cambridge International A-Level grades (A* to U). Check whether the institution treats Cambridge separately from GCE.",
};
const series: Record<Certificate, Record<string, string[]>> = {
  "gce-al": {
    Science: [
      "Mathematics",
      "Further Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Computer Science",
      "ICT",
      "Geology",
      "Philosophy",
      "Food Science",
      "Geography",
    ],
    Arts: [
      "English Literature",
      "History",
      "Geography",
      "French",
      "Economics",
      "Religious Studies",
      "Geology",
      "Computer Science",
      "ICT",
      "Philosophy",
      "Food Science",
    ],
    Commercial: [
      "Economics",
      "Accounting",
      "Business",
      "Commerce",
      "Marketing",
      "Mathematics",
      "Computer Science",
      "ICT",
      "Geography",
      "English Language",
      "French",
    ],
    "Arts & Commercial": [
      "English Literature",
      "History",
      "Economics",
      "Business",
      "Geography",
      "French",
    ],
  },
  "gce-ol": {
    General: [
      "English Language",
      "Mathematics",
      "French",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Geography",
    ],
  },
  bac: {
    C: ["Mathematics", "Physics", "Chemistry", "Computer Science", "French", "English"],
    D: ["Mathematics", "Biology", "Chemistry", "Physics", "French", "English"],
    A: ["French", "English", "Philosophy", "History", "Geography", "Mathematics"],
    G: ["Economics", "Accounting", "Business", "Mathematics", "French", "English"],
  },
  probatoire: {
    General: [
      "French",
      "English",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "History",
      "Geography",
    ],
  },
  ossd: {
    "University Preparation": [
      "English",
      "Advanced Functions",
      "Calculus and Vectors",
      "Physics",
      "Chemistry",
      "Biology",
      "Computer Science",
      "Economics",
    ],
    "College Preparation": [
      "English",
      "Mathematics",
      "Business",
      "Accounting",
      "Computer Studies",
      "Biology",
      "Geography",
    ],
  },
  ibdp: {
    "Sciences-focused": [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Computer Science",
      "English",
    ],
    "Humanities-focused": [
      "English",
      "History",
      "Geography",
      "Economics",
      "Psychology",
      "Mathematics",
    ],
    "Arts-focused": ["Visual Arts", "Music", "Theatre", "English", "History", "Mathematics"],
  },
  cambridge: {
    Science: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Geography"],
    Arts: ["English Literature", "History", "Geography", "French", "Economics"],
    Commercial: ["Economics", "Accounting", "Business", "Mathematics", "Computer Science"],
  },
};
function points(certificate: Certificate, grade: string) {
  const value = grade.trim().toUpperCase();
  if (certificate === "bac" || certificate === "probatoire")
    return Math.max(0, Math.min(20, Number(value) || 0)) / 5;
  if (certificate === "ossd") {
    const score = Number(value) || 0;
    return score >= 90
      ? 4
      : score >= 85
        ? 3.9
        : score >= 80
          ? 3.7
          : score >= 77
            ? 3.3
            : score >= 73
              ? 3
              : score >= 70
                ? 2.7
                : score >= 67
                  ? 2.3
                  : score >= 63
                    ? 2
                    : score >= 60
                      ? 1.7
                      : score >= 50
                        ? 1
                        : 0;
  }
  if (certificate === "ibdp") return (Math.max(0, Math.min(45, Number(value) || 0)) / 45) * 4;
  return (
    ({ "A*": 4, A: 4, B: 3, C: 2, D: 1, E: 0.5, O: 0.5, F: 0, U: 0 } as Record<string, number>)[
      value
    ] ?? 0
  );
}
function result(certificate: Certificate, grade: string) {
  const us = points(certificate, grade);
  const percentage =
    certificate === "bac" || certificate === "probatoire"
      ? us * 5
      : certificate === "ibdp"
        ? (us / 4) * 45
        : certificate === "ossd"
          ? Number(grade) || 0
          : (us / 4) * 100;
  const canada =
    percentage >= 90
      ? "A+ (4.0)"
      : percentage >= 85
        ? "A (4.0)"
        : percentage >= 80
          ? "A− (3.7)"
          : percentage >= 77
            ? "B+ (3.3)"
            : percentage >= 73
              ? "B (3.0)"
              : percentage >= 70
                ? "B− (2.7)"
                : percentage >= 67
                  ? "C+ (2.3)"
                  : percentage >= 63
                    ? "C (2.0)"
                    : percentage >= 60
                      ? "C− (1.7)"
                      : percentage >= 50
                        ? "D (1.0)"
                        : "F (0.0)";
  const german = percentage >= 50 ? 1 + ((100 - percentage) * 3) / 50 : 5;
  const uk =
    us >= 3.7
      ? "First-class"
      : us >= 3
        ? "Upper second (2:1)"
        : us >= 2.3
          ? "Lower second (2:2)"
          : us >= 2
            ? "Third-class"
            : "Below honours pass";
  const ects =
    percentage >= 90
      ? "A"
      : percentage >= 80
        ? "B"
        : percentage >= 70
          ? "C"
          : percentage >= 60
            ? "D"
            : percentage >= 50
              ? "E"
              : "F";
  return { us, percentage, canada, german, uk, ects };
}
function GpaConversionPage() {
  const { t } = useI18n();
  const [certificate, setCertificate] = useState<Certificate>("gce-al");
  const [track, setTrack] = useState<string>(Object.keys(series["gce-al"])[0] ?? "Science");
  const [selected, setSelected] = useState<Subject[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const available = series[certificate][track] ?? [];
  const rows = useMemo(
    () =>
      selected
        .filter((subject) => subject.grade.trim())
        .map((subject) => ({ ...subject, conversion: result(certificate, subject.grade) })),
    [certificate, selected],
  );
  const changeCertificate = (value: Certificate) => {
    setCertificate(value);
    setTrack(Object.keys(series[value])[0] ?? "");
    setSelected([]);
    setSubmitted(false);
  };
  const toggleSubject = (name: string) =>
    setSelected((current) =>
      current.some((subject) => subject.name === name)
        ? current.filter((subject) => subject.name !== name)
        : [...current, { name, grade: "" }],
    );
  const updateGrade = (name: string, grade: string) =>
    setSelected((current) =>
      current.map((subject) => (subject.name === name ? { ...subject, grade } : subject)),
    );
  const average = rows.length
    ? rows.reduce((sum, row) => sum + row.conversion.us, 0) / rows.length
    : 0;
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
          {t("page.gpa")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
          {t("page.gpa.title")}
        </h1>
        <p className="mt-3 max-w-4xl text-muted-foreground">
          Choose your certificate and series. Select the subjects shown on your transcript, then
          enter each grade or mark. The available subjects are automatically adapted to your
          certificate and series.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [
              "1. Select your award",
              "Choose BAC, GCE A-Level, OSSD, IB Diploma or Cambridge International.",
            ],
            [
              "2. Match your subjects",
              "Pick the subjects shown on your official transcript. Subject prerequisites still apply.",
            ],
            [
              "3. Compare carefully",
              "Use the result to plan applications; the receiving university or credential agency makes the final decision.",
            ],
          ].map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-4">
              <h2 className="font-display font-semibold text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 rounded-xl border-2 border-secondary/40 bg-secondary/5 p-4 text-sm leading-relaxed text-foreground">
          <strong>Important:</strong> International grade and GPA conversions vary by country,
          institution, qualification and admission policy. These are reference conversions, not
          official credential evaluations. Always verify requirements with the receiving
          institution.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_2fr]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <label className="text-sm font-medium">
              Certificate
              <select
                value={certificate}
                onChange={(event) => changeCertificate(event.target.value as Certificate)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              >
                {Object.entries(labels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-4 rounded-xl bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
              {certificateGuidance[certificate]}
            </p>
            <label className="mt-4 block text-sm font-medium">
              Series / pathway
              <select
                value={track}
                onChange={(event) => {
                  setTrack(event.target.value);
                  setSelected([]);
                  setSubmitted(false);
                }}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              >
                {Object.keys(series[certificate]).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <p className="mt-6 text-sm font-semibold">Select subjects from your transcript</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {available.map((subject) => {
                const isSelected = selected.some((item) => item.name === subject);
                return (
                  <button
                    type="button"
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm ${isSelected ? "border-primary bg-primary/10 font-semibold text-primary" : "border-border"}`}
                  >
                    {isSelected ? "✓ " : ""}
                    {subject}
                  </button>
                );
              })}
            </div>
            <button
              type="submit"
              disabled={!selected.length}
              className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              Convert selected grades
            </button>
          </form>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Conversion results</h2>
            {selected.length ? (
              <div className="mt-5 space-y-3">
                {selected.map((subject) => (
                  <label
                    key={subject.name}
                    className="grid gap-2 text-sm font-medium sm:grid-cols-[1fr_10rem]"
                  >
                    <span>
                      {subject.name}
                      <span className="block text-xs text-muted-foreground">
                        Enter{" "}
                        {certificate === "bac"
                          ? "a mark from 0 to 20"
                          : certificate === "ossd"
                            ? "a percentage from 0 to 100"
                            : certificate === "ibdp"
                              ? "IB points from 0 to 45"
                              : certificate === "gce-al" ||
                                  certificate === "gce-ol" ||
                                  certificate === "cambridge"
                                ? "A*, A, B, C, D, E, O or F"
                                : "A*, A, B, C, D or E"}
                      </span>
                    </span>
                    <input
                      required
                      value={subject.grade}
                      onChange={(event) => updateGrade(subject.name, event.target.value)}
                      className="rounded-xl border border-input bg-background px-3 py-2"
                    />
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Select one or more subjects to enter grades.
              </p>
            )}
            {submitted && rows.length ? (
              <>
                <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
                    Original Cameroon result
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {rows.map((row) => `${row.name}: ${row.grade}`).join(" · ")}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Original grades are preserved. The percentage shown in the table is only an
                    indicative calculation used to derive the comparison values.
                  </p>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <Result
                    label={
                      certificate === "gce-al" || certificate === "gce-ol"
                        ? "Indicative US GPA (4.0 scale)"
                        : "Overall US GPA"
                    }
                    value={`${average.toFixed(2)} / 4.00`}
                  />
                  <Result
                    label="Average Canadian result"
                    value={
                      result(
                        certificate,
                        String(
                          rows.reduce((sum, row) => sum + (row.conversion.percentage ?? 0), 0) /
                            rows.length,
                        ),
                      ).canada
                    }
                  />
                  <Result
                    label="Average UK result"
                    value={
                      average >= 3.7
                        ? "First-class"
                        : average >= 3
                          ? "Upper second (2:1)"
                          : "Lower classification"
                    }
                  />
                  <Result
                    label="Estimated German grade"
                    value={`${(
                      rows.reduce((sum, row) => sum + (row.conversion.german ?? 0), 0) / rows.length
                    ).toFixed(2)} / 5`}
                  />
                  <Result
                    label="ECTS comparison"
                    value={
                      result(
                        certificate,
                        String(
                          rows.reduce((sum, row) => sum + (row.conversion.percentage ?? 0), 0) /
                            rows.length,
                        ),
                      ).ects
                    }
                  />
                </div>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                        <th className="p-3">Subject / original</th>
                        <th className="p-3">US</th>
                        <th className="p-3">Canada</th>
                        <th className="p-3">UK</th>
                        <th className="p-3">Germany</th>
                        <th className="p-3">ECTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.name} className="border-b border-border/70">
                          <td className="p-3 font-medium">
                            {row.name}
                            <span className="block text-xs text-muted-foreground">
                              {row.grade} ·{" "}
                              {row.conversion.percentage === null
                                ? "Original grade preserved"
                                : `${row.conversion.percentage.toFixed(1)}% normalized`}
                            </span>
                          </td>
                          <td className="p-3">{row.conversion.us.toFixed(2)}</td>
                          <td className="p-3">{row.conversion.canada}</td>
                          <td className="p-3">{row.conversion.uk}</td>
                          <td className="p-3">
                            {row.conversion.german === null
                              ? "—"
                              : `${row.conversion.german.toFixed(2)} / 5`}
                          </td>
                          <td className="p-3">{row.conversion.ects}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">
                Enter grades and click convert to see individual and total conversions. These are
                indicative comparisons, not official admission decisions; each university may use
                its own credential evaluation, subject prerequisites and document-verification
                process.
              </p>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
