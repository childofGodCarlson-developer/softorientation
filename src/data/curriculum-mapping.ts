export type MappingStatus =
  | "DIRECT_MATCH"
  | "EMBEDDED_MATCH"
  | "DISTRIBUTED_MATCH"
  | "PARTIAL_MATCH"
  | "RELATED_CONTENT"
  | "NO_MATCH_FOUND"
  | "UNVERIFIED";

export type CurriculumTopic = {
  id: string;
  name: string;
  fr: string;
  domain: string;
  subjectIds: string[];
  evidence: "UNVERIFIED" | "REFERENCE";
  source?: string;
};

export type CurriculumSubject = {
  id: string;
  code: string;
  name: string;
  qualification: string;
  series: string;
  topics: string[];
};

export type MappingResult = {
  requirement: string;
  status: MappingStatus;
  coverage: number;
  confidence: "HIGH" | "MEDIUM" | "LOW" | "UNVERIFIED";
  matchedTopics: string[];
  unmatchedTopics: string[];
  explanation: string;
};

export const CURRICULUM_TOPICS: CurriculumTopic[] = [
  {
    id: "functions",
    name: "Functions",
    fr: "Fonctions",
    domain: "Mathematics",
    subjectIds: ["gce-maths-mech", "gce-maths-stats", "bac-c"],
    evidence: "REFERENCE",
  },
  {
    id: "limits",
    name: "Limits",
    fr: "Limites",
    domain: "Calculus",
    subjectIds: ["gce-maths-mech", "gce-maths-stats", "bac-c"],
    evidence: "REFERENCE",
  },
  {
    id: "differentiation",
    name: "Differentiation",
    fr: "Dérivation",
    domain: "Calculus",
    subjectIds: ["gce-maths-mech", "gce-maths-stats", "bac-c"],
    evidence: "REFERENCE",
  },
  {
    id: "integration",
    name: "Integration",
    fr: "Intégration",
    domain: "Calculus",
    subjectIds: ["gce-maths-mech", "gce-maths-stats", "bac-c"],
    evidence: "REFERENCE",
  },
  {
    id: "mechanics",
    name: "Mechanics",
    fr: "Mécanique",
    domain: "Mathematics",
    subjectIds: ["gce-maths-mech", "gce-physics"],
    evidence: "REFERENCE",
  },
  {
    id: "statistics",
    name: "Statistics",
    fr: "Statistiques",
    domain: "Statistics",
    subjectIds: ["gce-maths-stats"],
    evidence: "REFERENCE",
  },
  {
    id: "probability",
    name: "Probability",
    fr: "Probabilités",
    domain: "Statistics",
    subjectIds: ["gce-maths-stats"],
    evidence: "REFERENCE",
  },
  {
    id: "sets",
    name: "Sets",
    fr: "Ensembles",
    domain: "Discrete Mathematics",
    subjectIds: ["gce-maths-stats", "gce-computer"],
    evidence: "REFERENCE",
  },
  {
    id: "logic",
    name: "Logic",
    fr: "Logique",
    domain: "Discrete Mathematics",
    subjectIds: ["gce-computer", "gce-maths-stats"],
    evidence: "REFERENCE",
  },
  {
    id: "programming",
    name: "Programming",
    fr: "Programmation",
    domain: "Computer Science",
    subjectIds: ["gce-computer"],
    evidence: "REFERENCE",
  },
  {
    id: "algorithms",
    name: "Algorithms",
    fr: "Algorithmes",
    domain: "Computer Science",
    subjectIds: ["gce-computer"],
    evidence: "REFERENCE",
  },
  {
    id: "data-structures",
    name: "Data structures",
    fr: "Structures de données",
    domain: "Computer Science",
    subjectIds: ["gce-computer"],
    evidence: "REFERENCE",
  },
  {
    id: "mechanics-physics",
    name: "Mechanics",
    fr: "Mécanique",
    domain: "Physics",
    subjectIds: ["gce-physics"],
    evidence: "REFERENCE",
  },
  {
    id: "electricity",
    name: "Electricity",
    fr: "Électricité",
    domain: "Physics",
    subjectIds: ["gce-physics"],
    evidence: "REFERENCE",
  },
  {
    id: "waves",
    name: "Waves",
    fr: "Ondes",
    domain: "Physics",
    subjectIds: ["gce-physics"],
    evidence: "REFERENCE",
  },
];

export const CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  {
    id: "gce-maths-mech",
    code: "0765",
    name: "Pure Mathematics With Mechanics",
    qualification: "GCE Advanced Level",
    series: "Science",
    topics: ["functions", "limits", "differentiation", "integration", "mechanics"],
  },
  {
    id: "gce-maths-stats",
    code: "0770",
    name: "Pure Mathematics With Statistics",
    qualification: "GCE Advanced Level",
    series: "Science",
    topics: [
      "functions",
      "limits",
      "differentiation",
      "integration",
      "statistics",
      "probability",
      "sets",
      "logic",
    ],
  },
  {
    id: "gce-further-maths",
    code: "0775",
    name: "Further Mathematics",
    qualification: "GCE Advanced Level",
    series: "Science",
    topics: ["functions", "statistics", "probability", "sets", "logic"],
  },
  {
    id: "gce-computer",
    code: "0795",
    name: "Computer Science",
    qualification: "GCE Advanced Level",
    series: "Science",
    topics: ["programming", "algorithms", "data-structures", "logic"],
  },
  {
    id: "gce-ict",
    code: "0796",
    name: "Information and Communication Technology",
    qualification: "GCE Advanced Level",
    series: "Science",
    topics: ["programming"],
  },
  {
    id: "gce-physics",
    code: "0780",
    name: "Physics",
    qualification: "GCE Advanced Level",
    series: "Science",
    topics: ["mechanics-physics", "electricity", "waves"],
  },
  {
    id: "gce-biology",
    code: "0710",
    name: "Biology",
    qualification: "GCE Advanced Level",
    series: "Science",
    topics: [],
  },
  {
    id: "gce-chemistry",
    code: "0715",
    name: "Chemistry",
    qualification: "GCE Advanced Level",
    series: "Science",
    topics: [],
  },
  {
    id: "gce-accounting",
    code: "0705",
    name: "Accounting",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: [],
  },
  {
    id: "gce-economics",
    code: "0725",
    name: "Economics",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: [],
  },
  {
    id: "gce-english",
    code: "0730",
    name: "English Language",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: [],
  },
  {
    id: "gce-literature",
    code: "0735",
    name: "Literature in English",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: [],
  },
  {
    id: "gce-food",
    code: "0740",
    name: "Food Science and Nutrition",
    qualification: "GCE Advanced Level",
    series: "Science",
    topics: [],
  },
  {
    id: "gce-food-arts",
    code: "0740",
    name: "Food Science and Nutrition",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: [],
  },
  {
    id: "gce-french",
    code: "0745",
    name: "French",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: [],
  },
  {
    id: "gce-bilingual-french",
    code: "0746",
    name: "Special Bilingual Education French",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: [],
  },
  {
    id: "gce-geography",
    code: "0750",
    name: "Geography",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: [],
  },
  {
    id: "gce-geology",
    code: "0755",
    name: "Geology",
    qualification: "GCE Advanced Level",
    series: "Science",
    topics: [],
  },
  {
    id: "gce-geology-arts",
    code: "0755",
    name: "Geology",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: [],
  },
  {
    id: "gce-history",
    code: "0760",
    name: "History",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: [],
  },
  {
    id: "gce-religious-studies",
    code: "0785",
    name: "Religious Studies",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: [],
  },
  {
    id: "gce-philosophy",
    code: "0790",
    name: "Philosophy",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: [],
  },
  {
    id: "gce-philosophy-science",
    code: "0790",
    name: "Philosophy",
    qualification: "GCE Advanced Level",
    series: "Science",
    topics: [],
  },
  {
    id: "gce-computer-arts",
    code: "0795",
    name: "Computer Science",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: ["programming", "algorithms", "data-structures", "logic"],
  },
  {
    id: "gce-ict-arts",
    code: "0796",
    name: "Information and Communication Technology",
    qualification: "GCE Advanced Level",
    series: "Arts",
    topics: ["programming"],
  },
  {
    id: "gce-geology-commercial",
    code: "0755",
    name: "Geology",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: [],
  },
  {
    id: "gce-computer-commercial",
    code: "0795",
    name: "Computer Science",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: ["programming", "algorithms", "data-structures", "logic"],
  },
  {
    id: "gce-ict-commercial",
    code: "0796",
    name: "Information and Communication Technology",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: ["programming"],
  },
  {
    id: "gce-commercial-business",
    code: "BUS",
    name: "Business Studies",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: [],
  },
  {
    id: "gce-commercial-commerce",
    code: "COM",
    name: "Commerce",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: [],
  },
  {
    id: "gce-commercial-marketing",
    code: "MKT",
    name: "Marketing",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: [],
  },
  {
    id: "gce-commercial-mathematics",
    code: "0765",
    name: "Mathematics",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: ["functions", "limits", "differentiation", "integration"],
  },
  {
    id: "gce-commercial-geography",
    code: "0750",
    name: "Geography",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: [],
  },
  {
    id: "gce-commercial-english",
    code: "0730",
    name: "English Language",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: [],
  },
  {
    id: "gce-commercial-french",
    code: "0745",
    name: "French",
    qualification: "GCE Advanced Level",
    series: "Commercial",
    topics: [],
  },
  {
    id: "bac-c",
    code: "C",
    name: "Baccalauréat C Mathematics",
    qualification: "Baccalauréat",
    series: "C",
    topics: ["functions", "limits", "differentiation", "integration"],
  },
  {
    id: "bac-d",
    code: "D",
    name: "Baccalauréat D Mathematics",
    qualification: "Baccalauréat",
    series: "D",
    topics: ["functions", "limits", "differentiation"],
  },
];

export const REQUIREMENTS: Record<string, string[]> = {
  "Calculus I": ["functions", "limits", "differentiation", "integration"],
  "Discrete Mathematics": ["sets", "logic", "functions", "algorithms"],
  Programming: ["programming", "algorithms", "data-structures"],
  Physics: ["mechanics-physics", "electricity", "waves"],
};

export function subjectsForProfile(qualification: string, series: string) {
  return CURRICULUM_SUBJECTS.filter(
    (subject) => subject.qualification === qualification && subject.series === series,
  );
}

export function topicsForSubjects(subjectIds: string[]) {
  const ids = new Set(subjectIds);
  return CURRICULUM_TOPICS.filter((topic) => topic.subjectIds.some((id) => ids.has(id)));
}

export function mapRequirement(requirement: string, subjectIds: string[]): MappingResult {
  const required = REQUIREMENTS[requirement] ?? [];
  const topics = topicsForSubjects(subjectIds);
  const found = required.filter((id) => topics.some((topic) => topic.id === id));
  const unmatched = required.filter((id) => !found.includes(id));
  const subjectCount = new Set(
    topics
      .filter((topic) => found.includes(topic.id))
      .flatMap((topic) => topic.subjectIds.filter((id) => subjectIds.includes(id))),
  ).size;
  const coverage = required.length ? Math.round((found.length / required.length) * 100) : 0;
  const status: MappingStatus =
    coverage === 0
      ? "NO_MATCH_FOUND"
      : coverage === 100
        ? subjectCount > 1
          ? "DISTRIBUTED_MATCH"
          : found.length ===
              topics.filter((topic) => subjectIds.some((id) => topic.subjectIds.includes(id)))
                .length
            ? "DIRECT_MATCH"
            : "EMBEDDED_MATCH"
        : found.length >= 2
          ? "PARTIAL_MATCH"
          : "RELATED_CONTENT";
  return {
    requirement,
    status,
    coverage,
    confidence: "UNVERIFIED",
    matchedTopics: found.map(
      (id) => CURRICULUM_TOPICS.find((topic) => topic.id === id)?.name ?? id,
    ),
    unmatchedTopics: unmatched.map(
      (id) => CURRICULUM_TOPICS.find((topic) => topic.id === id)?.name ?? id,
    ),
    explanation:
      "This is a curriculum-content comparison. It is not an official qualification equivalency or an admission decision.",
  };
}
