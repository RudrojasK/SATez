import sampleData from '@/data/openSatSample.json';

export type Section = 'math' | 'reading' | 'writing';

export interface SATQuestion {
  id: string;
  domain: string;
  difficulty: string;
  question: {
    question: string;
    choices: Record<string, string>;
    explanation: string;
    correct_answer: string;
  };
}

interface OpenSatData {
  math: SATQuestion[];
  reading?: SATQuestion[];
  writing?: SATQuestion[];
}

const data = sampleData as OpenSatData;

export const getQuestionsBySection = (section: Section): SATQuestion[] => {
  return (data[section] ?? []) as SATQuestion[];
};

export const getQuestions = (section: Section, domain?: string): SATQuestion[] => {
  let pool = getQuestionsBySection(section);
  if (domain) {
    pool = pool.filter(q => q.domain.toLowerCase().includes(domain.toLowerCase()));
  }
  return pool;
};

export const getRandomQuestions = (section: Section, count = 10, domain?: string): SATQuestion[] => {
  const pool = getQuestions(section, domain);
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}; 