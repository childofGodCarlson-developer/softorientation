import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/site-chrome";
import { useI18n } from "@/i18n";

export const Route = createFileRoute("/scholarships")({ component: ScholarshipsPage });

type Scholarship = {
  name: string;
  country: string;
  provider: string;
  coverage: string;
  documents: string;
  procedure: string;
  website: string;
  region: "Cameroon" | "Africa" | "Outside Africa";
  eligibility: string;
};
const scholarships: Scholarship[] = [
  {
    name: "MEXT Undergraduate Scholarship",
    country: "Japan",
    provider: "Government of Japan",
    coverage:
      "Fully funded undergraduate study, monthly allowance, tuition and travel support subject to the annual call.",
    documents:
      "BAC or GCE A'Level results, transcripts, birth certificate, passport/ID, medical form, recommendation and study plan.",
    procedure:
      "Apply through the Embassy of Japan in Cameroon during the annual embassy-recommendation window, then complete screening and interviews.",
    website: "https://www.studyinjapan.go.jp/en/smap-stopj-applications-undergraduate/",
    region: "Outside Africa",
    eligibility:
      "Cameroonian final-year students and graduates; confirm the annual age, grades and embassy-call rules.",
  },
  {
    name: "MEXT College of Technology (KOSEN)",
    country: "Japan",
    provider: "Government of Japan",
    coverage:
      "Fully funded technical higher-education pathway with preparatory education where required.",
    documents:
      "BAC or GCE A'Level documents, transcripts, identity documents, medical form and recommendation.",
    procedure:
      "Submit the embassy application, sit the required examinations and follow the Japanese government placement process.",
    website: "https://www.studyinjapan.go.jp/en/smap-stopj-applications-technology/",
    region: "Outside Africa",
    eligibility:
      "Cameroonian graduates meeting the KOSEN age and academic requirements in the current embassy call.",
  },
  {
    name: "Türkiye Scholarships",
    country: "Türkiye",
    provider: "Government of Türkiye",
    coverage:
      "Major funding package commonly including tuition, accommodation, stipend, health insurance and placement.",
    documents:
      "Diploma or expected graduation proof, transcripts, passport/ID, motivation letter and supporting achievements.",
    procedure:
      "Create an account and apply online during the annual call; shortlisted candidates may complete tests and an interview.",
    website: "https://www.turkiyeburslari.gov.tr/",
    region: "Outside Africa",
    eligibility:
      "International applicants, including Cameroonians, for associate, bachelor, master and doctoral calls.",
  },
  {
    name: "African Leadership University Mastercard Foundation Scholars",
    country: "Rwanda",
    provider: "African Leadership University / Mastercard Foundation",
    coverage:
      "Full-ride undergraduate support for selected African students with strong leadership, need and community impact.",
    documents:
      "ALU admission application, academic records, English evidence, financial-need information and leadership/community evidence.",
    procedure:
      "Apply for ALU admission, select the scholarship route and complete the separate financial-aid assessment if invited.",
    website: "https://www.alueducation.com/mastercard-foundation-scholars-program/",
    region: "Africa",
    eligibility:
      "African applicants with financial need, leadership and the required secondary-school results.",
  },
  {
    name: "Ashesi University need-based financial aid",
    country: "Ghana",
    provider: "Ashesi University",
    coverage:
      "Need-based aid that can substantially reduce or cover tuition and associated costs for selected students.",
    documents:
      "Admission application, BAC/GCE/IB/Cambridge/Canadian records, family financial information and supporting documents.",
    procedure:
      "Apply for admission and complete the financial-aid forms before the university deadline.",
    website: "https://www.ashesi.edu.gh/admissions/financial-aid.html",
    region: "Africa",
    eligibility:
      "International African applicants admitted to Ashesi who demonstrate financial need.",
  },
  {
    name: "University of Buea academic scholarships",
    country: "Cameroon",
    provider: "University of Buea",
    coverage:
      "Academic and programme-specific support subject to institutional calls and available funding.",
    documents:
      "Admission evidence, examination results, transcripts, identity documents and the published scholarship form.",
    procedure:
      "Monitor the University of Buea announcements and apply through the institution when a call opens.",
    website: "https://www.ubuea.cm/",
    region: "Cameroon",
    eligibility:
      "Students admitted to eligible University of Buea programmes; availability depends on the institutional call.",
  },
  {
    name: "French Government and Campus France scholarships",
    country: "France",
    provider: "French Government / Campus France",
    coverage:
      "Scholarships vary by programme and call and may cover tuition, living costs, travel or research support.",
    documents:
      "Diplomas, transcripts, CV, motivation letter, language evidence and scholarship-specific forms.",
    procedure:
      "Check Campus France Cameroon and the relevant French institution for the current call, then follow its application route.",
    website: "https://www.campusfrance.org/en",
    region: "Outside Africa",
    eligibility:
      "Cameroonian students who meet the specific French government, institution or programme call.",
  },
  {
    name: "University of Toronto International Scholar Award",
    country: "Canada",
    provider: "University of Toronto",
    coverage:
      "Competitive, substantial tuition support for exceptional international undergraduates.",
    documents:
      "Admission application, transcripts, school nomination where required, personal profile and references.",
    procedure:
      "Apply for admission by the published deadline and complete the university scholarship/award steps.",
    website: "https://future.utoronto.ca/finances/scholarships/",
    region: "Outside Africa",
    eligibility:
      "International secondary-school applicants nominated or considered through the University of Toronto process.",
  },
  {
    name: "McGill Entrance Scholarships",
    country: "Canada",
    provider: "McGill University",
    coverage: "Entrance awards and major renewable scholarships; conditions vary by faculty.",
    documents: "Admission application, academic records and scholarship profile when requested.",
    procedure:
      "Submit the undergraduate admission application and review the awards portal after applying.",
    website: "https://www.mcgill.ca/studentaid/scholarships/",
    region: "Outside Africa",
    eligibility: "International undergraduate applicants with competitive academic results.",
  },
  {
    name: "Chevening Scholarships",
    country: "United Kingdom",
    provider: "UK Government",
    coverage: "Fully funded one-year master's: tuition, living allowance, travel and allowances.",
    documents: "Degree certificates, references, essays, passport and qualifying work experience.",
    procedure:
      "Create an account, submit the online application before the annual deadline, then complete interviews if shortlisted.",
    website: "https://www.chevening.org/scholarships/",
    region: "Outside Africa",
    eligibility:
      "Cameroonian citizens with an undergraduate degree and the required post-graduation work experience; not an A-Level-only award.",
  },
  {
    name: "DAAD Scholarships",
    country: "Germany",
    provider: "German Academic Exchange Service",
    coverage:
      "Monthly grant and possible travel, insurance and study allowances depending on the call.",
    documents:
      "Degree/transcripts, CV, motivation letter, study plan, references and language proof.",
    procedure:
      "Search the DAAD database, select an eligible call and submit exactly through its stated portal.",
    website: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    region: "Outside Africa",
    eligibility:
      "Mostly graduates and researchers; search the database because eligibility differs by programme.",
  },
  {
    name: "Erasmus Mundus Joint Masters",
    country: "European Union",
    provider: "European Commission",
    coverage: "Full scholarships may include tuition, travel, visa and living support.",
    documents:
      "Degree, transcript, CV, motivation letter, references, passport and language proof.",
    procedure:
      "Choose a consortium programme and apply directly to it during its annual application window.",
    website:
      "https://education.ec.europa.eu/education-levels/higher-education/erasmus-mundus-joint-masters",
    region: "Outside Africa",
    eligibility:
      "Applicants with a qualifying first degree for the selected joint master's consortium.",
  },
  {
    name: "Australia Awards Scholarships",
    country: "Australia",
    provider: "Australian Government",
    coverage: "Tuition, return travel, establishment allowance, living support and health cover.",
    documents: "Academic records, identity, English proof and programme-specific forms.",
    procedure:
      "Check Cameroon eligibility and submit through the official country portal during the annual call.",
    website: "https://www.dfat.gov.au/people-to-people/australia-awards",
    region: "Outside Africa",
    eligibility:
      "Applicants from participating countries and eligible professional backgrounds; verify Cameroon in the current call.",
  },
  {
    name: "Cameroon Ministry of Higher Education scholarships",
    country: "Cameroon",
    provider: "Ministry of Higher Education",
    coverage: "National scholarship and study-support calls vary by year, field and destination.",
    documents:
      "GCE A-Level, Baccalauréat or OSSD results, transcripts, identity documents and the published application forms.",
    procedure:
      "Monitor MINESUP announcements and submit through the stated regional or online procedure.",
    website: "https://www.minesup.gov.cm/",
    region: "Cameroon",
    eligibility:
      "Cameroonian students who meet the current ministry call; requirements and deadlines change.",
  },
  {
    name: "University of Yaoundé I excellence awards",
    country: "Cameroon",
    provider: "University of Yaoundé I",
    coverage:
      "Institutional awards and support may be available for high-performing admitted students.",
    documents:
      "Admission evidence, examination results, transcripts, identity documents and the faculty request.",
    procedure: "Apply through the university or faculty after checking the current notice.",
    website: "https://uy1.uninet.cm/",
    region: "Cameroon",
    eligibility:
      "Admitted students meeting the university's current academic and financial criteria.",
  },
  {
    name: "Mastercard Foundation Scholars at University of Pretoria",
    country: "South Africa",
    provider: "University of Pretoria / Mastercard Foundation",
    coverage:
      "Comprehensive support may include tuition, accommodation, living costs and academic support.",
    documents:
      "Academic records, admission application, financial-need evidence and leadership/community record.",
    procedure:
      "Apply for an eligible programme and follow the university's separate Mastercard Foundation process.",
    website: "https://www.up.ac.za/mastercard-foundation-scholars-programme",
    region: "Africa",
    eligibility: "Young Africans with strong academic potential and demonstrated financial need.",
  },
  {
    name: "Mastercard Foundation Scholars at University of Cape Town",
    country: "South Africa",
    provider: "University of Cape Town / Mastercard Foundation",
    coverage: "Financial and academic support for selected undergraduate or postgraduate scholars.",
    documents:
      "Programme application, academic results, personal statement and financial-need information.",
    procedure:
      "Check the UCT call, apply for admission and complete the scholarship route before its deadline.",
    website: "https://uct.ac.za/students/funding",
    region: "Africa",
    eligibility:
      "African applicants meeting the current UCT programme and scholarship requirements.",
  },
  {
    name: "University of Ghana undergraduate financial aid",
    country: "Ghana",
    provider: "University of Ghana",
    coverage: "Need-based financial aid and selected awards for admitted students.",
    documents:
      "Admission documents, academic results, household financial information and supporting evidence.",
    procedure:
      "Apply for admission and submit the financial-aid application within the university deadline.",
    website: "https://www.ug.edu.gh/funding",
    region: "Africa",
    eligibility:
      "International applicants may apply where the specific award permits; confirm nationality rules.",
  },
  {
    name: "Commonwealth Master's Scholarships",
    country: "United Kingdom",
    provider: "Commonwealth Scholarship Commission",
    coverage:
      "Typically tuition, approved travel and living support for selected master's students.",
    documents:
      "First-degree results, references, development-impact statement and proof of nationality.",
    procedure: "Apply through the CSC system and the nominating agency route listed for Cameroon.",
    website: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/",
    region: "Outside Africa",
    eligibility:
      "Citizens of eligible Commonwealth countries; confirm Cameroon and the current nomination route.",
  },
  {
    name: "Eiffel Excellence Scholarship",
    country: "France",
    provider: "French Ministry for Europe and Foreign Affairs",
    coverage:
      "Monthly allowance and selected support for master's and doctoral study; institutions submit candidates.",
    documents:
      "Admission/project documents, transcripts, CV, references and institution-specific forms.",
    procedure:
      "Contact the French institution first; the institution submits the eligible candidate.",
    website: "https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence",
    region: "Outside Africa",
    eligibility:
      "International applicants nominated by an eligible French institution; not a direct student application.",
  },
  {
    name: "Swedish Institute Scholarships",
    country: "Sweden",
    provider: "Swedish Institute",
    coverage: "Full tuition, monthly allowance and travel grant for selected master's programmes.",
    documents: "Degree, work/leadership evidence, CV, references and programme application.",
    procedure:
      "Apply to an eligible Swedish master's programme, then complete the SI scholarship application.",
    website: "https://si.se/en/apply/scholarships/",
    region: "Outside Africa",
    eligibility:
      "Citizens of countries listed in the current SI call; verify Cameroon before applying.",
  },
  {
    name: "Global Korea Scholarship",
    country: "South Korea",
    provider: "Government of Korea",
    coverage:
      "Tuition, language training, allowance, airfare and settlement support under the annual call.",
    documents:
      "Secondary or degree certificates, transcripts, recommendation, passport and health documents.",
    procedure: "Apply through the Korean Embassy in Cameroon or a participating university route.",
    website: "https://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do",
    region: "Outside Africa",
    eligibility:
      "International applicants, including eligible Cameroonian applicants, within the annual age and grade rules.",
  },
];

const highSchoolEligibleScholarships = new Set([
  "MEXT Undergraduate Scholarship",
  "MEXT College of Technology (KOSEN)",
  "Türkiye Scholarships",
  "African Leadership University Mastercard Foundation Scholars",
  "Ashesi University need-based financial aid",
  "University of Buea academic scholarships",
  "University of Toronto International Scholar Award",
  "McGill Entrance Scholarships",
  "Cameroon Ministry of Higher Education scholarships",
  "University of Yaoundé I excellence awards",
  "Mastercard Foundation Scholars at University of Pretoria",
  "Mastercard Foundation Scholars at University of Cape Town",
  "University of Ghana undergraduate financial aid",
  "Global Korea Scholarship",
]);

function ScholarshipsPage() {
  const { t, locale } = useI18n();
  const copy = {
    en: {
      lead: "Explore scholarships grouped for Cameroon, other African destinations and the rest of the world. Eligibility and deadlines change, so verify every call on its official provider website.",
      filter: "Filter by country",
      cameroon: "Cameroon",
      africa: "Africa",
      outside: "Outside Africa",
      coverage: "Coverage",
      documents: "Documents",
      application: "Application",
      eligibility: "Eligibility",
      official: "Official scholarship details",
    },
    fr: {
      lead: "Découvrez les bourses pour le Cameroun, l'Afrique et le reste du monde. Les conditions et dates changent : vérifiez chaque appel sur le site officiel.",
      filter: "Filtrer par pays",
      cameroon: "Cameroun",
      africa: "Afrique",
      outside: "Hors d'Afrique",
      coverage: "Financement",
      documents: "Documents",
      application: "Candidature",
      eligibility: "Éligibilité",
      official: "Détails officiels de la bourse",
    },
    es: {
      lead: "Explore becas para Camerún, África y el resto del mundo. Verifique siempre los requisitos y fechas en el sitio oficial.",
      filter: "Filtrar por país",
      cameroon: "Camerún",
      africa: "África",
      outside: "Fuera de África",
      coverage: "Cobertura",
      documents: "Documentos",
      application: "Solicitud",
      eligibility: "Elegibilidad",
      official: "Detalles oficiales",
    },
    de: {
      lead: "Entdecken Sie Stipendien für Kamerun, Afrika und die übrige Welt. Prüfen Sie Voraussetzungen und Fristen immer auf der offiziellen Website.",
      filter: "Nach Land filtern",
      cameroon: "Kamerun",
      africa: "Afrika",
      outside: "Außerhalb Afrikas",
      coverage: "Leistungen",
      documents: "Unterlagen",
      application: "Bewerbung",
      eligibility: "Voraussetzungen",
      official: "Offizielle Details",
    },
    ar: {
      lead: "اكتشف المنح الدراسية في الكاميرون وأفريقيا وبقية العالم. تحقق دائماً من الشروط والمواعيد في الموقع الرسمي.",
      filter: "التصفية حسب البلد",
      cameroon: "الكاميرون",
      africa: "أفريقيا",
      outside: "خارج أفريقيا",
      coverage: "التمويل",
      documents: "الوثائق",
      application: "التقديم",
      eligibility: "الأهلية",
      official: "التفاصيل الرسمية",
    },
  }[locale];
  const [country, setCountry] = useState("All");
  const countries = useMemo(
    () => ["All", ...new Set(scholarships.map((item) => item.country))],
    [],
  );
  const shown =
    country === "All" ? scholarships : scholarships.filter((item) => item.country === country);
  const undergraduateCount = scholarships.filter((item) =>
    highSchoolEligibleScholarships.has(item.name),
  ).length;
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
          {t("page.scholarships")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
          {t("page.scholarships.title")}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{copy.lead}</p>
        <div className="mt-6 rounded-2xl border border-secondary/40 bg-secondary/5 p-5">
          <p className="font-display text-3xl font-bold text-foreground">{undergraduateCount}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            scholarships and aid routes currently listed as potentially open to Cameroonian
            high-school graduates with a BAC, GCE A&apos;Level or OSSD. Check each current call, age
            limit, admission requirement and deadline before applying.
          </p>
        </div>
        <label className="mt-8 block max-w-sm text-sm font-medium">
          {copy.filter}
          <select
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
          >
            {countries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <div className="mt-6 space-y-10">
          {(["Cameroon", "Africa", "Outside Africa"] as const).map((group) => {
            const groupItems = shown.filter((item) => item.region === group);
            if (groupItems.length === 0) return null;
            return (
              <section key={group}>
                <h2 className="mb-4 font-display text-2xl font-semibold">
                  {group === "Cameroon"
                    ? copy.cameroon
                    : group === "Africa"
                      ? copy.africa
                      : copy.outside}
                </h2>
                <div className="grid gap-5 lg:grid-cols-2">
                  {groupItems.map((item) => (
                    <article
                      key={item.name}
                      className="rounded-2xl border border-border bg-card p-6"
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
                        {item.country} · {item.provider}
                      </p>
                      <h2 className="mt-2 font-display text-xl font-semibold">{item.name}</h2>
                      <p className="mt-3 text-sm text-muted-foreground">
                        <strong>{copy.coverage}:</strong> {item.coverage}
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        <strong>{copy.documents}:</strong> {item.documents}
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        <strong>{copy.application}:</strong> {item.procedure}
                      </p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        <strong>{copy.eligibility}:</strong> {item.eligibility}
                      </p>
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                      >
                        {copy.official} →
                      </a>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
