export const practiceTests = [
    {
      id: '1',
      title: 'Full SAT Practice Test #1',
      description: 'Complete practice test with all sections',
      timeEstimate: '3 hours',
      difficulty: 'Medium',
      progress: 0,
      type: 'full',
    },
    {
      id: '2',
      title: 'Full SAT Practice Test #2',
      description: 'Official College Board practice test',
      timeEstimate: '3 hours',
      difficulty: 'Medium',
      progress: 25,
      type: 'full',
    },
    {
      id: '3',
      title: 'Reading & Writing Section',
      description: 'Practice for the verbal section',
      timeEstimate: '65 minutes',
      difficulty: 'Medium',
      progress: 75,
      type: 'section',
    },
    {
      id: '4',
      title: 'Math No-Calculator Drill',
      description: 'Quick math practice without calculators',
      timeEstimate: '25 minutes',
      difficulty: 'Hard',
      progress: 100,
      type: 'drill',
    },
    {
      id: '5',
      title: 'Vocabulary Quiz',
      description: 'Test your knowledge of common SAT vocabulary',
      timeEstimate: '15 minutes',
      difficulty: 'Easy',
      progress: 0,
      type: 'quiz',
    },
    {
      id: '6',
      title: 'Grammar Quick Quiz',
      description: 'Practice essential grammar concepts',
      timeEstimate: '10 minutes',
      difficulty: 'Easy',
      progress: 50,
      type: 'quiz',
    },
  ];
  
  export const resources = [
    {
      id: '1',
      title: 'Essential SAT Strategies',
      description: 'Top strategies to improve your score fast',
      image: require('../assets/images/react-logo.png'),
      category: 'tips',
      content: {
        overview: 'Master the fundamental strategies that can help boost your SAT score quickly. These proven techniques focus on test-taking skills and strategic approaches to different question types.',
        keyPoints: [
          'Prioritize questions based on difficulty',
          'Use the process of elimination effectively',
          'Manage your time with the "2-pass" approach',
          'Know when to guess strategically',
          'Focus on high-yield content areas'
        ],
        details: 'The SAT rewards strategic test-taking as much as content knowledge. By learning to identify patterns in questions and implementing systematic approaches to each section, you can significantly improve your score even without learning additional content.'
      }
    },
    {
      id: '2',
      title: 'Time Management Tips',
      description: 'How to manage your time during the test',
      image: require('../assets/images/react-logo.png'),
      category: 'tips',
      content: {
        overview: 'Learn how to allocate your time efficiently during the SAT to maximize your score. Time management can be the difference between completing all questions and leaving points on the table.',
        keyPoints: [
          'Track time per section using benchmarks',
          'Skip difficult questions and return later',
          'Spend no more than 1 minute per question initially',
          'Reserve 5 minutes for review at the end',
          'Practice with timed conditions regularly'
        ],
        details: 'Effective time management starts with understanding how much time to allocate to each question type. The reading section requires different pacing than the math sections. Practice identifying which questions will take you longer and learn when to move on.'
      }
    },
    {
      id: '3',
      title: 'Top 100 SAT Vocabulary Words',
      description: 'Most frequently appearing words on the test',
      image: require('../assets/images/react-logo.png'),
      category: 'vocabulary',
      content: {
        overview: 'Expand your vocabulary with the most commonly tested words on the SAT. While the current SAT focuses less on obscure vocabulary than previous versions, understanding these key terms will still improve your reading and writing scores.',
        keyPoints: [
          'Focus on words with multiple meanings',
          'Learn words in context rather than isolation',
          'Group words by themes or topics',
          'Review frequently confusing word pairs',
          'Practice applying vocabulary in sentence completion'
        ],
        details: 'A strong vocabulary helps not only with direct vocabulary questions but also with reading comprehension and writing clarity. The SAT commonly features words with subtle meanings that can change the entire meaning of a passage.'
      }
    },
    {
      id: '4',
      title: 'Math Formulas Cheat Sheet',
      description: 'All the formulas you need to memorize',
      image: require('../assets/images/react-logo.png'),
      category: 'math',
      content: {
        overview: 'A comprehensive collection of essential math formulas you need to know for the SAT. While some formulas are provided on the test, knowing all of these will save you valuable time.',
        keyPoints: [
          'Algebra: quadratic formula, slope-intercept form',
          'Geometry: area, volume, and perimeter formulas',
          'Trigonometry: sine, cosine, and tangent relationships',
          'Statistics: mean, median, mode, standard deviation',
          'Special right triangles and circle theorems'
        ],
        details: 'The SAT math section tests your ability to apply these formulas in various contexts. Understanding not just the formula but when and how to apply it will significantly improve your math score. Practice recognizing which formula to use based on the question wording.'
      }
    },
    {
      id: '5',
      title: 'Grammar Rules to Remember',
      description: 'Common grammar mistakes to avoid',
      image: require('../assets/images/react-logo.png'),
      category: 'tips',
      content: {
        overview: 'Master the essential grammar rules that are frequently tested on the SAT. The writing section heavily focuses on these fundamental principles of English grammar and usage.',
        keyPoints: [
          'Subject-verb agreement in complex sentences',
          'Pronoun clarity and consistency',
          'Punctuation rules for commas, semicolons, and colons',
          'Parallel structure in lists and comparisons',
          'Modifier placement and dangling modifiers'
        ],
        details: 'Grammar questions on the SAT follow predictable patterns. Learning to recognize common error types will help you quickly identify issues in sentences. Focus on understanding the rule behind each correction rather than just memorizing examples.'
      }
    },
  ];
  
  export const profileStats = {
    name: 'Alex Johnson',
    quizzesTaken: 27,
    averageScore: 680,
    streak: 5,
    totalHours: 42,
    completedTests: 3,
  };
  
  export const quizQuestions = [
    {
      id: '1',
      question: "The author's primary purpose in the passage is to:",
      options: [
        'argue against a popular scientific theory',
        'explain the origins of a natural phenomenon',
        'compare competing scientific explanations',
        'describe a recent scientific discovery',
      ],
      correctAnswer: 1,
    },
    {
      id: '2',
      question: 'Based on the passage, the research team was surprised to discover that:',
      options: [
        'the samples contained unexpected elements',
        'the testing method had significant flaws',
        'previous studies had overlooked key evidence',
        'their hypothesis contradicted established theories',
      ],
      correctAnswer: 0,
    },
    {
      id: '3',
      question: 'In the equation 2x² + 5x - 3 = 0, what is the value of x?',
      options: [
        'x = -3 or x = 1/2',
        'x = 3 or x = -1/2',
        'x = -3/2 or x = 1',
        'x = 3/2 or x = -1',
      ],
      correctAnswer: 2,
    },
  ];