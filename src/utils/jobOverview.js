const SENTENCE_SPLIT_REGEX = /(?<=[.!?])\s+/;

const HTML_TAG_REGEX = /<[^>]+>/g;
const WHITESPACE_REGEX = /\s+/g;

const GENERIC_SENTENCE_PATTERNS = [
  /^(about us|job description|overview|responsibilities|requirements|preferred|qualifications?)[:\s-]*$/i,
  /^(posted|apply|click|equal opportunity|privacy|benefits)[:\s-]/i,
  /cookies|accessibility|terms of use|legal|policy/i,
];

const GENERIC_SKILL_PATTERNS = [
  /^communication skills?$/i,
  /^team player$/i,
  /^problem solving$/i,
  /^detail oriented$/i,
];

const SKILL_CANDIDATES = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'C#',
  'SQL',
  'Excel',
  'Power BI',
  'Tableau',
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  'Git',
  'REST API',
  'GraphQL',
  'Machine Learning',
  'Data Analysis',
  'Data Modeling',
  'ETL',
  'Snowflake',
  'DBT',
  'Airflow',
  'SAP',
  'ServiceNow',
  'Jira',
  'Linux',
  'Testing',
  'Automation',
  'Networking',
  'Troubleshooting',
  'Customer Support',
  'Financial Modeling',
  'SEO',
  'SEM',
  'Marketing',
  'Sales',
];

export const stripHtml = (value = '') =>
  value
    .replace(/<br\s*\/?>/gi, '. ')
    .replace(/<\/(p|div|li|h\d|section|article)>/gi, '. ')
    .replace(HTML_TAG_REGEX, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(WHITESPACE_REGEX, ' ')
    .trim();

const cleanSentence = (sentence = '') =>
  sentence
    .replace(/\s*\|\s*/g, ' ')
    .replace(/\s*[-â€“]\s*/g, ' ')
    .replace(WHITESPACE_REGEX, ' ')
    .trim();

const isUsefulSentence = (sentence = '') => {
  if (!sentence || sentence.length < 35) return false;
  if (sentence.length > 220) return false;
  return !GENERIC_SENTENCE_PATTERNS.some((pattern) => pattern.test(sentence));
};

const titleToSentence = (job = {}) => {
  const title = (job.cleanTitle || job.title || 'This role').trim();
  const company = (job.company_name || 'the company').trim();
  return `${title} is a role at ${company} where you will contribute to the team's main work and day-to-day priorities.`;
};

const locationToSentence = (job = {}) => {
  const location = (job.cleanLocation || job.location || '').trim();
  if (!location) {
    return 'The work setup is not fully specified, so candidates should expect to confirm location and team expectations during the process.';
  }
  return `The role is based in ${location}, so you should be ready to work in that setup and collaborate with the local or distributed team.`;
};

const skillsToSentence = (skills = []) => {
  if (!skills.length) {
    return 'The role expects a mix of practical problem solving, communication, and the ability to learn the tools used by the team.';
  }
  const topSkills = skills.slice(0, 4).join(', ');
  return `The role highlights skills such as ${topSkills}, so candidates should be comfortable using them in real work situations.`;
};

export const getKeySkills = (job = {}, max = 8) => {
  const explicitSkills = Array.isArray(job.key_skills) && job.key_skills.length
    ? job.key_skills
    : (Array.isArray(job.skills_required) ? job.skills_required : []);

  const normalized = [];
  const seen = new Set();

  explicitSkills.forEach((skill) => {
    const cleaned = String(skill || '').replace(WHITESPACE_REGEX, ' ').trim();
    if (!cleaned || cleaned.length > 60) return;
    if (GENERIC_SKILL_PATTERNS.some((pattern) => pattern.test(cleaned))) return;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    normalized.push(cleaned);
  });

  if (normalized.length >= max) {
    return normalized.slice(0, max);
  }

  const haystack = `${job.title || ''} ${stripHtml(job.description_raw || '')}`.toLowerCase();
  SKILL_CANDIDATES.forEach((candidate) => {
    if (normalized.length >= max) return;
    const key = candidate.toLowerCase();
    if (seen.has(key)) return;
    if (haystack.includes(key)) {
      seen.add(key);
      normalized.push(candidate);
    }
  });

  return normalized.slice(0, max);
};

export const getRoleOverview = (job = {}) => {
  if (Array.isArray(job.role_overview) && job.role_overview.length) {
    return job.role_overview.map((sentence) => cleanSentence(sentence)).filter(Boolean).slice(0, 8);
  }

  const description = stripHtml(job.description_raw || '');
  const sentences = description
    .split(SENTENCE_SPLIT_REGEX)
    .map((sentence) => cleanSentence(sentence))
    .filter(isUsefulSentence);

  const overview = [];
  const seen = new Set();

  const pushSentence = (sentence) => {
    const cleaned = cleanSentence(sentence);
    const key = cleaned.toLowerCase();
    if (!cleaned || seen.has(key)) return;
    seen.add(key);
    overview.push(cleaned.endsWith('.') ? cleaned : `${cleaned}.`);
  };

  pushSentence(titleToSentence(job));

  sentences.slice(0, 6).forEach(pushSentence);

  const skills = getKeySkills(job, 8);
  if (overview.length < 6) pushSentence(skillsToSentence(skills));
  if (overview.length < 7) pushSentence(locationToSentence(job));

  const title = (job.cleanTitle || job.title || 'This role').trim();
  if (overview.length < 8) {
    pushSentence(`${title} suits candidates who can learn quickly, stay organized, and work well with the team on regular business goals.`);
  }
  if (overview.length < 8) {
    pushSentence('Freshers can use this role to build hands-on experience, while experienced candidates can use it to deepen their domain knowledge and delivery impact.');
  }

  return overview.slice(0, 8);
};

export const getOverviewPreview = (job = {}, sentenceCount = 2) =>
  getRoleOverview(job).slice(0, sentenceCount).join(' ');
