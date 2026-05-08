// Catalog of every NISM exam we surface in the UI.
//
// Source of truth for the chooser at /dashboard and the per-exam pages at
// /exam/[code]/. Sorted by `displayOrder`. Add an entry to surface a new exam.
//
// `nismOfficialUrl`: link out to NISM's certification page. We don't rehost
// PDFs. Update each URL to the specific cert page when verified.

export type ExamSeries =
  | 'I'
  | 'II-A'
  | 'II-B'
  | 'III-A'
  | 'IV'
  | 'V-A'
  | 'V-B'
  | 'VI'
  | 'VII'
  | 'VIII'
  | 'X-A'
  | 'X-B'
  | 'XII'
  | 'XV'
  | 'XVI'
  | 'XIX-A'
  | 'XIX-B'
  | 'XIX-C'
  | 'XIX-D'
  | 'XIX-E'
  | 'XXI-A'
  | 'XXIV'
  | 'IFSCA-01'
  | 'SOCIAL-IMPACT';

export type ExamStatus = 'available' | 'coming-soon';

export type ExamCatalogEntry = {
  /** URL slug, e.g. 'nism-va'. Lower-case, hyphenated. */
  code: string;
  series: ExamSeries;
  /** Short label for cards, e.g. 'NISM Series V-A'. */
  shortName: string;
  /** Full title, e.g. 'Mutual Fund Distributors Certification Examination'. */
  fullName: string;
  /** One-sentence audience hint shown on the card. */
  audience: string;
  /** Total questions on the actual exam. */
  totalQuestions: number;
  /** Duration in minutes. */
  durationMinutes: number;
  /** Pass percentage, integer. */
  passMarkPercent: number;
  /** Has the candidate been told to expect negative marking? */
  negativeMarking: boolean;
  /** Workbook syllabus version label, e.g. 'March 2026'. */
  syllabusVersion: string;
  /** Page on nism.ac.in for the workbook + scheduling. */
  nismOfficialUrl: string;
  /** Are study-guide chapters in src/data/exams/[code]/study/ ready? */
  studyGuideStatus: ExamStatus;
  /** Are mock-test questions seeded for this exam? */
  mockTestStatus: ExamStatus;
  /** Sort order on the catalog page (1 = first). */
  displayOrder: number;
  /** Languages this exam has authored content for. Default ['en']. Add 'hi'
   *  when Hindi chapters and questions land. The site falls back to English
   *  with a banner if a Hindi visitor hits a page that's not yet translated. */
  languages?: ReadonlyArray<'en' | 'hi'>;
};

export const EXAM_CATALOG: ExamCatalogEntry[] = [
  {
    code: 'nism-va',
    series: 'V-A',
    shortName: 'NISM Series V-A',
    fullName: 'Mutual Fund Distributors Certification Examination',
    audience: 'For anyone selling or distributing mutual funds in India.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 50,
    negativeMarking: false,
    syllabusVersion: 'March 2026',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/mutual-fund-distributors/',
    studyGuideStatus: 'available',
    mockTestStatus: 'available',
    displayOrder: 1,
    languages: ['en', 'hi'],
  },
  {
    code: 'nism-vb',
    series: 'V-B',
    shortName: 'NISM Series V-B',
    fullName: 'Mutual Fund Foundation Certification Examination',
    audience: 'Foundational certification for new entrants into the MF industry.',
    totalQuestions: 50,
    durationMinutes: 75,
    passMarkPercent: 50,
    negativeMarking: false,
    syllabusVersion: 'March 2026',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/mutual-fund-foundation/',
    studyGuideStatus: 'available',
    mockTestStatus: 'available',
    displayOrder: 2,
  },
  {
    code: 'nism-viii',
    series: 'VIII',
    shortName: 'NISM Series VIII',
    fullName: 'Equity Derivatives Certification Examination',
    audience: 'Mandatory for those dealing in equity derivatives.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'March 2026',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/equity-derivatives/',
    studyGuideStatus: 'available',
    mockTestStatus: 'available',
    displayOrder: 3,
  },
  {
    code: 'nism-xv',
    series: 'XV',
    shortName: 'NISM Series XV',
    fullName: 'Research Analyst Certification Examination',
    audience: 'Mandatory for SEBI-registered research analysts and their partners/employees.',
    totalQuestions: 100,
    durationMinutes: 180,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'February 2026',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/research-analyst/',
    studyGuideStatus: 'available',
    mockTestStatus: 'available',
    displayOrder: 4,
  },
  {
    code: 'nism-vii',
    series: 'VII',
    shortName: 'NISM Series VII',
    fullName: 'Securities Operations and Risk Management Certification Examination',
    audience: 'For back-office and risk staff at brokers / banks.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 50,
    negativeMarking: true,
    syllabusVersion: 'January 2026',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/securities-operations-and-risk-management/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 5,
  },
  {
    code: 'nism-vi',
    series: 'VI',
    shortName: 'NISM Series VI',
    fullName: 'Depository Operations Certification Examination',
    audience: 'For DP staff handling demat operations.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'March 2026',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/depository-operations/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 6,
  },
  {
    code: 'nism-xa',
    series: 'X-A',
    shortName: 'NISM Series X-A',
    fullName: 'Investment Adviser Level 1 Certification Examination',
    audience: 'Mandatory first level for SEBI Registered Investment Advisers.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'March 2026',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/investment-adviser-level-1/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 7,
  },
  {
    code: 'nism-xb',
    series: 'X-B',
    shortName: 'NISM Series X-B',
    fullName: 'Investment Adviser Level 2 Certification Examination',
    audience: 'Second level required to become a registered IA.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'December 2025',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/investment-advisors-level-2/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 8,
  },
  {
    code: 'nism-xii',
    series: 'XII',
    shortName: 'NISM Series XII',
    fullName: 'Securities Markets Foundation Certification Examination',
    audience: 'Entry-level overview of the Indian securities markets.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'December 2025',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/securities-markets-foundation/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 9,
  },
  {
    code: 'nism-i',
    series: 'I',
    shortName: 'NISM Series I',
    fullName: 'Currency Derivatives Certification Examination',
    audience: 'Mandatory for dealing in currency derivatives segment.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'March 2026',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/currency-derivatives/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 10,
  },
  {
    code: 'nism-iv',
    series: 'IV',
    shortName: 'NISM Series IV',
    fullName: 'Interest Rate Derivatives Certification Examination',
    audience: 'For dealing in interest rate derivatives.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'March 2026',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/interest-rate-derivatives/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 11,
  },
  {
    code: 'nism-xvi',
    series: 'XVI',
    shortName: 'NISM Series XVI',
    fullName: 'Commodity Derivatives Certification Examination',
    audience: 'For dealing in commodity derivatives segment.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'March 2026',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/commodity-derivatives-certification-examination/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 12,
  },
  {
    code: 'nism-xxiv',
    series: 'XXIV',
    shortName: 'NISM Series XXIV',
    fullName: 'AML and CFT Provisions in Securities Markets',
    audience: 'AML/CFT compliance roles in the securities markets.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'November 2025',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/nism-series-xxiv-aml-and-cft-provisions-in-securities-markets-certification-examination/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 13,
  },
  {
    code: 'nism-xxia',
    series: 'XXI-A',
    shortName: 'NISM Series XXI-A',
    fullName: 'Portfolio Management Services Distributors Certification Examination',
    audience: 'For distributors of Portfolio Management Services.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'June 2025',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/about-portfolio-management-services-pms-distributors-certification-examination/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 14,
  },
  {
    code: 'nism-iia',
    series: 'II-A',
    shortName: 'NISM Series II-A',
    fullName: 'Registrars to an Issue and Share Transfer Agents — Corporate',
    audience: 'For staff of corporate RTAs.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 50,
    negativeMarking: true,
    syllabusVersion: 'October 2025',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/rta-corporate/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 15,
  },
  {
    code: 'nism-iib',
    series: 'II-B',
    shortName: 'NISM Series II-B',
    fullName: 'Registrars to an Issue and Share Transfer Agents — Mutual Fund',
    audience: 'For staff of mutual-fund RTAs.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 50,
    negativeMarking: true,
    syllabusVersion: 'December 2025',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/rta-mutual-fund/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 16,
  },
  {
    code: 'nism-iiia',
    series: 'III-A',
    shortName: 'NISM Series III-A',
    fullName: 'Securities Intermediaries Compliance (Non-Fund)',
    audience: 'Compliance officers of non-fund securities intermediaries.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'March 2026',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/securities-intermediaries-compliance-non-fund/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 17,
  },
  {
    code: 'nism-xixa',
    series: 'XIX-A',
    shortName: 'NISM Series XIX-A',
    fullName: 'AIF (Cat I & II) Distributors Certification Examination',
    audience: 'For distributors of AIF Categories I and II.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'December 2025',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/nism-series-xix-a-alternative-investment-funds-category-i-and-ii-distributors/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 18,
  },
  {
    code: 'nism-xixb',
    series: 'XIX-B',
    shortName: 'NISM Series XIX-B',
    fullName: 'AIF (Category III) Distributors Certification Examination',
    audience: 'For distributors of AIF Category III funds.',
    totalQuestions: 100,
    durationMinutes: 120,
    passMarkPercent: 60,
    negativeMarking: true,
    syllabusVersion: 'December 2025',
    nismOfficialUrl: 'https://www.nism.ac.in/certifications/nism-series-xix-b-alternative-investment-funds-category-iii-distributors/',
    studyGuideStatus: 'coming-soon',
    mockTestStatus: 'coming-soon',
    displayOrder: 19,
  },
];

export function getExamFromCatalog(code: string): ExamCatalogEntry | undefined {
  return EXAM_CATALOG.find((e) => e.code === code);
}
