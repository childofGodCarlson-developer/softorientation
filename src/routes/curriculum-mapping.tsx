import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/site-chrome";
import {
  CURRICULUM_SUBJECTS,
  CURRICULUM_TOPICS,
  REQUIREMENTS,
  mapRequirement,
  subjectsForProfile,
  topicsForSubjects,
} from "@/data/curriculum-mapping";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/curriculum-mapping")({ component: CurriculumMappingPage });

const statusText: Record<string, string> = {
  DIRECT_MATCH: "Direct curriculum match",
  EMBEDDED_MATCH: "Embedded curriculum match",
  DISTRIBUTED_MATCH: "Distributed curriculum match",
  PARTIAL_MATCH: "Partial curriculum coverage",
  RELATED_CONTENT: "Related content identified",
  NO_MATCH_FOUND: "No match found in current knowledge base",
  UNVERIFIED: "Unverified relationship",
};

function CurriculumMappingPage() {
  const { locale } = useI18n();
  const [mode, setMode] = useState<"profile" | "requirement" | "compare">("profile");
  const [qualification, setQualification] = useState("GCE Advanced Level");
  const [series, setSeries] = useState("Science");
  const [selected, setSelected] = useState<string[]>(["gce-maths-stats"]);
  const [requirement, setRequirement] = useState("Calculus I");
  const subjects = subjectsForProfile(qualification, series);
  const topics = useMemo(() => topicsForSubjects(selected), [selected]);
  const result = useMemo(() => mapRequirement(requirement, selected), [requirement, selected]);
  const language = locale === "fr";

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
          {language ? "Programme et équivalence" : "Curriculum intelligence"}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
          {language
            ? "Équivalence internationale des programmes et matières"
            : "International Curriculum & Subject Equivalency"}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {language
            ? "Comprenez comment votre formation se compare aux exigences académiques d'autres pays."
            : "Understand how your education maps to academic requirements in other countries."}
        </p>

        <div className="mt-8 grid gap-2 sm:grid-cols-3">
          {[
            ["profile", "What did I study?"],
            ["requirement", "Does my curriculum meet this requirement?"],
            ["compare", "Compare curricula"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id as typeof mode)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold ${
                mode === id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[20rem_1fr]">
          <aside className="rounded-2xl border border-border bg-card p-5">
            <label className="text-sm font-medium">
              Country
              <select
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
                defaultValue="Cameroon"
              >
                <option>Cameroon</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium">
              Qualification
              <select
                value={qualification}
                onChange={(event) => {
                  setQualification(event.target.value);
                  setSelected([]);
                }}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              >
                <option>GCE Advanced Level</option>
                <option>Baccalauréat</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium">
              Series
              <select
                value={series}
                onChange={(event) => setSeries(event.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              >
                <option>Science</option>
                <option>C</option>
                <option>D</option>
              </select>
            </label>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Curriculum topics are shown only as reference data until an official syllabus source
              and version is verified by an administrator.
            </p>
          </aside>

          <main className="space-y-6">
            {(mode === "profile" || mode === "requirement") && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold">Your curriculum profile</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select the subjects actually present on your transcript.
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => toggle(subject.id)}
                      className={`rounded-xl border p-3 text-left text-sm ${
                        selected.includes(subject.id)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border"
                      }`}
                    >
                      <strong>
                        {selected.includes(subject.id) ? "✓ " : ""}
                        {subject.code}
                      </strong>{" "}
                      {subject.name}
                    </button>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {topics.map((topic) => (
                    <article key={topic.id} className="rounded-xl border border-border p-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
                        {topic.domain}
                      </p>
                      <h3 className="mt-1 font-semibold">{language ? topic.fr : topic.name}</h3>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Evidence status: {topic.evidence}. Source verification is required.
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {mode === "requirement" && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold">Requirement comparison</h2>
                <select
                  value={requirement}
                  onChange={(event) => setRequirement(event.target.value)}
                  className="mt-4 w-full rounded-xl border border-input bg-background px-3 py-2"
                >
                  {Object.keys(REQUIREMENTS).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <div className="mt-5 rounded-xl border border-secondary/40 bg-secondary/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
                    {statusText[result.status]}
                  </p>
                  <p className="mt-2 text-3xl font-bold">{result.coverage}%</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Confidence: {result.confidence}. This is not an admission decision.
                  </p>
                  <p className="mt-4 text-sm">{result.explanation}</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <strong>Matched topics</strong>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {result.matchedTopics.join(", ") || "None identified"}
                    </p>
                  </div>
                  <div>
                    <strong>Unmatched topics</strong>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {result.unmatchedTopics.join(", ") || "None"}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {mode === "compare" && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold">Curriculum comparison</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-3">Topic</th>
                        <th className="p-3">Cameroon curriculum</th>
                        <th className="p-3">Foreign requirement</th>
                        <th className="p-3">Relationship</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CURRICULUM_TOPICS.slice(0, 10).map((topic) => (
                        <tr key={topic.id} className="border-b border-border/70">
                          <td className="p-3 font-medium">{language ? topic.fr : topic.name}</td>
                          <td className="p-3">
                            {selected.some((id) => topic.subjectIds.includes(id))
                              ? "Found"
                              : "Not selected"}
                          </td>
                          <td className="p-3">{topic.domain}</td>
                          <td className="p-3 text-muted-foreground">
                            {topic.evidence === "REFERENCE"
                              ? "Comparable content identified"
                              : "Unverified"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </main>
        </div>
        <p className="mt-8 rounded-xl border-2 border-secondary/40 bg-secondary/5 p-4 text-sm">
          Important: curriculum coverage is not an official qualification equivalency and does not
          guarantee admission. Universities may require their own evaluation and verified syllabus
          evidence.
        </p>
      </section>
    </PageShell>
  );
}
