export type ProspectingInput = {
  batchName: string;
  industry: string;
  targetTitles: string;
  geography: string;
  companySize: string;
  companyType: string;
  qualificationCriteria: string;
};

export type Prospect = {
  id: string;
  company: string;
  description: string;
  industry: string;
  employeeRange: string;
  geography: string;
  contactName: string;
  title: string;
  website: string;
  companyType: string;
  matchReasons: string[];
  matchScore: number;
  qualified: boolean;
};

type ProspectCandidate = Omit<Prospect, 'matchReasons' | 'matchScore' | 'qualified'> &
  Partial<Pick<Prospect, 'matchReasons' | 'matchScore' | 'qualified'>>;

export type Product = {
  id: 'prospecting' | 'outreach';
  name: string;
  mode: 'self-service demo';
};

export const demoProducts: Product[] = [
  { id: 'prospecting', name: 'AI Prospecting', mode: 'self-service demo' },
  { id: 'outreach', name: 'AI Outreach', mode: 'self-service demo' },
];

export type ContactRecord = {
  firstName: string;
  company: string;
  role: string;
  email: string;
  context: string;
  sourceRow: number;
};

export type OutreachSettings = {
  offering: string;
  targetCustomer: string;
  problem: string;
  valueProposition: string;
  tone: 'Warm and professional' | 'Direct and concise' | 'Thoughtful and consultative';
  length: 'Short' | 'Standard';
  callToAction: string;
};

export type OutreachDraft = {
  id: string;
  contact: ContactRecord;
  subject: string;
  body: string;
  rationale: string;
  status: 'Needs review';
  qualityChecks: string[];
};

export type ProspectingRun = {
  kind: 'prospecting';
  id: string;
  name: string;
  status: 'processing' | 'ready' | 'failed';
  failureReason?: string;
  createdAt: string;
  icp: ProspectingInput;
  prospects: Prospect[];
};

export type OutreachRun = {
  kind: 'outreach';
  id: string;
  name: string;
  status: 'processing' | 'ready' | 'failed';
  failureReason?: string;
  createdAt: string;
  contacts: ContactRecord[];
  settings: OutreachSettings;
  drafts: OutreachDraft[];
};

export type DemoRun = ProspectingRun | OutreachRun;

export interface ProductDemoService {
  listRuns(): Promise<DemoRun[]>;
  startProspecting(input: ProspectingInput): Promise<ProspectingRun>;
  completeProspecting(id: string): Promise<ProspectingRun>;
  startOutreach(name: string, contacts: ContactRecord[], settings: OutreachSettings): Promise<OutreachRun>;
  completeOutreach(id: string): Promise<OutreachRun>;
  saveOutreachDrafts(id: string, drafts: OutreachDraft[]): Promise<OutreachRun>;
  failRun(id: string, message: string): Promise<DemoRun>;
}

const storageKey = 'revenue-practice-demo-runs-v2';

const sampleProspects: ProspectCandidate[] = [
  {
    id: 'sample-01',
    company: 'Northstar Ledger',
    description: 'Fictional finance workflow software for growing professional-services teams.',
    industry: 'B2B software',
    employeeRange: '51–100',
    geography: 'United States',
    contactName: 'Maya Chen',
    title: 'VP of Operations',
    website: 'https://northstar-ledger.example',
    companyType: 'Software company',
    matchReasons: ['Role aligns with operations leadership', 'Company profile fits a B2B software example'],
    qualified: true,
  },
  {
    id: 'sample-02',
    company: 'Juniper Works',
    description: 'Fictional workforce planning platform for distributed service businesses.',
    industry: 'Workforce technology',
    employeeRange: '101–250',
    geography: 'Canada',
    contactName: 'Ethan Brooks',
    title: 'Chief Operating Officer',
    website: 'https://juniperworks.example',
    companyType: 'Software company',
    matchReasons: ['Senior operations decision-maker', 'Mid-market company-size example'],
    qualified: true,
  },
  {
    id: 'sample-03',
    company: 'Harborlight Systems',
    description: 'Fictional customer-support software built for regulated service providers.',
    industry: 'B2B software',
    employeeRange: '251–500',
    geography: 'United Kingdom',
    contactName: 'Amara Okafor',
    title: 'Director of Revenue Operations',
    website: 'https://harborlight-systems.example',
    companyType: 'Software company',
    matchReasons: ['Revenue operations role is adjacent to the requested persona', 'B2B software example'],
    qualified: true,
  },
  {
    id: 'sample-04',
    company: 'Cedarline Analytics',
    description: 'Fictional reporting tools that help regional logistics teams review service activity.',
    industry: 'Data and analytics',
    employeeRange: '11–50',
    geography: 'United States',
    contactName: 'Lucas Ferreira',
    title: 'Head of Business Operations',
    website: 'https://cedarline-analytics.example',
    companyType: 'Data and analytics company',
    matchReasons: ['Operations leadership persona', 'Smaller company-size example'],
    qualified: true,
  },
  {
    id: 'sample-05',
    company: 'Morrow Field Services',
    description: 'Fictional field-service coordination provider serving commercial operators.',
    industry: 'Business services',
    employeeRange: '51–100',
    geography: 'Australia',
    contactName: 'Priya Nair',
    title: 'Chief Executive Officer',
    website: 'https://morrow-field.example',
    companyType: 'Field service business',
    matchReasons: ['Executive decision-maker', 'Service-business company-type example'],
    qualified: true,
  },
  {
    id: 'sample-06',
    company: 'Copper Finch Studio',
    description: 'Fictional independent creative studio working with early-stage consumer brands.',
    industry: 'Creative services',
    employeeRange: '1–10',
    geography: 'United States',
    contactName: 'Noah Williams',
    title: 'Creative Director',
    website: 'https://copperfinch.example',
    companyType: 'Creative services studio',
    matchReasons: ['Creative-services example differs from a software ICP'],
    qualified: false,
  },
  {
    id: 'sample-07',
    company: 'Granite Peak Supply',
    description: 'Fictional wholesale distributor of equipment for regional construction firms.',
    industry: 'Wholesale distribution',
    employeeRange: '501–1,000',
    geography: 'Germany',
    contactName: 'Sofia Müller',
    title: 'Director of Procurement',
    website: 'https://granitepeak-supply.example',
    companyType: 'Wholesale distributor',
    matchReasons: ['Procurement role differs from the requested operations persona'],
    qualified: false,
  },
  {
    id: 'sample-08',
    company: 'Blue Orchard Learning',
    description: 'Fictional education publisher producing curriculum for local school programs.',
    industry: 'Education',
    employeeRange: '11–50',
    geography: 'Ireland',
    contactName: 'Daniel Osei',
    title: 'Head of Partnerships',
    website: 'https://blueorchard-learning.example',
    companyType: 'Education publisher',
    matchReasons: ['Partnerships role is outside the operations persona example'],
    qualified: false,
  },
];

const criterionWeights = {
  industry: 3,
  targetTitles: 3,
  geography: 2,
  companySize: 2,
  companyType: 2,
  qualificationCriteria: 2,
} as const;

const ignoredCriterionWords = new Set([
  'about', 'also', 'and', 'are', 'based', 'business', 'company', 'exclude', 'for', 'from', 'have',
  'has', 'in', 'include', 'looking', 'must', 'need', 'not', 'only', 'prefer', 'that', 'the', 'their',
  'this', 'those', 'to', 'with', 'within', 'without',
]);

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[–—]/g, '-')
    .replace(/[^a-z0-9+.-]+/g, ' ')
    .trim();
}

function words(value: string) {
  return normalizeText(value).split(/\s+/).filter((word) => word.length > 1);
}

function keywordCoverage(query: string, candidate: string) {
  const queryWords = [...new Set(words(query).filter((word) => !ignoredCriterionWords.has(word)))];
  if (!queryWords.length) return 0;
  const candidateWords = new Set(words(candidate));
  const matches = queryWords.filter((word) => candidateWords.has(word)).length;
  return matches / queryWords.length;
}

function splitAlternatives(value: string) {
  return value.split(/[,;|\n]+|\s+\b(?:and|or)\b\s+/i).map((part) => part.trim()).filter(Boolean);
}

function normalizeGeography(value: string) {
  const normalized = normalizeText(value);
  if (['us', 'usa', 'u s', 'united states', 'america'].includes(normalized)) return 'united states';
  if (['uk', 'u k', 'united kingdom', 'great britain'].includes(normalized)) return 'united kingdom';
  return normalized;
}

function titleAliases(value: string) {
  const title = normalizeText(value);
  const aliases = [title];
  if (/\bcoo\b/.test(title) || /\bchief operating officer\b/.test(title)) aliases.push('chief operating officer', 'coo');
  if (/\bceo\b/.test(title) || /\bchief executive officer\b/.test(title)) aliases.push('chief executive officer', 'ceo');
  if (/\bvp\b/.test(title) || /\bvice president\b/.test(title)) {
    aliases.push(title.replace(/\bvp\b/g, 'vice president'), title.replace(/\bvice president\b/g, 'vp'));
  }
  if (/\bops\b/.test(title)) aliases.push(title.replace(/\bops\b/g, 'operations'));
  return [...new Set(aliases)];
}

function titleMatches(targets: string, title: string) {
  const rankWords = new Set([
    'chief', 'director', 'executive', 'head', 'officer', 'president', 'senior', 'vp', 'vice',
  ]);
  const wordsByRole = (value: string) => words(value).filter((word) => word !== 'of');
  const matchesWords = (left: string[], right: string[]) =>
    left.length === right.length && left.every((word) => right.includes(word));
  const candidateVariants = titleAliases(title);
  return splitAlternatives(targets).some((target) =>
    titleAliases(target).some((variant) => {
      if (variant === candidateVariants[0] || candidateVariants.includes(variant)) return true;
      const targetWords = wordsByRole(variant);
      return candidateVariants.some((candidate) => {
        const candidateWords = wordsByRole(candidate);
        const targetRank = targetWords.filter((word) => rankWords.has(word));
        const candidateRank = candidateWords.filter((word) => rankWords.has(word));
        const targetRole = targetWords.filter((word) => !rankWords.has(word));
        const candidateRole = candidateWords.filter((word) => !rankWords.has(word));
        const sameRole = matchesWords(targetRole, candidateRole);
        const sameRank = matchesWords(targetRank, candidateRank) || targetRank.length === 0 || candidateRank.length === 0;
        return sameRole && sameRank && (targetRole.length > 0 || targetRank.some((word) => candidateRank.includes(word)));
      });
    }),
  );
}

function sizeRange(value: string): [number, number] | null {
  const normalized = normalizeText(value.replace(/(\d),(?=\d)/g, '$1'));
  const numbers = [...normalized.matchAll(/\d+/g)].map((match) => Number(match[0]));
  if (/\b(under|below|less than|fewer than)\b/.test(normalized) && numbers[0] !== undefined) {
    return [0, Math.max(0, numbers[0] - 1)];
  }
  if (/\b(over|above|more than|at least)\b/.test(normalized) && numbers[0] !== undefined) {
    return [numbers[0], Number.POSITIVE_INFINITY];
  }
  if (numbers.length >= 2) return [Math.min(numbers[0], numbers[1]), Math.max(numbers[0], numbers[1])];
  if (numbers.length === 1) {
    if (normalized.includes('+')) return [numbers[0], Number.POSITIVE_INFINITY];
    return [numbers[0], numbers[0]];
  }
  if (/\b(startup|small|early stage)\b/.test(normalized)) return [0, 50];
  if (/\b(mid market|midmarket|growth stage)\b/.test(normalized)) return [51, 500];
  if (/\b(enterprise|large)\b/.test(normalized)) return [501, Number.POSITIVE_INFINITY];
  return null;
}

function sizeMatches(requested: string, sample: string) {
  const requestRange = sizeRange(requested);
  const sampleRange = sizeRange(sample);
  return Boolean(requestRange && sampleRange && requestRange[0] <= sampleRange[1] && sampleRange[0] <= requestRange[1]);
}

function criterionMatches(criteria: string, prospect: ProspectCandidate) {
  const normalized = normalizeText(criteria);
  const searchable = [
    prospect.description,
    prospect.industry,
    prospect.companyType,
    prospect.employeeRange,
    prospect.geography,
    prospect.title,
  ].join(' ');
  const excludeIndex = normalized.indexOf('exclude ');
  if (excludeIndex >= 0) {
    const excluded = normalized.slice(excludeIndex + 'exclude '.length).split(/\b(?:but|and|unless|prefer|include)\b/)[0];
    if (keywordCoverage(excluded, searchable) >= 0.5) return false;
  }
  return keywordCoverage(criteria, searchable) >= 0.5;
}

export function selectProspects(input: ProspectingInput, candidates: ProspectCandidate[] = sampleProspects): Prospect[] {
  const requestedGeographies = splitAlternatives(input.geography);
  const evaluated = candidates.map((prospect) => {
    const checks: { key: keyof typeof criterionWeights; matched: boolean; reason: string }[] = [
      {
        key: 'industry',
        matched: keywordCoverage(input.industry, prospect.industry) >= 0.6,
        reason: '',
      },
      {
        key: 'targetTitles',
        matched: titleMatches(input.targetTitles, prospect.title),
        reason: '',
      },
    ];

    if (input.geography.trim()) {
      checks.push({
        key: 'geography',
        matched: requestedGeographies.some((region) => normalizeGeography(region) === normalizeGeography(prospect.geography)),
        reason: '',
      });
    }
    if (input.companySize.trim()) {
      checks.push({ key: 'companySize', matched: sizeMatches(input.companySize, prospect.employeeRange), reason: '' });
    }
    if (input.companyType.trim()) {
      checks.push({ key: 'companyType', matched: keywordCoverage(input.companyType, prospect.companyType) >= 0.5, reason: '' });
    }
    if (input.qualificationCriteria.trim()) {
      checks.push({
        key: 'qualificationCriteria',
        matched: criterionMatches(input.qualificationCriteria, prospect),
        reason: '',
      });
    }

    const matchedWeight = checks.reduce((total, check) => total + (check.matched ? criterionWeights[check.key] : 0), 0);
    const totalWeight = checks.reduce((total, check) => total + criterionWeights[check.key], 0);
    const matchScore = Math.round((matchedWeight / totalWeight) * 100);
    const matchReasons = checks.map((check) => {
      const label = {
        industry: `Industry ${check.matched ? 'matches' : 'does not match'} “${input.industry}”`,
        targetTitles: `Target title ${check.matched ? 'matches' : 'does not match'} “${input.targetTitles}”`,
        geography: `Geography ${check.matched ? 'matches' : 'does not match'} “${input.geography}”`,
        companySize: `Company size ${check.matched ? 'overlaps' : 'does not overlap'} “${input.companySize}”`,
        companyType: `Company type ${check.matched ? 'matches' : 'does not match'} “${input.companyType}”`,
        qualificationCriteria: `Qualification keywords ${check.matched ? 'match' : 'do not sufficiently match'} the supplied criteria`,
      }[check.key];
      return label;
    });

    return {
      prospect: {
        ...prospect,
        matchReasons,
        matchScore,
        qualified: checks.every((check) => check.matched),
      },
      matchesCoreCriteria: checks.slice(0, 2).some((check) => check.matched),
    };
  });

  const threshold = 34;
  return evaluated
    .filter(({ prospect, matchesCoreCriteria }) => prospect.matchScore >= threshold && matchesCoreCriteria)
    .map(({ prospect }) => prospect)
    .sort((left, right) => right.matchScore - left.matchScore || left.company.localeCompare(right.company));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isContactRecord(value: unknown): value is ContactRecord {
  if (!isRecord(value)) return false;
  return (
    ['firstName', 'company', 'role', 'email', 'context'].every((key) => typeof value[key] === 'string') &&
    typeof value.sourceRow === 'number'
  );
}

function isProspectingInput(value: unknown): value is ProspectingInput {
  if (!isRecord(value)) return false;
  return ['batchName', 'industry', 'targetTitles', 'geography', 'companySize', 'companyType', 'qualificationCriteria'].every(
    (key) => typeof value[key] === 'string',
  );
}

function isOutreachSettings(value: unknown): value is OutreachSettings {
  if (!isRecord(value)) return false;
  return (
    ['offering', 'targetCustomer', 'problem', 'valueProposition', 'callToAction'].every((key) => typeof value[key] === 'string') &&
    (value.tone === 'Warm and professional' || value.tone === 'Direct and concise' || value.tone === 'Thoughtful and consultative') &&
    (value.length === 'Short' || value.length === 'Standard')
  );
}

function isProspect(value: unknown): value is Prospect {
  if (!isRecord(value)) return false;
  return (
    ['id', 'company', 'description', 'industry', 'employeeRange', 'geography', 'contactName', 'title', 'website'].every(
      (key) => typeof value[key] === 'string',
    ) &&
    Array.isArray(value.matchReasons) &&
    value.matchReasons.every((reason) => typeof reason === 'string') &&
    typeof value.qualified === 'boolean' &&
    (value.companyType === undefined || typeof value.companyType === 'string') &&
    (value.matchScore === undefined || typeof value.matchScore === 'number')
  );
}

function isDraft(value: unknown): value is OutreachDraft {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    isContactRecord(value.contact) &&
    typeof value.subject === 'string' &&
    typeof value.body === 'string' &&
    typeof value.rationale === 'string' &&
    value.status === 'Needs review' &&
    Array.isArray(value.qualityChecks) &&
    value.qualityChecks.every((item) => typeof item === 'string')
  );
}

function isDemoRun(value: unknown): value is DemoRun {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    typeof value.createdAt !== 'string' ||
    Number.isNaN(Date.parse(value.createdAt)) ||
    (value.failureReason !== undefined && typeof value.failureReason !== 'string') ||
    (value.status !== 'processing' && value.status !== 'ready' && value.status !== 'failed')
  ) {
    return false;
  }

  if (value.kind === 'prospecting') {
    return isProspectingInput(value.icp) && Array.isArray(value.prospects) && value.prospects.every(isProspect);
  }

  if (value.kind === 'outreach') {
    return (
      Array.isArray(value.contacts) &&
      value.contacts.every(isContactRecord) &&
      isOutreachSettings(value.settings) &&
      Array.isArray(value.drafts) &&
      value.drafts.every(isDraft)
    );
  }

  return false;
}

function readRuns(): DemoRun[] {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.every(isDemoRun)) {
      throw new Error('Saved demo history is invalid. Clear this browser’s demo history and try again.');
    }

    const migrated = parsed.map((run) => {
      if (run.kind !== 'prospecting' || run.prospects.every((prospect) => typeof prospect.matchScore === 'number' && typeof prospect.companyType === 'string')) {
        return run;
      }
      return { ...run, prospects: selectProspects(run.icp) };
    });
    if (migrated.some((run, index) => run !== parsed[index])) saveRuns(migrated);
    return migrated;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Saved demo history could not be read. Clear this browser’s demo history and try again.');
    }
    throw error;
  }
}

function saveRuns(runs: DemoRun[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(runs));
  } catch {
    throw new Error('The browser could not save this demo run. Check available local storage and try again.');
  }
}

function makeId() {
  return window.crypto.randomUUID();
}

function requireRun<T extends DemoRun['kind']>(
  runs: DemoRun[],
  id: string,
  kind: T,
): Extract<DemoRun, { kind: T }> {
  const run = runs.find(
    (entry): entry is Extract<DemoRun, { kind: T }> => entry.id === id && entry.kind === kind,
  );
  if (!run) throw new Error('This demo run could not be found in saved history.');
  return run;
}

function finishSentence(value: string) {
  const trimmed = value.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function cleanFragment(value: string) {
  return value.trim().replace(/[.!?]+$/, '');
}

function capitalize(value: string) {
  const trimmed = value.trim();
  return trimmed ? `${trimmed[0].toLocaleUpperCase()}${trimmed.slice(1)}` : '';
}

function valueSentence(settings: OutreachSettings) {
  const value = cleanFragment(settings.valueProposition || settings.problem);
  if (!value) return '';
  const offering = cleanFragment(settings.offering);
  const target = cleanFragment(settings.targetCustomer);
  const verb = /^(help|helps)\b/i.test(value)
    ? value.replace(/^helps?\s+/i, 'help ')
    : /^(to |improve\b|reduce\b|increase\b|simplify\b|streamline\b|support\b|build\b|create\b|manage\b|enable\b)/i.test(value)
      ? value.replace(/^to\s+/i, '')
      : '';
  const prefix = [offering, target].filter(Boolean).join(' for ');
  if (verb) return finishSentence(`${prefix ? `${prefix} is designed to ` : 'The work is designed to '}${verb}`);
  return finishSentence(`${prefix ? `${prefix} focuses on ` : 'The work focuses on '}${value}`);
}

function repeatedLanguage(subject: string, body: string) {
  const text = `${subject}\n${body}`.toLowerCase();
  if (/\b([\p{L}\p{N}]+)(?:\s+\1){1,}\b/iu.test(text)) return true;
  const sentences = body
    .split(/[.!?]+/)
    .map((sentence) => normalizeText(sentence))
    .filter((sentence) => sentence.length > 12);
  return new Set(sentences).size < sentences.length;
}

function hasIncompleteEnding(body: string) {
  const withoutSignature = body.replace(/\n+\s*(best|regards|thanks),?\s*[\s\S]*$/i, '').trim();
  return (
    /(?:\b(?:and|but|because|with|for|to|of|the|a|an|in|on|at|that|which|your|our)|[,;:])$/i.test(withoutSignature) ||
    /\b(?:and|but|so|while|if|when)\s+(?:we|you|they|it|i|our|your)$/i.test(withoutSignature)
  );
}

function hasAwkwardPhrasing(body: string) {
  return /\b(?:reaching out to you as|your note mentions|hope this finds you well|a quick introduction to|in order to|best-in-class|world-class)\b/i.test(body);
}

function hasUnsupportedClaim(body: string, contact: ContactRecord, settings: OutreachSettings) {
  const suspiciousPhrases = /\b(i (?:saw|noticed|read|researched|understand|know|heard)|i came across your (?:recent|latest)|congratulations on|your (?:team|company|organization) (?:recently|currently|has|have|is|are|was|were)|industry-leading|guaranteed|we have helped .* companies|(?:fast|rapidly)[ -]growing|world-class|market-leading|(?:recently|currently) (?:hired|expanded|launched|raised|acquired)|(?:has|have) (?:recently )?(?:grown|expanded|hired|raised|launched|acquired|adopted))\b/i;
  if (suspiciousPhrases.test(body)) return true;
  const suppliedFacts = [contact.firstName, contact.company, contact.role, contact.context, settings.offering, settings.targetCustomer, settings.problem, settings.valueProposition, settings.callToAction].join(' ');
  const suppliedNumbers = new Set(suppliedFacts.match(/\b\d+(?:[.,]\d+)?%?\b/g) ?? []);
  return (body.match(/\b\d+(?:[.,]\d+)?%?\b/g) ?? []).some((number) => !suppliedNumbers.has(number));
}

export function getOutreachQualityChecks(
  draft: Pick<OutreachDraft, 'contact' | 'subject' | 'body'>,
  settings: OutreachSettings,
) {
  const { contact, subject, body } = draft;
  const normalizedBody = normalizeText(`${subject}\n${body}`);
  const personalizationDetails = [
    contact.firstName.trim().split(/\s+/)[0],
    contact.company.trim(),
    contact.role.trim(),
    contact.context.trim(),
  ].filter((detail) => detail.length > 1);
  const hasPersonalization = personalizationDetails.some((detail) =>
    normalizedBody.includes(normalizeText(detail)),
  );
  const unsupported = hasUnsupportedClaim(body, contact, settings);
  return [
    subject.trim() ? 'Pass: subject is present' : 'Review: subject is empty',
    body.trim() ? 'Pass: body is present' : 'Review: body is empty',
    repeatedLanguage(subject, body) ? 'Review: repetitive language detected' : 'Pass: no obvious repeated language',
    hasIncompleteEnding(body) || hasAwkwardPhrasing(body)
      ? 'Review: potentially awkward or incomplete sentence'
      : 'Pass: no obvious awkward or incomplete sentence',
    hasPersonalization ? 'Pass: uses supplied contact details' : 'Review: no supplied personalization',
    unsupported ? 'Review: verify unsupported factual statements' : 'Pass: no obvious unsupported facts detected (heuristic)',
    body.length <= 1200 ? 'Pass: length is within the review limit' : 'Review: body exceeds 1,200 characters',
  ];
}

function buildDraft(contact: ContactRecord, settings: OutreachSettings, index: number): OutreachDraft {
  const firstName = contact.firstName.trim().split(/\s+/)[0] || '';
  const company = contact.company.trim();
  const greeting = settings.tone === 'Warm and professional'
    ? `Hello${firstName ? ` ${firstName}` : ''},`
    : `Hi${firstName ? ` ${firstName}` : ''},`;
  const context = contact.context.trim();
  const contextSentence = context ? `I’m reaching out about “${cleanFragment(context)}.”` : '';
  const offering = cleanFragment(settings.offering);
  const value = valueSentence(settings);
  const topic = cleanFragment(settings.problem) || offering || 'our work';
  const roleIntroduction = contact.role.trim()
    ? `Given your role as ${contact.role.trim()}${company ? ` at ${company}` : ''}, `
    : '';
  const companyIntroduction = !firstName && company && !contact.role.trim()
    ? `I’m reaching out to the team at ${company}.`
    : '';
  const openingVariants = settings.tone === 'Warm and professional'
    ? [
      `${roleIntroduction}${offering ? `I’m writing to introduce ${offering}.` : 'I’m writing to introduce our work.'}`,
      `${roleIntroduction}${offering ? `I’d like to introduce ${offering}.` : 'I’d like to introduce our work.'}`,
    ]
    : settings.tone === 'Thoughtful and consultative'
      ? [
        contextSentence || `${roleIntroduction}${offering ? `I wanted to share a brief introduction to ${offering}.` : 'I wanted to briefly introduce our work.'}`,
        contextSentence || `${roleIntroduction}${offering ? `I’m reaching out to introduce ${offering}.` : 'I’m reaching out to introduce our work.'}`,
      ]
      : [
        offering
          ? `We offer ${capitalize(offering)}${settings.targetCustomer ? ` to ${cleanFragment(settings.targetCustomer)}` : ''}.`
          : 'I’m reaching out with a brief introduction.',
        offering ? `I’m writing about ${offering}.` : 'I’m reaching out to introduce our work.',
      ];
  const opening = openingVariants[index % openingVariants.length];
  const contextLine = contextSentence && settings.tone !== 'Thoughtful and consultative' ? contextSentence : '';
  const offeringValue = value && !opening.includes(value) ? value : '';
  const consultativeLine = settings.tone === 'Thoughtful and consultative'
    ? `Would it be useful to compare notes on whether ${topic} is relevant to your team?`
    : '';
  const cta = settings.callToAction.trim();
  const close = cta
    ? finishSentence(capitalize(cta))
    : settings.tone === 'Direct and concise'
      ? 'Is this relevant?'
      : settings.tone === 'Thoughtful and consultative'
        ? ''
        : 'Would a brief conversation be useful?';
  const shortOpening = settings.tone === 'Warm and professional'
    ? offering ? `I’d like to introduce ${offering}.` : 'I’d like to introduce our work.'
    : settings.tone === 'Thoughtful and consultative'
      ? contextSentence || (offering ? `I wanted to introduce ${offering}.` : 'I wanted to briefly introduce our work.')
      : offering ? `We offer ${capitalize(offering)}.` : 'I’m reaching out with a brief introduction.';
  const shortConsultativeLine = settings.tone === 'Thoughtful and consultative'
    ? cta ? '' : `Could ${topic} be relevant to your team?`
    : consultativeLine;
  const subjectOptions = [
    offering ? `Introduction: ${capitalize(offering)}` : 'A brief introduction',
    company ? `A question for ${company}` : 'A question for your team',
    `A note about ${topic}`,
  ];
  const subject = subjectOptions[index % subjectOptions.length];
  const bodyParts = [
    greeting,
    companyIntroduction,
    opening,
    contextLine,
    offeringValue,
    consultativeLine,
    close,
    'Best,\n[Your name]',
  ].filter(Boolean);
  const standardBody = bodyParts.join('\n\n');
  const body = settings.length === 'Short'
    ? [
      greeting,
      companyIntroduction,
      shortOpening,
      value || contextLine,
      shortConsultativeLine,
      close,
      'Best,\n[Your name]',
    ].filter(Boolean).join('\n\n')
    : standardBody;
  const draft: OutreachDraft = {
    id: `${contact.sourceRow}-${index + 1}`,
    contact,
    subject,
    body,
    rationale: context
      ? 'Uses only the supplied contact details and context; review the wording before use.'
      : 'Uses a neutral introduction because no prospect-specific context was supplied.',
    status: 'Needs review',
    qualityChecks: [],
  };
  draft.qualityChecks = getOutreachQualityChecks(draft, settings);
  return draft;
}

export const productDemoService: ProductDemoService = {
  async listRuns() {
    return readRuns().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async startProspecting(input) {
    const normalizedInput = {
      ...input,
      batchName: input.batchName.trim(),
      industry: input.industry.trim(),
      targetTitles: input.targetTitles.trim(),
    };
    if (!normalizedInput.industry || !normalizedInput.targetTitles) {
      throw new Error('Add both an industry and at least one target title before reviewing the demo brief.');
    }

    const run: ProspectingRun = {
      kind: 'prospecting',
      id: makeId(),
      name: normalizedInput.batchName || `Prospecting batch — ${normalizedInput.industry}`,
      status: 'processing',
      createdAt: new Date().toISOString(),
      icp: normalizedInput,
      prospects: [],
    };
    saveRuns([...readRuns(), run]);
    return run;
  },

  async completeProspecting(id) {
    const runs = readRuns();
    const current = requireRun(runs, id, 'prospecting');
    if (current.status === 'ready') return current;
    const updated: ProspectingRun = {
      ...current,
      status: 'ready',
      failureReason: undefined,
      prospects: selectProspects(current.icp),
    };
    saveRuns(runs.map((run) => (run.id === id ? updated : run)));
    return updated;
  },

  async startOutreach(name, contacts, settings) {
    if (contacts.length === 0 || contacts.length > 100) {
      throw new Error('Choose between 1 and 100 valid, non-duplicate contacts before starting the outreach demo.');
    }

    const run: OutreachRun = {
      kind: 'outreach',
      id: makeId(),
      name,
      status: 'processing',
      createdAt: new Date().toISOString(),
      contacts,
      settings,
      drafts: [],
    };
    saveRuns([...readRuns(), run]);
    return run;
  },

  async completeOutreach(id) {
    const runs = readRuns();
    const current = requireRun(runs, id, 'outreach');
    if (current.status === 'ready') return current;
    const updated: OutreachRun = {
      ...current,
      status: 'ready',
      failureReason: undefined,
      drafts: current.contacts.map((contact, index) => buildDraft(contact, current.settings, index)),
    };
    saveRuns(runs.map((run) => (run.id === id ? updated : run)));
    return updated;
  },

  async saveOutreachDrafts(id, drafts) {
    if (!drafts.every(isDraft)) throw new Error('One or more edited drafts are invalid and could not be saved.');
    const runs = readRuns();
    const current = requireRun(runs, id, 'outreach');
    const updated: OutreachRun = { ...current, drafts };
    saveRuns(runs.map((run) => (run.id === id ? updated : run)));
    return updated;
  },

  async failRun(id, message) {
    const runs = readRuns();
    const current = runs.find((run) => run.id === id);
    if (!current) throw new Error('This demo run could not be found in saved history.');
    if (current.status === 'ready') return current;
    const updated = { ...current, status: 'failed' as const, failureReason: message };
    saveRuns(runs.map((run) => (run.id === id ? updated : run)));
    return updated;
  },
};
