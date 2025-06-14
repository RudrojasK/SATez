// Tutorial system type definitions
export type TutorialType = 'reading' | 'math' | 'vocab' | 'writing' | 'general';
export type TutorialDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type TutorialStatus = 'not-started' | 'in-progress' | 'completed';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'interactive' | 'quiz' | 'example';
  isCompleted: boolean;
  timeSpent?: number;
  hints?: string[];
  resources?: TutorialResource[];
}

export interface TutorialResource {
  id: string;
  title: string;
  type: 'link' | 'document' | 'video' | 'practice';
  url?: string;
  description?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  type: TutorialType;
  difficulty: TutorialDifficulty;
  estimatedTimeMinutes: number;
  status: TutorialStatus;
  steps: TutorialStep[];
  prerequisites?: string[];
  learningObjectives: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completionPercentage: number;
  totalTimeSpent: number;
}

export interface TutorialProgress {
  tutorialId: string;
  userId: string;
  currentStepId: string;
  completedSteps: string[];
  status: TutorialStatus;
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  totalTimeSpent: number;
  notes?: string;
  bookmarked: boolean;
}

export interface TutorialCategory {
  id: string;
  name: string;
  description: string;
  type: TutorialType;
  tutorialIds: string[];
  icon: string;
  color: string;
  order: number;
}

export interface TutorialSession {
  id: string;
  tutorialId: string;
  userId: string;
  stepId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  interactionData?: any;
}

export interface TutorialConfig {
  autoSave: boolean;
  autoAdvance: boolean;
  showHints: boolean;
  showProgress: boolean;
  allowSkipping: boolean;
  trackTime: boolean;
  enableBookmarks: boolean;
  enableNotes: boolean;
}

export interface TutorialFilter {
  type?: TutorialType[];
  difficulty?: TutorialDifficulty[];
  status?: TutorialStatus[];
  tags?: string[];
  searchQuery?: string;
  sortBy?: 'title' | 'difficulty' | 'duration' | 'progress' | 'created';
  sortOrder?: 'asc' | 'desc';
}

export interface TutorialAnalytics {
  tutorialId: string;
  totalViews: number;
  averageCompletionTime: number;
  completionRate: number;
  commonDropOffPoints: string[];
  userFeedback: TutorialFeedback[];
  averageRating: number;
}

export interface TutorialFeedback {
  id: string;
  tutorialId: string;
  userId: string;
  rating: number;
  comment?: string;
  helpful: boolean;
  createdAt: string;
}

// Tutorial navigation types
export type NavigationDirection = 'next' | 'previous' | 'jump';

export interface NavigationState {
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentStepIndex: number;
  totalSteps: number;
  progressPercentage: number;
}

// Interactive tutorial element types
export interface InteractiveElement {
  id: string;
  type: 'highlight' | 'tooltip' | 'popup' | 'overlay' | 'animation';
  trigger: 'click' | 'hover' | 'auto' | 'scroll';
  target: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  duration?: number;
}

export interface TutorialTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    headingSize: number;
    bodySize: number;
    smallSize: number;
    fontFamily: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
} 