import { Tutorial } from '../../types/tutorial';

// Reading comprehension tutorial content - hardcoded data only
export const readingTutorials: Tutorial[] = [
  {
    id: 'reading-basics-001',
    title: 'Reading Comprehension Fundamentals',
    description: 'Master the essential skills for SAT Reading comprehension passages.',
    type: 'reading',
    difficulty: 'beginner',
    estimatedTimeMinutes: 25,
    status: 'not-started',
    completionPercentage: 0,
    totalTimeSpent: 0,
    createdAt: '2025-06-11T00:00:00Z',
    updatedAt: '2025-06-11T00:00:00Z',
    learningObjectives: [
      'Identify main ideas and supporting details',
      'Understand author\'s purpose and tone',
      'Make inferences from text evidence',
      'Analyze text structure and organization'
    ],
    tags: ['reading', 'comprehension', 'main-idea', 'inference'],
    steps: [
      {
        id: 'step-001',
        title: 'Understanding the SAT Reading Section',
        content: `The SAT Reading section tests your ability to understand, analyze, and interpret written passages. You'll encounter:

• Literature passages (fiction and poetry)
• History and social studies passages
• Science passages

Each passage is followed by 10-11 multiple choice questions that test various skills like finding main ideas, making inferences, and understanding vocabulary in context.

Key tip: Always read the passage first, then tackle the questions. Don't try to skim and jump to questions - this often leads to missed details.`,
        type: 'text',
        isCompleted: false,
        hints: [
          'Spend 3-4 minutes reading each passage carefully',
          'Take brief notes on main ideas as you read',
          'Pay attention to transition words and paragraph structure'
        ]
      },
      {
        id: 'step-002',
        title: 'Identifying Main Ideas',
        content: `The main idea is the central point or theme of a passage. It's what the author wants you to understand most.

How to find main ideas:
1. Look at the first and last paragraphs - they often contain thesis statements or conclusions
2. Pay attention to repeated concepts or themes
3. Notice what most paragraphs seem to support or explain

Example: If a passage discusses various renewable energy sources, mentions their benefits multiple times, and concludes with policy recommendations, the main idea might be "Renewable energy sources offer significant advantages and should be prioritized in policy decisions."

Practice: When reading any passage, try to summarize the main point in one sentence after finishing each paragraph.`,
        type: 'text',
        isCompleted: false,
        hints: [
          'Main ideas are usually broader than specific details',
          'Look for what ties all the paragraphs together',
          'The title often hints at the main idea'
        ]
      },
      {
        id: 'step-003',
        title: 'Making Strong Inferences',
        content: `An inference is a conclusion you draw based on evidence in the text, even when it's not directly stated.

Steps to make good inferences:
1. Identify what the text directly says
2. Consider what the author implies through word choice, tone, or examples
3. Connect evidence from different parts of the passage
4. Ask "What can I reasonably conclude from this information?"

Example text: "Sarah checked her watch for the fifth time in ten minutes and tapped her foot impatiently."
Inference: Sarah is anxious or waiting for something important.

Warning: Avoid making inferences that go too far beyond the text. Stick to what you can reasonably conclude from the given evidence.`,
        type: 'text',
        isCompleted: false,
        hints: [
          'Inferences should be supported by specific text evidence',
          'Don\'t bring in outside knowledge - only use what\'s in the passage',
          'Look for context clues and author\'s word choices'
        ]
      },
      {
        id: 'step-004',
        title: 'Understanding Author\'s Purpose and Tone',
        content: `Author's purpose is WHY they wrote the passage. Author's tone is HOW they feel about the subject.

Common purposes:
• To inform (explain, describe, teach)
• To persuade (convince, argue, advocate)
• To entertain (amuse, tell a story)
• To analyze (examine, critique, evaluate)

Tone indicators:
• Word choice (positive, negative, neutral words)
• Examples used (supportive or critical)
• Structure (organized argument vs. exploratory discussion)

Example: A passage about climate change that uses words like "urgent," "critical," and "immediate action needed" likely has a persuasive purpose with an concerned or urgent tone.

Practice: After reading each paragraph, ask yourself "How does the author feel about this topic?" and "What does the author want me to think or do?"`,
        type: 'text',
        isCompleted: false,
        hints: [
          'Look at adjectives and adverbs for tone clues',
          'Consider the source - is it from a scientific journal, opinion piece, or story?',
          'Multiple purposes are possible, but one is usually primary'
        ]
      },
      {
        id: 'step-005',
        title: 'Analyzing Text Structure',
        content: `Text structure is how the author organizes information. Understanding structure helps you follow the author's logic and predict where to find certain types of information.

Common structures:
• Chronological: Events in time order
• Compare/contrast: Similarities and differences
• Cause and effect: What happens and why
• Problem/solution: Issue identification and resolution
• Classification: Grouping into categories

Transition words are your clues:
• Time: first, then, later, meanwhile, finally
• Contrast: however, although, on the other hand, despite
• Cause/effect: because, therefore, as a result, consequently
• Addition: furthermore, moreover, in addition, also

Example: A passage about renewable energy that discusses solar power in paragraph 2, wind power in paragraph 3, and hydroelectric power in paragraph 4 is using classification structure.

Practice: Identify the structure of each passage you read and note how it helps you understand the content.`,
        type: 'text',
        isCompleted: false,
        hints: [
          'Transition words are like road signs showing direction',
          'Paragraph structure often mirrors overall text structure',
          'Understanding structure helps you locate specific information quickly'
        ]
      }
    ],
    prerequisites: []
  },
  {
    id: 'reading-evidence-002',
    title: 'Working with Evidence and Support',
    description: 'Learn to identify, evaluate, and use textual evidence effectively.',
    type: 'reading',
    difficulty: 'intermediate',
    estimatedTimeMinutes: 30,
    status: 'not-started',
    completionPercentage: 0,
    totalTimeSpent: 0,
    createdAt: '2025-06-11T00:00:00Z',
    updatedAt: '2025-06-11T00:00:00Z',
    learningObjectives: [
      'Locate relevant textual evidence',
      'Evaluate the strength of evidence',
      'Connect evidence to claims',
      'Distinguish between strong and weak support'
    ],
    tags: ['reading', 'evidence', 'support', 'analysis'],
    steps: [
      {
        id: 'evidence-001',
        title: 'What Counts as Evidence?',
        content: `Evidence is any information from the text that supports a claim, answer, or interpretation. Strong evidence is:

• Specific and detailed (not vague)
• Directly related to the question or claim
• Taken from the passage (not your own knowledge)
• Representative of the author's overall message

Types of evidence:
1. Direct quotes: Exact words from the text
2. Paraphrases: Text ideas in your own words
3. Examples: Specific instances the author provides
4. Statistics or data: Numbers and research mentioned
5. Expert opinions: Authorities cited by the author

Weak evidence might be:
• Too general or vague
• Taken out of context
• Contradicted by other parts of the passage
• Based on assumptions rather than text

Practice: For any claim about a passage, ask yourself "Where exactly in the text does it say or suggest this?"`,
        type: 'text',
        isCompleted: false,
        hints: [
          'Look for specific details, not general statements',
          'Evidence should directly connect to your answer',
          'Quote or reference specific line numbers when possible'
        ]
      },
      {
        id: 'evidence-002',
        title: 'Locating Evidence Efficiently',
        content: `SAT Reading questions often ask you to find evidence for your answers. Here's how to locate it quickly:

Strategy 1: Question-first approach
1. Read the question carefully
2. Identify what type of evidence you need
3. Scan the passage for relevant sections
4. Look for key words from the question

Strategy 2: Passage mapping
1. As you read, note main ideas for each paragraph
2. Mark key transitions and important details
3. When answering questions, refer to your mental map

Strategy 3: Process of elimination
1. Cross out obviously wrong answer choices
2. For remaining choices, find text support
3. Choose the answer with the strongest, most direct evidence

Key tip: Evidence-based questions usually have answer choices that point to specific lines. Read those lines and the surrounding context carefully.`,
        type: 'text',
        isCompleted: false,
        hints: [
          'Skim for key words from the question',
          'Read a few lines before and after potential evidence',
          'Don\'t just look for exact word matches - look for meaning matches'
        ]
      }
    ],
    prerequisites: ['reading-basics-001']
  }
];

export const getReadingTutorialById = (id: string): Tutorial | undefined => {
  return readingTutorials.find(tutorial => tutorial.id === id);
};

export const getReadingTutorialsByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Tutorial[] => {
  return readingTutorials.filter(tutorial => tutorial.difficulty === difficulty);
};

export const getReadingTutorialsByTag = (tag: string): Tutorial[] => {
  return readingTutorials.filter(tutorial => tutorial.tags.includes(tag));
}; 