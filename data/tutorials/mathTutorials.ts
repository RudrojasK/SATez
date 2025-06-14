import { Tutorial } from '../../types/tutorial';

// SAT Math tutorial content - hardcoded data only
export const mathTutorials: Tutorial[] = [
  {
    id: 'math-algebra-001',
    title: 'Linear Equations and Inequalities',
    description: 'Master solving linear equations and inequalities for SAT Math.',
    type: 'math',
    difficulty: 'beginner',
    estimatedTimeMinutes: 35,
    status: 'not-started',
    completionPercentage: 0,
    totalTimeSpent: 0,
    createdAt: '2025-06-11T00:00:00Z',
    updatedAt: '2025-06-11T00:00:00Z',
    learningObjectives: [
      'Solve linear equations with one variable',
      'Work with linear inequalities',
      'Understand systems of linear equations',
      'Apply linear concepts to word problems'
    ],
    tags: ['math', 'algebra', 'linear-equations', 'inequalities'],
    steps: [
      {
        id: 'linear-001',
        title: 'Basic Linear Equations',
        content: `A linear equation is an equation where the highest power of the variable is 1. The general form is ax + b = c.

Basic solving steps:
1. Simplify both sides (combine like terms)
2. Get all variables on one side
3. Get all constants on the other side
4. Divide by the coefficient of the variable

Example: 3x + 7 = 22
Step 1: Already simplified
Step 2: Subtract 7 from both sides → 3x = 15
Step 3: Divide by 3 → x = 5

Check: 3(5) + 7 = 15 + 7 = 22 ✓

Key tip: Whatever you do to one side, you must do to the other side to maintain equality.`,
        type: 'text',
        isCompleted: false,
        hints: [
          'Always check your answer by substituting back',
          'Keep track of positive and negative signs',
          'Work step by step - don\'t skip operations'
        ]
      },
      {
        id: 'linear-002',
        title: 'Equations with Fractions and Decimals',
        content: `When dealing with fractions or decimals in linear equations, multiply through to clear them.

For fractions:
Multiply both sides by the LCD (least common denominator)

Example: (2x + 1)/3 = (x - 2)/2
Step 1: LCD is 6, multiply both sides by 6
6 × (2x + 1)/3 = 6 × (x - 2)/2
2(2x + 1) = 3(x - 2)
4x + 2 = 3x - 6
x = -8

For decimals:
Multiply by powers of 10 to eliminate decimals

Example: 0.3x + 0.7 = 1.2
Multiply by 10: 3x + 7 = 12
Solve: 3x = 5, so x = 5/3`,
        type: 'text',
        isCompleted: false,
        hints: [
          'Find the LCD for fractions carefully',
          'Count decimal places to determine what power of 10 to use',
          'Distribute carefully when clearing parentheses'
        ]
      },
      {
        id: 'linear-003',
        title: 'Linear Inequalities',
        content: `Linear inequalities use <, >, ≤, or ≥ instead of =. Most rules are the same as equations, with one crucial exception:

When you multiply or divide by a negative number, flip the inequality sign!

Example: -2x + 5 > 11
Step 1: Subtract 5 → -2x > 6
Step 2: Divide by -2 (flip the sign!) → x < -3

Graphing inequalities:
• Open circle (○) for < or >
• Closed circle (●) for ≤ or ≥
• Shade to the left for "less than"
• Shade to the right for "greater than"

Compound inequalities:
"And" (∩): both conditions must be true
"Or" (∪): at least one condition must be true

Example: -1 < x + 2 ≤ 5
Subtract 2 from all parts: -3 < x ≤ 3`,
        type: 'text',
        isCompleted: false,
        hints: [
          'Remember to flip the inequality when multiplying/dividing by negative',
          'Check your answer by testing a value in the solution range',
          'For compound inequalities, solve each part separately'
        ]
      }
    ],
    prerequisites: []
  },
  {
    id: 'math-geometry-001',
    title: 'Area and Perimeter Fundamentals',
    description: 'Essential area and perimeter formulas for SAT Math success.',
    type: 'math',
    difficulty: 'beginner',
    estimatedTimeMinutes: 25,
    status: 'not-started',
    completionPercentage: 0,
    totalTimeSpent: 0,
    createdAt: '2025-06-11T00:00:00Z',
    updatedAt: '2025-06-11T00:00:00Z',
    learningObjectives: [
      'Calculate area and perimeter of basic shapes',
      'Apply formulas to complex figures',
      'Solve word problems involving area and perimeter',
      'Work with composite figures'
    ],
    tags: ['math', 'geometry', 'area', 'perimeter'],
    steps: [
      {
        id: 'geometry-001',
        title: 'Basic Shape Formulas',
        content: `Memorize these essential formulas:

RECTANGLES:
• Area = length × width
• Perimeter = 2(length + width)

SQUARES:
• Area = side²
• Perimeter = 4 × side

TRIANGLES:
• Area = (1/2) × base × height
• Perimeter = sum of all three sides

CIRCLES:
• Area = πr²
• Circumference = 2πr or πd

Key points:
- Area is always in square units (cm², ft², etc.)
- Perimeter/circumference is in linear units (cm, ft, etc.)
- For triangles, height must be perpendicular to the base
- Remember π ≈ 3.14 or 22/7 for calculations`,
        type: 'text',
        isCompleted: false,
        hints: [
          'Draw and label diagrams for word problems',
          'Double-check which measurement the problem is asking for',
          'Pay attention to units in your final answer'
        ]
      }
    ],
    prerequisites: []
  }
];

export const getMathTutorialById = (id: string): Tutorial | undefined => {
  return mathTutorials.find(tutorial => tutorial.id === id);
};

export const getMathTutorialsByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Tutorial[] => {
  return mathTutorials.filter(tutorial => tutorial.difficulty === difficulty);
}; 