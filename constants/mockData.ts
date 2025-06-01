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
    description: 'Top strategies to quickly boost your SAT score.',
    image: require('../assets/images/react-logo.png'),
    category: 'tips',
    content: {
      overview: 'Develop powerful strategies designed to boost your SAT scores quickly by improving test-taking efficiency and accuracy. These comprehensive tactics are applicable across all sections of the exam.',
      keyPoints: [
        'Prioritize questions by difficulty to ensure maximum points.',
        'Use elimination effectively to improve your guessing accuracy.',
        'Adopt the "two-pass" method: answer easy questions first, then return to challenging ones.',
        'Guess intelligently; no penalties for wrong answers mean educated guessing helps.',
        'Focus on mastering high-frequency SAT topics first.'
      ],
      details: 'The SAT assesses strategic thinking alongside academic knowledge. Practicing strategic approaches—such as understanding question patterns, efficiently narrowing choices, and applying systematic techniques—allows you to increase your scores even without extensive content review. Regular practice tests using these strategies are key to solidifying these skills.'
    }
  },
  {
    id: '2',
    title: 'Advanced Time Management Tips',
    description: 'Optimize your timing to improve your performance on test day.',
    image: require('../assets/images/react-logo.png'),
    category: 'tips',
    content: {
      overview: 'Master advanced time management methods designed specifically for the SAT. Efficient pacing can drastically improve your performance by maximizing the number of questions you accurately complete.',
      keyPoints: [
        'Set clear time benchmarks for each test section (e.g., 13 minutes per reading passage).',
        'Quickly skip challenging questions, marking them clearly for review later.',
        'Initially spend no more than 1 minute per question to ensure coverage.',
        'Always reserve at least 5-7 minutes for review and second-pass checks.',
        'Conduct weekly timed practice sessions to build a reliable internal clock.'
      ],
      details: 'Efficient SAT time management involves developing a strong sense of pacing specific to each test section. Recognize quickly which questions demand extra time, and don’t hesitate to skip temporarily. Regular timed practice tests will help internalize effective pacing strategies, reducing stress and improving your confidence on test day.'
    }
  },
  {
    id: '3',
    title: 'Top 100 SAT Vocabulary Words Explained',
    description: 'In-depth explanations of high-frequency SAT vocabulary words.',
    image: require('../assets/images/react-logo.png'),
    category: 'vocabulary',
    content: {
      overview: 'Enhance your SAT score by mastering the top 100 vocabulary words commonly tested on the exam. These words frequently appear in reading passages and sentence completions, making vocabulary practice essential.',
      keyPoints: [
        'Focus on words with multiple meanings or nuanced definitions.',
        'Learn words within sentence contexts rather than isolated definitions.',
        'Group words by related themes or topics for easier memorization.',
        'Practice identifying subtle differences between frequently confused pairs.',
        'Regularly practice sentence completions to apply vocabulary actively.'
      ],
      details: 'Improving your vocabulary directly enhances reading comprehension and writing skills. Familiarizing yourself with commonly tested vocabulary—especially those words that significantly affect sentence meaning—can help you quickly decode passages and eliminate incorrect answer choices. Practice regularly with flashcards, apps, or vocabulary quizzes for maximum effectiveness.'
    }
  },
  {
    id: '4',
    title: 'SAT Math Formulas Master List',
    description: 'Detailed explanations and applications for essential SAT math formulas.',
    image: require('../assets/images/react-logo.png'),
    category: 'math',
    content: {
      overview: 'Gain confidence by memorizing and mastering essential math formulas required for SAT success. Although some formulas appear on the test booklet, knowing these thoroughly will dramatically speed up your problem-solving.',
      keyPoints: [
        'Algebra: quadratic formula, slope-intercept, standard form equations.',
        'Geometry: area and volume formulas for shapes like cylinders, cones, and spheres.',
        'Trigonometry: SOHCAHTOA and special angle relationships (30°-60°-90°, 45°-45°-90° triangles).',
        'Statistics: mean, median, mode, range, and standard deviation concepts.',
        'Circle theorems: arc lengths, sector areas, and central angles.'
      ],
      details: 'The SAT math section assesses both your ability to recall formulas quickly and apply them correctly under time constraints. Thorough practice with these formulas, including recognizing contextual clues that indicate their use, is essential. Regular drills on applying formulas to practice problems will significantly enhance speed and accuracy.'
    }
  },
  {
    id: '5',
    title: 'Comprehensive Grammar Rules for SAT Success',
    description: 'Detailed explanations of frequently tested SAT grammar concepts.',
    image: require('../assets/images/react-logo.png'),
    category: 'tips',
    content: {
      overview: 'Enhance your SAT Writing and Language scores by mastering key grammar rules commonly tested. Recognizing and fixing common grammatical errors is essential for success on this section of the exam.',
      keyPoints: [
        'Understand complex subject-verb agreement scenarios, including collective nouns.',
        'Ensure clarity by consistently matching pronouns with antecedents.',
        'Master punctuation rules for commas, semicolons, colons, and dashes.',
        'Practice maintaining parallel structure in sentences involving lists or comparisons.',
        'Identify and correct misplaced and dangling modifiers to clarify meaning.'
      ],
      details: 'The SAT frequently tests grammar using common patterns and recognizable errors. By thoroughly understanding these grammar rules, you’ll be able to quickly identify mistakes and select correct answers confidently. Engage regularly with practice exercises that reinforce these grammatical concepts in context to ensure deeper understanding and better retention.'
    }
  }
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