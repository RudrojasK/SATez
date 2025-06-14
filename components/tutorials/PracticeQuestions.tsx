import React, { useState } from 'react';
import { Article } from '../../constants/articles';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  section: string;
}

interface PracticeQuestionsProps {
  article: Article;
  onComplete?: (score: number) => void;
}

export const PracticeQuestions: React.FC<PracticeQuestionsProps> = ({
  article,
  onComplete
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Generate questions based on article content
  const generateQuestions = (): Question[] => {
    const questions: Question[] = [];
    const sections = article.content.split('##').slice(1);

    sections.forEach(section => {
      const [title, ...content] = section.split('\n');
      const sectionTitle = title.trim();
      const sectionContent = content.join('\n').trim();

      // Generate questions based on section content
      if (sectionContent.includes('**Pro Tip:**')) {
        questions.push({
          id: `q-${questions.length + 1}`,
          text: `What is the main tip from the "${sectionTitle}" section?`,
          options: [
            sectionContent.split('**Pro Tip:**')[1].split('\n')[0].trim(),
            'None of the above',
            'All of the above',
            'The section does not contain any tips'
          ],
          correctAnswer: 0,
          explanation: 'This tip was highlighted in the section as a Pro Tip.',
          section: sectionTitle
        });
      }

      if (sectionContent.includes('Common Pitfall:')) {
        questions.push({
          id: `q-${questions.length + 1}`,
          text: `What is the common pitfall mentioned in the "${sectionTitle}" section?`,
          options: [
            sectionContent.split('Common Pitfall:')[1].split('\n')[0].trim(),
            'There are no pitfalls mentioned',
            'The section is too complex',
            'The section is too simple'
          ],
          correctAnswer: 0,
          explanation: 'This pitfall was specifically mentioned in the section.',
          section: sectionTitle
        });
      }

      // Add a general understanding question
      questions.push({
        id: `q-${questions.length + 1}`,
        text: `What is the main purpose of the "${sectionTitle}" section?`,
        options: [
          'To explain key concepts',
          'To provide examples',
          'To list common mistakes',
          'To summarize the article'
        ],
        correctAnswer: 0,
        explanation: 'The section focuses on explaining key concepts and strategies.',
        section: sectionTitle
      });
    });

    return questions;
  };

  const questions = generateQuestions();

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      const score = selectedAnswers.reduce((acc, answer, index) => 
        acc + (answer === questions[index].correctAnswer ? 1 : 0), 0
      );
      onComplete?.(score);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((acc, answer, index) => 
      acc + (answer === questions[index].correctAnswer ? 1 : 0), 0
    );
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Practice Results</h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Your Score</span>
            <span className="text-lg font-semibold">{score}/{questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                percentage >= 70 ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {index + 1}
                </span>
                <span className={`text-sm ${
                  selectedAnswers[index] === question.correctAnswer
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {selectedAnswers[index] === question.correctAnswer ? '✓' : '✗'}
                </span>
              </div>
              <p className="text-gray-900 mb-3">{question.text}</p>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-2 rounded ${
                      optionIndex === question.correctAnswer
                        ? 'bg-green-100 border border-green-200'
                        : optionIndex === selectedAnswers[index]
                        ? 'bg-red-100 border border-red-200'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-600">
                {question.explanation}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setShowResults(false);
            setCurrentQuestionIndex(0);
            setSelectedAnswers([]);
          }}
          className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Practice Questions</h3>
        <span className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-900 mb-4">{currentQuestion.text}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-3 text-left rounded-lg transition-colors ${
                selectedAnswers[currentQuestionIndex] === index
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestionIndex] === undefined}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}; 