export interface Article {
  id: string;
  title: string;
  category: 'Reading' | 'Writing' | 'Math' | 'General' | 'Test Strategy' | 'Time Management';
  // A brief summary of the article
  summary: string;
  // Full content of the article in Markdown format
  content: string; 
  // Estimated reading time in minutes

}

export const articles: Article[] = [
  {
    id: 'reading-comprehension-strategies',
    title: '5 Key Strategies for SAT Reading Comprehension',
    category: 'Reading',
    difficulty: 'Beginner',
    tags: ['comprehension', 'strategies', 'passages'],
    summary: 'Learn how to dissect passages, identify main ideas, and tackle evidence-based questions effectively.',
    readingTime: 5,
    highlights: [
      {
        id: 'h1',
        text: 'Active Reading: Annotate as You Go',
        type: 'main-idea',
        color: '#FFD700'
      },
      {
        id: 'h2',
        text: 'Use different symbols for different elements',
        type: 'tip',
        color: '#90EE90'
      },
      {
        id: 'h3',
        text: 'Don\'t confuse a supporting detail with the main idea',
        type: 'key-point',
        color: '#FFB6C1'
      }
    ],
    progress: {
      lastRead: Date.now(),
      completed: false,
      timeSpent: 0,
      sectionsCompleted: []
    },
    content: `
# 5 Key Strategies for SAT Reading Comprehension

The SAT Reading section tests your ability to understand complex passages and answer questions based on what is stated or implied. Here are five strategies to help you master it.

## 1. Active Reading: Annotate as You Go
Don't just passively read the passage. Engage with the text by underlining key phrases, circling names and dates, and jotting down the main idea of each paragraph in the margin. This keeps you focused and makes it easier to find answers later.

**Pro Tip:** Use different symbols for different elements:
- ⭐ for main ideas
- 🔍 for key details
- ❓ for confusing parts

## 2. Identify the Main Idea First
Before diving into the questions, take a moment to summarize the central theme or purpose of the passage. Ask yourself: "What is the author's primary point?" Having a clear grasp of the main idea will help you answer broader questions and put specific details into context.

**Common Pitfall:** Don't confuse a supporting detail with the main idea. The main idea should be broad enough to encompass all paragraphs.

## 3. Understand Question Types
The SAT uses predictable question types. They can be broadly categorized into:
- **Information and Ideas:** These questions ask you to find a specific piece of information, identify the main idea, or determine the meaning of a word in context.
- **Rhetoric:** These questions focus on the author's craft—how they use words, structure sentences, and build arguments.
- **Synthesis:** These questions often involve analyzing charts or graphs alongside the text or comparing two related passages.

## 4. Tackle "Evidence-Based" Pairs Together
Many questions come in pairs. The first question asks about the passage, and the second asks you to cite the specific lines of text that best support your answer to the first question. A powerful strategy is to evaluate these pairs together. Look at the evidence in the second question first—it can often help you zero in on the correct answer for the first part.

## 5. Don't Let Outside Knowledge Interfere
The SAT is a test of what the passage says, not what you know about a topic. All answers can be found directly in the text or must be logically inferred from it. Avoid making assumptions or using information that isn't provided.

## Time Management Tips
- Spend about 3 minutes reading each passage
- Allocate 1 minute per question
- Leave 2-3 minutes at the end to review marked questions
- If stuck, mark the question and move on
    `,
  },
  {
    id: 'mastering-sat-math',
    title: 'Mastering the SAT Math Section',
    category: 'Math',
    difficulty: 'Intermediate',
    tags: ['algebra', 'geometry', 'data analysis'],
    summary: 'A breakdown of the core concepts, from "Heart of Algebra" to "Passport to Advanced Math," with tips for problem-solving.',
    readingTime: 6,
    highlights: [
      {
        id: 'h1',
        text: 'Heart of Algebra (Linear Equations)',
        type: 'main-idea',
        color: '#FFD700'
      },
      {
        id: 'h2',
        text: 'Pay close attention to the wording',
        type: 'tip',
        color: '#90EE90'
      },
      {
        id: 'h3',
        text: 'Use the Formula Sheet',
        type: 'key-point',
        color: '#FFB6C1'
      }
    ],
    progress: {
      lastRead: Date.now(),
      completed: false,
      timeSpent: 0,
      sectionsCompleted: []
    },
    content: `
# Mastering the SAT Math Section

The SAT Math test covers a range of math practices, with an emphasis on problem solving, modeling, using tools strategically, and using algebraic structure. It's divided into two portions: a no-calculator section and a calculator-allowed section.

## Core Areas of Focus

### 1. Heart of Algebra (Linear Equations)
This is the largest part of the test. You'll need to be an expert in:
- Creating, solving, and interpreting linear equations and inequalities.
- Building linear functions from word problems.
- Understanding the relationship between linear equations and their graphs.

**Pro Tips:**
- Pay close attention to the wording. "At least" means \`≥\`, and "no more than" means \`≤\`.
- For word problems, write out the equation before solving
- Check your answer by plugging it back into the original equation

### 2. Problem Solving and Data Analysis (Ratios, Proportions, Percentages)
This area tests your quantitative literacy. Be prepared for:
- Ratios, rates, and proportions.
- Percentages and unit conversions.
- Interpreting data from scatterplots, graphs, and tables.
- Calculating mean, median, mode, and standard deviation.

**Pro Tips:**
- When dealing with graphs, always read the title, axis labels, and units before trying to interpret the data
- For percentage problems, remember: part/whole × 100 = percentage
- For ratios, keep units consistent

### 3. Passport to Advanced Math (Complex Equations)
This section features the kind of math that will be essential for STEM majors. It includes:
- Manipulating more complex equations, like quadratic and exponential expressions.
- Understanding polynomial functions and their graphs.
- Solving problems using function notation.

**Pro Tips:**
- Practice factoring quadratic equations quickly and accurately
- Recognizing patterns like \`(x+y)² = x² + 2xy + y²\` will save you valuable time
- For function notation, remember that f(x) means "the value of the function at x"

## General Strategies
- **Plug in Numbers:** For variables in the question and answer choices, sometimes picking a simple number (like 2 or 10) and testing it can be faster than solving the algebra.
- **Use the Formula Sheet:** You are given a reference sheet with common geometry formulas. Know what's on it so you don't waste time trying to memorize them.
- **Pace Yourself:** The questions generally increase in difficulty. Don't get bogged down on a hard question early on. Answer what you know first, and come back to the challenging ones later.

## Time Management
- No-Calculator Section (25 minutes):
  - 5 minutes for first 5 questions
  - 10 minutes for middle 10 questions
  - 10 minutes for last 5 questions

- Calculator Section (55 minutes):
  - 15 minutes for first 15 questions
  - 25 minutes for middle 20 questions
  - 15 minutes for last 5 questions
    `,
  },
  {
    id: 'grammar-rules-essential',
    title: 'Essential Grammar Rules for SAT Writing',
    category: 'Writing',
    difficulty: 'Beginner',
    tags: ['grammar', 'punctuation', 'syntax'],
    summary: 'Master the most commonly tested grammar rules and punctuation patterns on the SAT Writing section.',
    readingTime: 15,
    content: `
# Essential Grammar Rules for SAT Writing

The SAT Writing and Language section tests your knowledge of grammar, punctuation, and style. Here are the most important rules to master.

## Subject-Verb Agreement
The subject and verb must agree in number (singular or plural).

**Rules to Remember:**
- Singular subjects take singular verbs: "The cat runs."
- Plural subjects take plural verbs: "The cats run."
- Watch out for prepositional phrases that separate subjects and verbs: "The box of chocolates is expensive."
- Collective nouns (team, family, group) are usually singular: "The team is winning."

## Pronoun Usage
Pronouns must agree with their antecedents in number and gender.

**Common Errors:**
- "Each student must bring their book" → "Each student must bring his or her book"
- "Neither John nor Mary brought their lunch" → "Neither John nor Mary brought his or her lunch"

## Parallelism
Items in a series must be in the same grammatical form.

**Incorrect:** "I like swimming, running, and to bike."
**Correct:** "I like swimming, running, and biking."

## Comma Rules
1. **Oxford comma:** Use before "and" in a series: "red, white, and blue"
2. **After introductory elements:** "After the game, we went home."
3. **Around non-essential information:** "My brother, who lives in Texas, is visiting."
4. **Between independent clauses:** "I went to the store, and I bought milk."

## Apostrophes
- **Possession:** "John's book" (singular), "Students' books" (plural)
- **Contractions:** "don't" = "do not", "it's" = "it is"
- **Never use with plural nouns:** "Apples are red" (not "Apple's are red")

## Sentence Fragments and Run-ons
- **Fragment:** Missing subject or verb: "Because I was tired." → "I went to bed because I was tired."
- **Run-on:** Two independent clauses without proper punctuation: "I was tired I went to bed." → "I was tired, so I went to bed."

## Modifier Placement
Modifiers must be placed near the words they modify.

**Incorrect:** "Running quickly, the finish line was reached."
**Correct:** "Running quickly, the runner reached the finish line."

## Commonly Confused Words
- **Its vs. It's:** "Its" shows possession, "It's" means "it is"
- **There vs. Their vs. They're:** Location, possession, contraction
- **Your vs. You're:** Possession vs. "you are"
- **Affect vs. Effect:** Verb vs. noun (usually)

## Practice Tips
1. Read the entire sentence before choosing an answer
2. Look for the shortest, clearest option that maintains meaning
3. Trust your ear, but verify with grammar rules
4. Eliminate obviously wrong answers first
    `,
  },
  {
    id: 'vocabulary-building',
    title: 'Building Your SAT Vocabulary',
    category: 'Reading',
    difficulty: 'Intermediate',
    tags: ['vocabulary', 'context clues', 'word roots'],
    summary: 'Strategies for expanding your vocabulary and using context clues to determine word meanings.',
    readingTime: 10,
    content: `
# Building Your SAT Vocabulary

While the SAT no longer tests obscure vocabulary words in isolation, having a strong vocabulary will help you understand complex passages and answer questions more efficiently.

## Context Clues Strategy
The SAT focuses on "words in context" - determining the meaning of words based on how they're used in the passage.

### Types of Context Clues:
1. **Definition:** The word is defined directly in the sentence
2. **Example:** Examples help clarify the word's meaning
3. **Contrast:** The word is contrasted with something familiar
4. **Cause and Effect:** The relationship shows the word's meaning

### Practice Method:
1. Cover the word in question
2. Read the sentence and predict what word would fit
3. Look at the answer choices and find the closest match
4. Plug it back in to verify it makes sense

## High-Frequency SAT Words
Focus on words that appear frequently in academic texts:

### Analysis and Evaluation:
- Assess, evaluate, analyze, critique
- Substantial, significant, considerable
- Viable, feasible, plausible
- Comprehensive, thorough, extensive

### Argument and Persuasion:
- Advocate, endorse, champion
- Refute, contradict, dispute
- Compelling, persuasive, convincing
- Skeptical, dubious, questionable

### Description and Characterization:
- Meticulous, scrupulous, methodical
- Candid, forthright, transparent
- Ambiguous, vague, elusive
- Prudent, judicious, discerning

## Word Roots and Patterns
Learning common roots can help you decode unfamiliar words:

### Latin Roots:
- **Bene-** (good): benefit, benevolent
- **Mal-** (bad): malicious, malfunction
- **Circum-** (around): circumference, circumvent
- **Trans-** (across): transport, translate

### Greek Roots:
- **Bio-** (life): biology, biography
- **Geo-** (earth): geography, geology
- **Photo-** (light): photograph, photosynthesis
- **Tele-** (far): telephone, telescope

## Prefixes and Suffixes
Understanding these can help you break down complex words:

### Common Prefixes:
- **Un-, dis-, in-** (not): unhappy, disagree, incomplete
- **Re-** (again): repeat, review
- **Pre-** (before): preview, prevent
- **Over-** (too much): overeat, overflow

### Common Suffixes:
- **-tion, -sion** (action): creation, decision
- **-ous, -ful** (full of): joyous, helpful
- **-less** (without): hopeless, careless
- **-er, -or** (one who): teacher, actor

## Study Strategies
1. **Read actively:** Pay attention to unfamiliar words in context
2. **Keep a vocabulary journal:** Write down new words with definitions and example sentences
3. **Use flashcards:** Review regularly with spaced repetition
4. **Read challenging material:** Academic articles, quality newspapers, classic literature
5. **Practice with SAT passages:** Use official practice tests to encounter words in context
    `,
  },
  {
    id: 'algebra-foundations',
    title: 'Algebra Foundations for SAT Success',
    category: 'Math',
    difficulty: 'Beginner',
    tags: ['algebra', 'equations', 'inequalities', 'functions'],
    summary: 'Build a solid foundation in algebraic concepts that are essential for SAT Math success.',
    readingTime: 18,
    content: `
# Algebra Foundations for SAT Success

Algebra forms the backbone of the SAT Math section. These fundamental concepts appear throughout the test, so mastering them is crucial for success.

## Linear Equations and Inequalities

### Solving Linear Equations
The goal is to isolate the variable by performing the same operation on both sides.

**Steps:**
1. Distribute and combine like terms
2. Move variables to one side, constants to the other
3. Divide or multiply to isolate the variable

**Example:**
3(x + 2) = 15 - 2x
3x + 6 = 15 - 2x
5x = 9
x = 9/5

### Solving Inequalities
Follow the same steps as equations, but remember to flip the inequality sign when multiplying or dividing by a negative number.

**Example:**
-2x + 5 > 11
-2x > 6
x < -3 (sign flips!)

## Systems of Equations
When you have multiple equations with multiple variables.

### Substitution Method:
1. Solve one equation for one variable
2. Substitute into the other equation
3. Solve for the remaining variable
4. Back-substitute to find the first variable

### Elimination Method:
1. Multiply equations to create opposite coefficients
2. Add or subtract to eliminate one variable
3. Solve for the remaining variable
4. Back-substitute

**Example:**
2x + 3y = 12
x - y = 1

From the second equation: x = y + 1
Substitute: 2(y + 1) + 3y = 12
2y + 2 + 3y = 12
5y = 10
y = 2, x = 3

## Functions
A function is a relationship where each input has exactly one output.

### Function Notation:
f(x) = 2x + 3 means "f of x equals 2x plus 3"
f(2) = 2(2) + 3 = 7

### Key Concepts:
- **Domain:** All possible input values (x-values)
- **Range:** All possible output values (y-values)
- **Intercepts:** Where the graph crosses the axes

### Types of Functions:
1. **Linear:** f(x) = mx + b (straight line)
2. **Quadratic:** f(x) = ax² + bx + c (parabola)
3. **Exponential:** f(x) = a(b)ˣ (growth/decay)

## Quadratic Equations
Equations in the form ax² + bx + c = 0

### Factoring Method:
Find two numbers that multiply to ac and add to b
x² + 5x + 6 = 0
(x + 2)(x + 3) = 0
x = -2 or x = -3

### Quadratic Formula:
x = (-b ± √(b² - 4ac)) / (2a)

### Completing the Square:
Useful for finding vertex form of parabolas
x² + 6x + 5 = 0
x² + 6x + 9 = 4
(x + 3)² = 4
x + 3 = ±2
x = -1 or x = -5

## Absolute Value
|x| represents the distance from zero on the number line.

### Properties:
- |x| ≥ 0 for all real numbers
- |x| = |-x|
- |xy| = |x||y|

### Solving Absolute Value Equations:
|x - 3| = 5
x - 3 = 5 or x - 3 = -5
x = 8 or x = -2

## Exponents and Radicals

### Exponent Rules:
- aᵐ · aⁿ = aᵐ⁺ⁿ
- aᵐ / aⁿ = aᵐ⁻ⁿ
- (aᵐ)ⁿ = aᵐⁿ
- a⁰ = 1 (a ≠ 0)
- a⁻ⁿ = 1/aⁿ

### Radical Rules:
- √(ab) = √a · √b
- √(a/b) = √a / √b
- ⁿ√aᵐ = a^(m/n)

## Word Problems Strategy
1. **Read carefully:** Identify what you're looking for
2. **Define variables:** Let x = what you're solving for
3. **Write equations:** Translate words into math
4. **Solve:** Use algebraic techniques
5. **Check:** Does your answer make sense?

## Common SAT Algebra Patterns
- Rate × Time = Distance
- Principal × Rate × Time = Interest
- Part/Whole = Percent/100
- Mixture problems
- Work rate problems

## Practice Tips
1. **Master basic operations first**
2. **Practice mental math** for simple calculations
3. **Learn to recognize patterns** in problem types
4. **Use substitution** to check your answers
5. **Draw diagrams** when helpful for word problems
    `,
  },
  {
    id: 'geometry-essentials',
    title: 'Geometry Essentials for the SAT',
    category: 'Math',
    difficulty: 'Intermediate',
    tags: ['geometry', 'triangles', 'circles', 'coordinate plane'],
    summary: 'Master key geometric concepts, formulas, and problem-solving strategies for the SAT.',
    readingTime: 20,
    content: `
# Geometry Essentials for the SAT

Geometry questions make up about 10-15% of the SAT Math section. Here are the essential concepts you need to know.

## Basic Angle Relationships

### Types of Angles:
- **Acute:** Less than 90°
- **Right:** Exactly 90°
- **Obtuse:** Between 90° and 180°
- **Straight:** Exactly 180°

### Angle Relationships:
- **Complementary:** Two angles that sum to 90°
- **Supplementary:** Two angles that sum to 180°
- **Vertical:** Opposite angles formed by intersecting lines (equal)

### Parallel Lines and Transversals:
When a transversal crosses parallel lines:
- Corresponding angles are equal
- Alternate interior angles are equal
- Same-side interior angles are supplementary

## Triangles

### Triangle Inequality:
The sum of any two sides must be greater than the third side.

### Angle Sum:
The sum of all angles in a triangle is 180°.

### Types of Triangles:
1. **Equilateral:** All sides and angles equal (60° each)
2. **Isosceles:** Two sides and two angles equal
3. **Scalene:** All sides and angles different
4. **Right:** One 90° angle

### Special Right Triangles:
**45-45-90 Triangle:**
- Sides in ratio 1 : 1 : √2
- If legs = x, hypotenuse = x√2

**30-60-90 Triangle:**
- Sides in ratio 1 : √3 : 2
- If short leg = x, long leg = x√3, hypotenuse = 2x

### Pythagorean Theorem:
a² + b² = c² (where c is the hypotenuse)

### Area Formulas:
- Triangle: A = (1/2)bh
- Right triangle: A = (1/2) × leg₁ × leg₂

## Quadrilaterals

### Properties:
- Sum of interior angles = 360°

### Types:
1. **Rectangle:** Opposite sides equal, all angles 90°
2. **Square:** All sides equal, all angles 90°
3. **Parallelogram:** Opposite sides parallel and equal
4. **Rhombus:** All sides equal, opposite angles equal
5. **Trapezoid:** One pair of parallel sides

### Area Formulas:
- Rectangle/Square: A = lw
- Parallelogram: A = bh
- Trapezoid: A = (1/2)(b₁ + b₂)h

## Circles

### Basic Elements:
- **Radius:** Distance from center to edge
- **Diameter:** Distance across circle through center (2r)
- **Circumference:** Distance around circle = 2πr
- **Area:** A = πr²

### Arcs and Sectors:
- Arc length = (θ/360°) × 2πr
- Sector area = (θ/360°) × πr²

### Circle Equations:
- Standard form: (x - h)² + (y - k)² = r²
- Center at (h, k), radius = r

## Coordinate Geometry

### Distance Formula:
d = √[(x₂ - x₁)² + (y₂ - y₁)²]

### Midpoint Formula:
M = ((x₁ + x₂)/2, (y₁ + y₂)/2)

### Slope Formula:
m = (y₂ - y₁)/(x₂ - x₁)

### Line Equations:
- Slope-intercept: y = mx + b
- Point-slope: y - y₁ = m(x - x₁)

### Parallel and Perpendicular Lines:
- Parallel lines have equal slopes
- Perpendicular lines have slopes that are negative reciprocals

## Volume and Surface Area

### 3D Shapes:
**Rectangular Prism:**
- Volume: V = lwh
- Surface Area: SA = 2(lw + lh + wh)

**Cylinder:**
- Volume: V = πr²h
- Surface Area: SA = 2πr² + 2πrh

**Sphere:**
- Volume: V = (4/3)πr³
- Surface Area: SA = 4πr²

**Cone:**
- Volume: V = (1/3)πr²h
- Surface Area: SA = πr² + πrl (where l is slant height)

**Pyramid:**
- Volume: V = (1/3)Bh (where B is base area)

## Similar Triangles

### Properties:
- Corresponding angles are equal
- Corresponding sides are proportional
- Ratios of areas = (ratio of sides)²

### Methods to Prove Similarity:
1. **AA:** Two angles equal
2. **SAS:** Two sides proportional, included angle equal
3. **SSS:** All three sides proportional

## Trigonometry Basics

### SOH-CAH-TOA:
- sin θ = opposite/hypotenuse
- cos θ = adjacent/hypotenuse
- tan θ = opposite/adjacent

### Unit Circle Values:
Know sine and cosine for 0°, 30°, 45°, 60°, 90°

## Problem-Solving Strategies

1. **Draw diagrams** for all geometry problems
2. **Label known information** on your diagram
3. **Look for special triangles** and their ratios
4. **Use coordinate geometry** when dealing with slopes and distances
5. **Break complex shapes** into simpler ones
6. **Check units** in your final answer

## Common SAT Geometry Traps

1. **Assuming figures are drawn to scale** (they're not always)
2. **Forgetting to use given constraints**
3. **Mixing up radius and diameter**
4. **Using wrong formulas** for area vs. perimeter
5. **Not considering all possible cases**

## Calculator Tips

1. **Store frequently used values** (like π) in memory
2. **Use parentheses** to ensure correct order of operations
3. **Check calculator mode** (degrees vs. radians)
4. **Round only at the end** of calculations
    `,
  },
  {
    id: 'time-management-strategies',
    title: 'Time Management Strategies for SAT Success',
    category: 'Test Strategy',
    difficulty: 'Beginner',
    tags: ['time management', 'pacing', 'strategy'],
    summary: 'Learn how to manage your time effectively during the SAT to maximize your score.',
    readingTime: 12,
    content: `
# Time Management Strategies for SAT Success

Effective time management is crucial for SAT success. Here's how to pace yourself and make the most of your testing time.

## Understanding the Time Constraints

### Reading and Writing Section:
- **Total Time:** 64 minutes
- **Questions:** 54 questions
- **Average per question:** ~1.2 minutes
- **Strategy:** Spend more time reading passages, less time on questions

### Math Section:
- **Total Time:** 70 minutes
- **Questions:** 44 questions
- **Average per question:** ~1.6 minutes
- **Strategy:** Easier questions first, complex ones later

## Pacing Strategies by Section

### Reading Section Pacing:
1. **Passage 1 (11 questions):** 13 minutes
2. **Passage 2 (11 questions):** 13 minutes
3. **Passage 3 (11 questions):** 13 minutes
4. **Passage 4 (11 questions):** 13 minutes
5. **Passage 5 (10 questions):** 12 minutes

**Reading Tips:**
- Spend 3-4 minutes reading each passage
- Answer line reference questions first
- Save main idea questions for last
- Don't get stuck on vocabulary in context

### Writing Section Pacing:
- **4 passages, ~11 questions each**
- **16 minutes per passage** (including reading time)
- **Focus on grammar rules** you know well first
- **Trust your ear** for style and tone questions

### Math Section Pacing:
**Module 1 (22 questions, 35 minutes):**
- Questions 1-15: ~1 minute each
- Questions 16-22: ~2-3 minutes each

**Module 2 (22 questions, 35 minutes):**
- Adjust based on Module 1 difficulty
- More complex questions likely

## The Two-Pass Strategy

### First Pass:
1. **Answer questions you're confident about**
2. **Skip questions that will take too long**
3. **Mark difficult questions** for review
4. **Aim to complete 80% of questions** in 70% of the time

### Second Pass:
1. **Return to skipped questions**
2. **Use elimination strategies**
3. **Make educated guesses**
4. **Focus on questions worth your time**

## Question Prioritization

### Easy Wins:
- Grammar questions with clear rules
- Basic math calculations
- Direct textual evidence questions
- Vocabulary in familiar contexts

### Time Sinks to Avoid:
- Complex reading comprehension requiring re-reading
- Multi-step math problems with extensive calculations
- Questions where you're completely guessing

### Strategic Skipping:
- If you don't understand a question after 30 seconds, mark it and move on
- Return only if you have extra time
- Never leave questions blank (no penalty for guessing)

## Math-Specific Time Management

### Calculator vs. No-Calculator:
**No-Calculator Section (22 questions, 35 minutes):**
- Focus on mental math and estimation
- Look for shortcuts and patterns
- Practice basic arithmetic fluency

**Calculator Section (22 questions, 35 minutes):**
- Use calculator strategically, not for every problem
- Know when mental math is faster
- Double-check complex calculations

### Problem Types by Time Investment:
**Quick (30-60 seconds):**
- Basic algebra
- Simple geometry
- Direct formula applications

**Medium (1-2 minutes):**
- Word problems
- Multi-step equations
- Graph interpretation

**Long (2+ minutes):**
- Complex word problems
- Systems of equations
- Advanced geometry

## Reading Passage Strategy

### Pre-Reading (30 seconds):
- Look at the question types
- Note any line references
- Check for paired passages

### Active Reading (3-4 minutes):
- Read for main ideas, not details
- Note paragraph purposes
- Mark tone and attitude words
- Don't get caught up in unfamiliar topics

### Question Answering (7-8 minutes):
- Start with line reference questions
- Use process of elimination
- Return to passage for evidence
- Save time-consuming questions for last

## Emergency Time Management

### If You're Running Behind:
1. **Focus on easier question types**
2. **Use elimination aggressively**
3. **Guess strategically** (eliminate 2 choices, pick from remaining)
4. **Don't leave any blanks**

### Final 5 Minutes:
1. **Fill in all remaining bubbles**
2. **Check that you've answered every question**
3. **Quickly review flagged questions**
4. **Ensure bubble sheet matches your intended answers**

## Practice Timing Strategies

### During Practice:
1. **Use a timer for every practice session**
2. **Practice the two-pass strategy**
3. **Track your pacing patterns**
4. **Identify your time-consuming question types**

### Timing Checkpoints:
- **Math:** Check time after question 11 and 16
- **Reading:** Check time after each passage
- **Writing:** Check time after every 2 passages

## Day-of-Test Tips

### Before the Test:
- Get a good night's sleep
- Eat a substantial breakfast
- Arrive early to avoid stress

### During Breaks:
- Stand up and stretch
- Take deep breaths
- Don't discuss questions with others
- Stay hydrated

### Mental Strategies:
- Stay calm if you fall behind
- Focus on the current question, not the clock
- Remember: partial credit is better than no credit
- Trust your preparation

## Common Time Management Mistakes

1. **Spending too much time on reading passages**
2. **Getting stuck on one difficult question**
3. **Not using process of elimination**
4. **Panicking when behind schedule**
5. **Leaving questions blank**
6. **Not practicing with time constraints**

## Tools and Techniques

### Watch Management:
- Bring a watch (if phones aren't allowed as timepieces)
- Practice with the same timing tool you'll use on test day

### Bubble Sheet Strategy:
- Fill in answers as you go
- Don't wait until the end to transfer answers
- Use the test booklet for work and mark answers clearly

Remember: Time management is a skill that improves with practice. The more you practice under timed conditions, the more natural these strategies will become.
    `,
  },
  {
    id: 'data-analysis-statistics',
    title: 'Data Analysis and Statistics for SAT Math',
    category: 'Math',
    difficulty: 'Intermediate',
    tags: ['statistics', 'data analysis', 'graphs', 'probability'],
    summary: 'Master data interpretation, statistical concepts, and probability for the SAT Math section.',
    readingTime: 16,
    content: `
# Data Analysis and Statistics for SAT Math

Data analysis questions test your ability to interpret graphs, calculate statistics, and understand probability. These skills are essential for success on the SAT.

## Measures of Central Tendency

### Mean (Average):
Sum of all values divided by the number of values
Mean = (x₁ + x₂ + ... + xₙ) / n

**Properties:**
- Affected by outliers
- Used for symmetric distributions
- Can be non-integer even when all data points are integers

### Median:
The middle value when data is arranged in order
- For odd number of values: middle value
- For even number of values: average of two middle values

**Properties:**
- Not affected by outliers
- Better for skewed distributions
- Always a value that could appear in the dataset

### Mode:
The value that appears most frequently
- A dataset can have no mode, one mode, or multiple modes
- Most useful for categorical data

## Measures of Spread

### Range:
Difference between maximum and minimum values
Range = Max - Min

### Standard Deviation:
Measures how spread out data points are from the mean
- Larger standard deviation = more spread out
- Smaller standard deviation = more clustered around mean
- Used to compare variability between datasets

### Quartiles and Box Plots:
- Q₁ (First Quartile): 25th percentile
- Q₂ (Second Quartile): 50th percentile (median)
- Q₃ (Third Quartile): 75th percentile
- IQR (Interquartile Range): Q₃ - Q₁

## Interpreting Graphs and Charts

### Scatterplots:
Show relationship between two variables

**Key Concepts:**
- **Positive correlation:** As x increases, y increases
- **Negative correlation:** As x increases, y decreases
- **No correlation:** No clear relationship
- **Strong vs. weak:** How closely points follow a pattern

### Line of Best Fit:
- Represents the general trend in a scatterplot
- Used to make predictions
- R² value indicates how well the line fits the data

### Histograms:
Show frequency distribution of a single variable
- X-axis: data values or ranges
- Y-axis: frequency or count
- Shape indicates distribution type (normal, skewed, bimodal)

### Bar Charts:
Compare categorical data
- Categories on one axis
- Values on the other axis
- Bars should not touch (unlike histograms)

## Probability

### Basic Probability:
P(event) = (Number of favorable outcomes) / (Total number of outcomes)

**Properties:**
- 0 ≤ P(event) ≤ 1
- P(certain event) = 1
- P(impossible event) = 0
- P(not A) = 1 - P(A)

### Independent Events:
Events where one outcome doesn't affect the other
P(A and B) = P(A) × P(B)

**Example:** Rolling a die twice
P(6 on first roll and 6 on second roll) = 1/6 × 1/6 = 1/36

### Dependent Events:
Events where one outcome affects the other
P(A and B) = P(A) × P(B|A)

**Example:** Drawing cards without replacement
P(two aces) = 4/52 × 3/51

### Mutually Exclusive Events:
Events that cannot happen at the same time
P(A or B) = P(A) + P(B)

**Example:** Rolling a 3 or a 5 on a die
P(3 or 5) = 1/6 + 1/6 = 1/3

## Sampling and Surveys

### Types of Sampling:
1. **Random sampling:** Every member has equal chance
2. **Stratified sampling:** Population divided into groups
3. **Convenience sampling:** Easiest to reach (often biased)

### Bias in Sampling:
- **Selection bias:** Non-representative sample
- **Response bias:** Questions influence answers
- **Non-response bias:** Certain groups don't respond

### Margin of Error:
Indicates uncertainty in survey results
- Larger sample size = smaller margin of error
- Confidence intervals show range of likely values

## Conditional Probability

### Definition:
P(A|B) = Probability of A given that B has occurred
P(A|B) = P(A and B) / P(B)

### Two-Way Tables:
Organize data for conditional probability problems

|          | Event A | Not A | Total |
|----------|---------|-------|-------|
| Event B  |   a     |   b   | a + b |
| Not B    |   c     |   d   | c + d |
| Total    | a + c   | b + d |   n   |

P(A|B) = a / (a + b)

## Normal Distribution

### Properties:
- Bell-shaped curve
- Symmetric around the mean
- Mean = median = mode

### Empirical Rule (68-95-99.7):
- 68% of data within 1 standard deviation of mean
- 95% of data within 2 standard deviations of mean
- 99.7% of data within 3 standard deviations of mean

### Z-Scores:
Measures how many standard deviations from the mean
z = (x - μ) / σ

## Exponential Growth and Decay

### Growth Formula:
A = P(1 + r)ᵗ
- A = final amount
- P = principal/initial amount
- r = growth rate (as decimal)
- t = time

### Decay Formula:
A = P(1 - r)ᵗ
- Same variables, but r is decay rate

### Half-Life:
Time for quantity to reduce by half
Useful for radioactive decay, medication in bloodstream

## Problem-Solving Strategies

### Reading Data Questions:
1. **Identify what's being asked**
2. **Locate relevant information** in graphs/tables
3. **Check units and scales**
4. **Calculate step by step**
5. **Verify answer makes sense**

### Common Mistakes:
1. **Misreading graph scales**
2. **Confusing correlation with causation**
3. **Using wrong probability formula**
4. **Not accounting for sample size**
5. **Mixing up mean and median**

### Calculator Tips:
1. **Use statistical functions** for mean, standard deviation
2. **Double-check data entry**
3. **Store intermediate results**
4. **Round appropriately** (usually to nearest cent or whole number)

## SAT-Specific Tips

### Question Types:
1. **Direct calculation:** Find mean, median, etc.
2. **Interpretation:** What does the graph show?
3. **Prediction:** Use line of best fit
4. **Comparison:** Which dataset has larger spread?

### Time Management:
- **Read graphs carefully** but don't over-analyze
- **Use elimination** for multiple choice
- **Estimate when exact calculation isn't needed**
- **Check that answer choice makes sense** in context

### Key Formulas to Memorize:
- Mean = sum / count
- Probability = favorable / total
- Growth: A = P(1 + r)ᵗ
- Standard deviation relationship to normal distribution

Remember: Data analysis questions often test reading comprehension as much as math skills. Practice interpreting various types of graphs and charts to build confidence.
    `,
  },
  {
    id: 'essay-writing-guide',
    title: 'SAT Essay Writing Guide (Optional)',
    category: 'Writing',
    difficulty: 'Advanced',
    tags: ['essay', 'analysis', 'rhetoric', 'writing'],
    summary: 'Learn how to analyze rhetorical strategies and write a compelling SAT essay.',
    readingTime: 14,
    content: `
# SAT Essay Writing Guide

*Note: The SAT Essay is optional and not offered at all test dates. Check with your target colleges to see if they require or recommend it.*

## Understanding the Task

### What You're Asked to Do:
- **Read a passage** (650-750 words)
- **Analyze how the author builds an argument**
- **Write an essay** explaining the author's persuasive techniques
- **NOT:** Whether you agree with the author's position

### Time Limit:
50 minutes total
- 10-15 minutes: Reading and planning
- 35-40 minutes: Writing and revising

## The Three Scoring Domains

### 1. Reading (2-8 points):
- Demonstrates comprehension of the source text
- Shows understanding of the author's argument
- Uses relevant and sufficient evidence from the text

### 2. Analysis (2-8 points):
- Identifies and discusses the author's persuasive techniques
- Explains how these techniques build the argument
- Shows understanding of rhetorical strategies

### 3. Writing (2-8 points):
- Clear, coherent essay structure
- Effective introduction, body, and conclusion
- Proper grammar, usage, and mechanics

## Rhetorical Strategies to Look For

### Appeals (Aristotle's Triangle):

**Ethos (Credibility):**
- Author's expertise and qualifications
- Citations of credible sources
- Acknowledgment of counterarguments
- Professional tone and language

**Pathos (Emotional Appeal):**
- Personal anecdotes and stories
- Emotionally charged language
- Vivid imagery and descriptions
- Appeals to shared values

**Logos (Logical Appeal):**
- Statistical evidence and data
- Expert testimony and quotations
- Clear cause-and-effect relationships
- Logical progression of ideas

### Structure and Organization:

**Introduction Techniques:**
- Compelling hook or attention-grabber
- Relevant background information
- Clear thesis statement
- Preview of main arguments

**Body Development:**
- Topic sentences and transitions
- Supporting evidence for each point
- Addressing counterarguments
- Building to strongest points

**Conclusion Strategies:**
- Restating main argument
- Call to action
- Broader implications
- Memorable final thought

### Language and Style:

**Word Choice:**
- Connotative language (positive/negative associations)
- Technical vs. accessible vocabulary
- Metaphors and analogies
- Repetition for emphasis

**Sentence Structure:**
- Varied sentence length for rhythm
- Parallel structure for emphasis
- Rhetorical questions
- Short sentences for impact

## Essay Structure

### Introduction (5-7 sentences):
1. **Context:** Brief summary of the passage's topic
2. **Author and Purpose:** Who wrote it and why
3. **Thesis:** Your analysis of how the author builds the argument
4. **Preview:** Main rhetorical strategies you'll discuss

**Sample Introduction:**
"In her article about climate change policy, Dr. Sarah Johnson argues that immediate government action is essential to prevent environmental catastrophe. Through her strategic use of alarming statistics, personal anecdotes from affected communities, and appeals to shared responsibility, Johnson builds a compelling case that moves readers from concern to action."

### Body Paragraphs (3-4 paragraphs):
Each paragraph should focus on one rhetorical strategy:

**Paragraph Structure:**
1. **Topic sentence:** Identify the strategy
2. **Evidence:** Specific examples from the text
3. **Analysis:** Explain how this strategy works
4. **Effect:** Discuss impact on the reader

**Sample Body Paragraph:**
"Johnson employs startling statistics to establish the urgency of her argument. She notes that 'carbon emissions have increased by 40% in the past decade alone,' immediately quantifying the problem's scope. This data-driven approach appeals to readers' logical thinking while the dramatic percentage creates a sense of crisis. By frontloading her essay with concrete numbers, Johnson establishes credibility and compels readers to take the issue seriously."

### Conclusion (3-5 sentences):
1. **Restate thesis** in different words
2. **Summarize main strategies** discussed
3. **Evaluate effectiveness** of the author's approach
4. **Broader significance** of the rhetorical choices

## Writing Process

### Step 1: Active Reading (10 minutes)
- Read the passage once for understanding
- Read again, marking rhetorical strategies
- Take notes on persuasive techniques
- Identify the author's main argument

### Step 2: Planning (5 minutes)
- Choose 3-4 strongest rhetorical strategies
- Organize them logically (weakest to strongest)
- Write brief outline with specific examples
- Craft your thesis statement

### Step 3: Writing (30 minutes)
- Write introduction with clear thesis
- Develop body paragraphs with analysis
- Use transitions between paragraphs
- Write strong conclusion

### Step 4: Revision (5 minutes)
- Check for clarity and coherence
- Fix obvious grammar/spelling errors
- Ensure you've addressed the prompt
- Add any missing transitions

## Common Mistakes to Avoid

### Content Errors:
1. **Agreeing or disagreeing** with the author
2. **Summarizing** instead of analyzing
3. **Focusing on what** the author says rather than **how**
4. **Using personal opinions** or outside knowledge

### Writing Errors:
1. **Weak or missing thesis** statement
2. **Insufficient evidence** from the text
3. **Poor organization** and transitions
4. **Grammar and mechanics** problems

### Analysis Errors:
1. **Identifying strategies** without explaining their effect
2. **Vague analysis** that could apply to any passage
3. **Repeating the same point** in multiple paragraphs
4. **Failing to connect** strategies to the author's purpose

## Sample Rhetorical Strategies

### Frequently Used Techniques:
- **Anecdotes:** Personal stories that humanize issues
- **Statistics:** Numbers that support claims
- **Expert testimony:** Quotes from authorities
- **Comparisons:** Analogies that clarify complex ideas
- **Repetition:** Key phrases for emphasis
- **Rhetorical questions:** Engage reader thinking
- **Imagery:** Vivid descriptions that evoke emotion
- **Cause and effect:** Logical connections between events

## Scoring Tips

### For High Reading Scores:
- Show deep understanding of the passage
- Use varied and specific evidence
- Demonstrate insight into the author's choices

### For High Analysis Scores:
- Identify sophisticated rhetorical strategies
- Explain clearly how techniques work
- Connect strategies to overall argument

### For High Writing Scores:
- Use varied sentence structure
- Maintain consistent tone and style
- Organize ideas logically with smooth transitions
- Demonstrate command of language

## Practice Recommendations

1. **Read quality arguments:** Editorials, speeches, opinion pieces
2. **Practice identifying** rhetorical strategies in real texts
3. **Time yourself** writing complete essays
4. **Get feedback** on your analysis and writing
5. **Study sample essays** at different score levels

Remember: The SAT Essay tests your ability to read, analyze, and write—not your opinion on the topic. Focus on the author's craft, not the content of their argument.
    `,
  }
]; 