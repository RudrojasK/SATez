export interface Article {
  id: string;
  title: string;
  category: 'Reading' | 'Writing' | 'Math' | 'General';
  // A brief summary of the article
  summary: string;
  // Full content of the article in Markdown format
  content: string; 
  // Estimated reading time in minutes
  readingTime: number; 
}

export const articles: Article[] = [
  {
    id: 'reading-comprehension-strategies',
    title: '5 Key Strategies for SAT Reading Comprehension',
    category: 'Reading',
    summary: 'Learn how to dissect passages, identify main ideas, and tackle evidence-based questions effectively.',
    readingTime: 8,
    content: `
# 5 Key Strategies for SAT Reading Comprehension

The SAT Reading section tests your ability to understand complex passages and answer questions based on what is stated or implied. Here are five strategies to help you master it.

## 1. Active Reading: Annotate as You Go
Don't just passively read the passage. Engage with the text by underlining key phrases, circling names and dates, and jotting down the main idea of each paragraph in the margin. This keeps you focused and makes it easier to find answers later.

## 2. Identify the Main Idea First
Before diving into the questions, take a moment to summarize the central theme or purpose of the passage. Ask yourself: "What is the author's primary point?" Having a clear grasp of the main idea will help you answer broader questions and put specific details into context.

## 3. Understand Question Types
The SAT uses predictable question types. They can be broadly categorized into:
- **Information and Ideas:** These questions ask you to find a specific piece of information, identify the main idea, or determine the meaning of a word in context.
- **Rhetoric:** These questions focus on the author's craft—how they use words, structure sentences, and build arguments.
- **Synthesis:** These questions often involve analyzing charts or graphs alongside the text or comparing two related passages.

## 4. Tackle "Evidence-Based" Pairs Together
Many questions come in pairs. The first question asks about the passage, and the second asks you to cite the specific lines of text that best support your answer to the first question. A powerful strategy is to evaluate these pairs together. Look at the evidence in the second question first—it can often help you zero in on the correct answer for the first part.

## 5. Don't Let Outside Knowledge Interfere
The SAT is a test of what the passage says, not what you know about a topic. All answers can be found directly in the text or must be logically inferred from it. Avoid making assumptions or using information that isn't provided.
    `,
  },
  {
    id: 'mastering-sat-math',
    title: 'Mastering the SAT Math Section',
    category: 'Math',
    summary: 'A breakdown of the core concepts, from "Heart of Algebra" to "Passport to Advanced Math," with tips for problem-solving.',
    readingTime: 12,
    content: `
# Mastering the SAT Math Section

The SAT Math test covers a range of math practices, with an emphasis on problem solving, modeling, using tools strategically, and using algebraic structure. It's divided into two portions: a no-calculator section and a calculator-allowed section.

## Core Areas of Focus

### 1. Heart of Algebra (Linear Equations)
This is the largest part of the test. You'll need to be an expert in:
- Creating, solving, and interpreting linear equations and inequalities.
- Building linear functions from word problems.
- Understanding the relationship between linear equations and their graphs.

**Tip:** Pay close attention to the wording. "At least" means \`≥\`, and "no more than" means \`≤\`.

### 2. Problem Solving and Data Analysis (Ratios, Proportions, Percentages)
This area tests your quantitative literacy. Be prepared for:
- Ratios, rates, and proportions.
- Percentages and unit conversions.
- Interpreting data from scatterplots, graphs, and tables.
- Calculating mean, median, mode, and standard deviation.

**Tip:** When dealing with graphs, always read the title, axis labels, and units before trying to interpret the data.

### 3. Passport to Advanced Math (Complex Equations)
This section features the kind of math that will be essential for STEM majors. It includes:
- Manipulating more complex equations, like quadratic and exponential expressions.
- Understanding polynomial functions and their graphs.
- Solving problems using function notation.

**Tip:** Practice factoring quadratic equations quickly and accurately. Recognizing patterns like \`(x+y)² = x² + 2xy + y²\` will save you valuable time.

## General Strategies
- **Plug in Numbers:** For variables in the question and answer choices, sometimes picking a simple number (like 2 or 10) and testing it can be faster than solving the algebra.
- **Use the Formula Sheet:** You are given a reference sheet with common geometry formulas. Know what's on it so you don't waste time trying to memorize them.
- **Pace Yourself:** The questions generally increase in difficulty. Don't get bogged down on a hard question early on. Answer what you know first, and come back to the challenging ones later.
    `,
  },
]; 