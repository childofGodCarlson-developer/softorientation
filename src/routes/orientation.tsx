import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/site-chrome";
import { useI18n } from "@/i18n";
import {
  JOBS,
  specialtyOf,
  SERIES,
  SYSTEMS,
  TRACKS,
  categoriesForSeries,
  categoriesForTrack,
  jobsForCategory,
  jobsForSeries,
  seriesForSystem,
  suggestedSeries,
  type Budget,
  type Region,
  type SystemId,
  type Track,
} from "@/data/catalog";
import { budgetFor, matchUniversities, nearMatches, type University } from "@/data/universities";

export const Route = createFileRoute("/orientation")({
  head: () => ({
    meta: [
      { title: "Orientation pathway — Find your university and career" },
      {
        name: "description",
        content:
          "Step-by-step orientation: education system, series, job area, specialty, destination and budget, leading to matching universities and their application guides.",
      },
      { property: "og:title", content: "Orientation pathway — Find your university and career" },
      {
        property: "og:description",
        content:
          "Answer a few questions and get a shortlist of institutions with full admission and visa guidance.",
      },
    ],
  }),
  component: OrientationPage,
});

type Stage = "seconde" | "terminale";
type StepId =
  | "system"
  | "internationalVariant"
  | "stage"
  | "track"
  | "series"
  | "category"
  | "job"
  | "advice"
  | "specialty"
  | "region"
  | "budget"
  | "results";

const EARLY_STEPS: StepId[] = [
  "system",
  "stage",
  "track",
  "category",
  "job",
  "advice",
  "specialty",
  "region",
  "budget",
  "results",
];
const FINAL_STEPS: StepId[] = [
  "system",
  "internationalVariant",
  "stage",
  "series",
  "category",
  "job",
  "specialty",
  "region",
  "budget",
  "results",
];

interface Answers {
  system?: SystemId;
  internationalVariant?: "french" | "english";
  stage?: Stage;
  track?: Track;
  seriesId?: string;
  categoryId?: string;
  jobId?: string;
  specialtyId?: string;
  region?: Region;
  budget?: Budget;
}

function OptionCard({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col rounded-2xl border border-border bg-card p-5 text-start transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
    >
      <span className="font-display text-lg font-semibold text-card-foreground group-hover:text-primary">
        {title}
      </span>
      {subtitle && (
        <span className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{subtitle}</span>
      )}
    </button>
  );
}

function OrientationPage() {
  const { t, d } = useI18n();
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [categorySearch, setCategorySearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [activeResultsControl, setActiveResultsControl] = useState<"sort" | "filter" | null>(null);
  const [resultSort, setResultSort] = useState<"name" | "city">("name");
  const [resultLocation, setResultLocation] = useState("");

  const steps =
    answers.system === "international"
      ? ([
          "system",
          "internationalVariant",
          "stage",
          "series",
          "category",
          "job",
          "specialty",
          "region",
          "budget",
          "results",
        ] as StepId[])
      : answers.stage === "seconde"
        ? EARLY_STEPS
        : answers.stage === "terminale"
          ? FINAL_STEPS.filter((item) => item !== "internationalVariant")
          : EARLY_STEPS;
  const step = steps[Math.min(index, steps.length - 1)] as StepId;

  const set = (patch: Answers) => {
    setAnswers((a) => ({ ...a, ...patch }));
    setIndex((i) => i + 1);
  };

  const back = () => setIndex((i) => Math.max(0, i - 1));
  const restart = () => {
    setAnswers({});
    setIndex(0);
  };

  const langTrack: "fr" | "en" =
    answers.system === "french" || answers.internationalVariant === "french" ? "fr" : "en";
  const series = answers.seriesId ? SERIES.find((s) => s.id === answers.seriesId) : undefined;
  const job = answers.jobId ? JOBS.find((j) => j.id === answers.jobId) : undefined;

  const categories = useMemo(() => {
    if (series) return categoriesForSeries(series.code);
    if (answers.track) return categoriesForTrack(answers.track);
    return [];
  }, [series, answers.track]);

  const jobs = useMemo(() => {
    if (!answers.categoryId) return [];
    if (series) return jobsForSeries(series.code, answers.categoryId);
    return jobsForCategory(answers.categoryId, answers.track);
  }, [answers.categoryId, answers.track, series]);
  const visibleCategories = useMemo(() => {
    const query = categorySearch.trim().toLocaleLowerCase();
    if (!query) return categories;
    return categories.filter((item) =>
      `${item.label.en} ${item.label.fr}`.toLocaleLowerCase().includes(query),
    );
  }, [categories, categorySearch]);
  const visibleJobs = useMemo(() => {
    const query = jobSearch.trim().toLocaleLowerCase();
    if (!query) return jobs;
    return jobs.filter((item) => {
      const specialties = item.specialties.map((id) => specialtyOf(id).label.en).join(" ");
      return `${item.label.en} ${item.label.fr} ${specialties}`.toLocaleLowerCase().includes(query);
    });
  }, [jobs, jobSearch]);

  const results = useMemo(() => {
    if (!answers.region || !answers.budget)
      return { matches: [] as University[], others: [] as University[] };
    const q = {
      specialtyId: answers.specialtyId,
      region: answers.region,
      budget: answers.budget,
      track: langTrack,
      educationType:
        answers.system === "french" ? "bac" : answers.system === "english" ? "gce" : "ossd",
    };
    return { matches: matchUniversities(q), others: nearMatches(q) };
  }, [answers.region, answers.budget, answers.specialtyId, answers.system, langTrack]);
  const allResults = useMemo(
    () => [...results.matches, ...results.others],
    [results.matches, results.others],
  );
  const locationOptions =
    answers.region === "cameroon"
      ? [...new Set(allResults.map((uni) => uni.city))]
          .sort((a, b) => a.localeCompare(b))
          .map((city) => ({ value: city, label: city }))
      : [...new Map(allResults.map((uni) => [uni.countryCode, d(uni.country)] as const)).entries()]
          .map(([value, label]) => ({ value, label }))
          .sort((a, b) => a.label.localeCompare(b.label));
  const visibleUniversities = (universities: University[]) =>
    universities
      .filter((uni) =>
        resultLocation
          ? answers.region === "cameroon"
            ? uni.city === resultLocation
            : uni.countryCode === resultLocation
          : true,
      )
      .sort((a, b) => {
        const budgetOrder: Record<Budget, number> = { low: 0, average: 1, high: 2 };
        const tierDifference =
          budgetOrder[budgetFor(a, answers.specialtyId)] -
          budgetOrder[budgetFor(b, answers.specialtyId)];
        if (tierDifference !== 0) return tierDifference;
        return resultSort === "city"
          ? a.city.localeCompare(b.city) || a.name.localeCompare(b.name)
          : a.name.localeCompare(b.name);
      });
  const visibleMatches = visibleUniversities(results.matches);
  const visibleAlternatives = visibleUniversities(results.others);

  const questionKey: Record<StepId, string> = {
    system: "wizard.q.system",
    internationalVariant: "wizard.q.internationalVariant",
    stage: "wizard.q.stage",
    track: "wizard.q.track",
    series: "wizard.q.series",
    category: "wizard.q.category",
    job: "wizard.q.job",
    advice: "advice.title",
    specialty: "wizard.q.specialty",
    region: "wizard.q.region",
    budget: "wizard.q.budget",
    results: "wizard.q.results",
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
            {t("wizard.title")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("wizard.step")} {index + 1} {t("wizard.of")} {steps.length}
          </p>
          <div className="ms-auto flex gap-2">
            {index > 0 && (
              <button
                type="button"
                onClick={back}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                ← {t("wizard.back")}
              </button>
            )}
            {index > 0 && (
              <button
                type="button"
                onClick={restart}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {t("wizard.restart")}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-secondary transition-all"
            style={{ width: `${((index + 1) / steps.length) * 100}%` }}
          />
        </div>

        <h1 className="mt-8 font-display text-2xl font-bold text-foreground sm:text-3xl">
          {t(questionKey[step])}
        </h1>

        {/* ---------------------------------------------------------- system */}
        {step === "system" && (
          <div className="mt-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {SYSTEMS.map((s) => (
                <OptionCard key={s.id} title={d(s.label)} onClick={() => set({ system: s.id })} />
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-5 text-sm text-slate-300">
              <p className="font-semibold text-slate-100">International pathway availability</p>
              <p className="mt-1">
                Soft Education currently offers OSSD in French and English. IB and Cambridge are
                shown only as future reference pathways and are not available for enrolment yet.
              </p>
            </div>
          </div>
        )}

        {step === "internationalVariant" && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <OptionCard
              title="BACC Francais"
              subtitle="BACC Francais pathway delivered in French through Soft Education."
              onClick={() => set({ internationalVariant: "french" })}
            />
            <OptionCard
              title="English OSSD"
              subtitle="English OSSD pathway delivered with our partner network."
              onClick={() => set({ internationalVariant: "english" })}
            />
          </div>
        )}

        {/* ----------------------------------------------------------- stage */}
        {step === "stage" && answers.system && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {answers.system === "french" ? (
              <>
                <OptionCard
                  title={t("stage.seconde.french")}
                  subtitle={t("stage.seconde.hint")}
                  onClick={() => set({ stage: "seconde" })}
                />
                <OptionCard
                  title={t("stage.terminale.french")}
                  subtitle={t("stage.terminale.hint")}
                  onClick={() => set({ stage: "terminale" })}
                />
              </>
            ) : (
              <>
                <OptionCard
                  title={t(`stage.early.${answers.system}`)}
                  subtitle={t("stage.early.hint")}
                  onClick={() => set({ stage: "seconde" })}
                />
                <OptionCard
                  title={t(`stage.final.${answers.system}`)}
                  subtitle={t("stage.final.hint")}
                  onClick={() => set({ stage: "terminale" })}
                />
              </>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------- track */}
        {step === "track" && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {TRACKS.map((tr) => (
              <OptionCard
                key={tr.id}
                title={d(tr.label)}
                subtitle={seriesForSystem(answers.system!, tr.id)
                  .map((s) => s.code)
                  .join(" · ")}
                onClick={() => set({ track: tr.id })}
              />
            ))}
          </div>
        )}

        {/* ---------------------------------------------------------- series */}
        {step === "series" && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {seriesForSystem(answers.system!)
              .filter((s) => answers.system !== "international" || s.code.startsWith("OSSD-"))
              .filter(
                (s) =>
                  answers.system !== "french" ||
                  (answers.stage === "terminale" ? s.id !== "bac-2nde-stt" : false),
              )
              .filter(
                (s) =>
                  answers.system !== "french" ||
                  answers.stage !== "terminale" ||
                  !["BIL", "TI", "AC"].includes(s.code),
              )
              .map((s) => (
                <OptionCard
                  key={s.id}
                  title={d(s.label)}
                  subtitle={d(s.subjects)}
                  onClick={() => set({ seriesId: s.id, track: s.track })}
                />
              ))}
          </div>
        )}

        {/* -------------------------------------------------------- category */}
        {step === "category" && (
          <div className="mt-8">
            {answers.system === "french" &&
              answers.stage === "early" &&
              answers.track === "commercial" && (
                <div className="mb-5 rounded-2xl border border-secondary/50 bg-secondary/10 p-5 text-sm text-foreground">
                  <strong>2nde STT:</strong> all commercial students take the compulsory commercial
                  subjects together. The CG or ACC choice is made in 1ère.
                </div>
              )}
            <input
              type="search"
              value={categorySearch}
              onChange={(event) => setCategorySearch(event.target.value)}
              placeholder="Search job areas..."
              aria-label="Search job areas"
              className="mb-5 w-full rounded-xl border border-input bg-background px-4 py-3"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {visibleCategories.map((c) => (
                <OptionCard
                  key={c.id}
                  title={d(c.label)}
                  onClick={() => set({ categoryId: c.id })}
                />
              ))}
            </div>
            {visibleCategories.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">No job area matches your search.</p>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- job */}
        {step === "job" && (
          <div className="mt-8">
            <input
              type="search"
              value={jobSearch}
              onChange={(event) => setJobSearch(event.target.value)}
              placeholder="Search jobs or specialties..."
              aria-label="Search jobs or specialties"
              className="mb-5 w-full rounded-xl border border-input bg-background px-4 py-3"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {visibleJobs.map((j) => (
                <OptionCard
                  key={j.id}
                  title={d(j.label)}
                  subtitle={j.specialties.map((id) => d(specialtyOf(id).label)).join(" · ")}
                  onClick={() => set({ jobId: j.id })}
                />
              ))}
            </div>
            {visibleJobs.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">No job matches your search.</p>
            )}
          </div>
        )}

        {/* ---------------------------------------------------------- advice */}
        {step === "advice" && job && answers.system && (
          <div className="mt-8">
            <p className="text-base text-muted-foreground">
              {t("advice.lead")} <strong className="text-foreground">{d(job.label)}</strong>,{" "}
              {t("advice.lead2")}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {suggestedSeries(job.id, answers.system).map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border-2 border-secondary/50 bg-secondary/5 p-5"
                >
                  <p className="font-display text-lg font-semibold text-foreground">{d(s.label)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{t("advice.subjects")}: </span>
                    {d(s.subjects)}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((i) => i + 1)}
              className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {t("advice.continue")} →
            </button>
          </div>
        )}

        {/* ------------------------------------------------------- specialty */}
        {step === "specialty" && job && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {job.specialties.map((id) => (
              <OptionCard
                key={id}
                title={d(specialtyOf(id).label)}
                onClick={() => set({ specialtyId: id })}
              />
            ))}
          </div>
        )}

        {/* ---------------------------------------------------------- region */}
        {step === "region" && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {(["cameroon", "africa", "world"] as Region[]).map((r) => (
              <OptionCard
                key={r}
                title={t(`region.${r}`)}
                onClick={() => {
                  setResultLocation("");
                  set({ region: r });
                }}
              />
            ))}
          </div>
        )}

        {/* ---------------------------------------------------------- budget */}
        {step === "budget" && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {(["low", "average", "high"] as Budget[]).map((b) => (
              <OptionCard
                key={b}
                title={t(`budget.${answers.region ?? "cameroon"}.${b}`)}
                subtitle={t(`budget.${answers.region ?? "cameroon"}.${b}.desc`)}
                onClick={() => set({ budget: b })}
              />
            ))}
          </div>
        )}

        {/* --------------------------------------------------------- results */}
        {step === "results" && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {job && <Chip>{d(job.label)}</Chip>}
              {answers.specialtyId && <Chip>{d(specialtyOf(answers.specialtyId).label)}</Chip>}
              {answers.region && <Chip>{t(`region.${answers.region}`)}</Chip>}
              {answers.budget && answers.region && (
                <Chip>{t(`budget.${answers.region}.${answers.budget}`)}</Chip>
              )}
              <Chip>{t(`lang.${langTrack}`)}</Chip>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                aria-expanded={activeResultsControl === "sort"}
                onClick={() =>
                  setActiveResultsControl((active) => (active === "sort" ? null : "sort"))
                }
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                {t("results.sort")}
              </button>
              <button
                type="button"
                aria-expanded={activeResultsControl === "filter"}
                onClick={() =>
                  setActiveResultsControl((active) => (active === "filter" ? null : "filter"))
                }
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                {t("results.filter")}
              </button>
              {activeResultsControl === "sort" && (
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{t("results.sort")}</span>
                  <select
                    value={resultSort}
                    onChange={(event) => setResultSort(event.target.value as "name" | "city")}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-foreground"
                  >
                    <option value="name">{t("results.sort.name")}</option>
                    <option value="city">{t("results.sort.city")}</option>
                  </select>
                </label>
              )}
              {activeResultsControl === "filter" && (
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    {t(
                      answers.region === "cameroon"
                        ? "results.filter.town"
                        : "results.filter.country",
                    )}
                  </span>
                  <select
                    value={resultLocation}
                    onChange={(event) => setResultLocation(event.target.value)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-foreground"
                  >
                    <option value="">
                      {t(
                        answers.region === "cameroon"
                          ? "results.filter.allTowns"
                          : "results.filter.allCountries",
                      )}
                    </option>
                    {locationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              {visibleMatches.length > 0
                ? `${visibleMatches.length} ${t("results.count")}`
                : t("results.none")}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {visibleMatches.map((u) => (
                <UniversityCard key={u.id} uni={u} specialtyId={answers.specialtyId} />
              ))}
            </div>

            {visibleAlternatives.length > 0 && (
              <>
                <h2 className="mt-12 font-display text-xl font-semibold text-foreground">
                  {t("results.alternatives")}
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {visibleAlternatives.map((u) => (
                    <UniversityCard key={u.id} uni={u} specialtyId={answers.specialtyId} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}

export function UniversityCard({
  uni,
  specialtyId,
}: {
  uni: University;
  specialtyId?: string | undefined;
}) {
  const { t, d } = useI18n();
  const budget = budgetFor(uni, specialtyId);
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="break-words font-display text-lg font-semibold text-card-foreground">
            {uni.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {uni.city}, {d(uni.country)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            budget === "low"
              ? "bg-emerald-100 text-emerald-800"
              : budget === "average"
                ? "bg-amber-100 text-amber-900"
                : "bg-rose-100 text-rose-900"
          }`}
        >
          {t(`budget.${budget}`)}
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="min-w-24 shrink-0 font-medium text-foreground sm:min-w-32">
            {t("results.language")}
          </dt>
          <dd className="min-w-0 break-words text-muted-foreground">
            {t(`lang.${uni.instruction}`)}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="min-w-24 shrink-0 font-medium text-foreground sm:min-w-32">
            {t("results.levels")}
          </dt>
          <dd className="min-w-0 break-words text-muted-foreground">{uni.levels.join(", ")}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="min-w-24 shrink-0 font-medium text-foreground sm:min-w-32">
            {t("results.cost")}
          </dt>
          <dd className="min-w-0 break-words text-muted-foreground">{d(uni.cost)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs font-semibold text-muted-foreground">
        {uni.concours ? t("results.concours") : t("results.selection")}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d(uni.notes)}</p>

      {uni.concours && (
        <p className="mt-3 inline-flex w-fit rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
          {t("results.concours")}
        </p>
      )}

      {uni.website ? (
        <a
          href={uni.website}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-fit text-sm font-semibold text-primary underline underline-offset-4"
        >
          {t("results.website")} →
        </a>
      ) : (
        <p className="mt-4 text-xs text-muted-foreground">
          Official homepage link unavailable; verify the institution through its recognised
          admissions authority before applying.
        </p>
      )}

      <Link
        to="/university/$id"
        params={{ id: uni.id }}
        className="mt-5 inline-flex w-fit items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        {t("results.guide")} →
      </Link>
    </article>
  );
}
