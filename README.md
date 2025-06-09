# SATez - SAT Preparation App

SATez is a comprehensive SAT preparation app that helps students practice vocabulary, reading comprehension, and full-length tests. The app tracks user progress and provides personalized statistics.

## Features

- **Vocabulary Practice**: Learn and test your knowledge of SAT vocabulary words
- **Reading Comprehension**: Practice reading passages and answering questions
- **Progress Tracking**: View your performance statistics and track your improvement
- **User Authentication**: Secure login and registration
- **Data Persistence**: All practice data is saved to the backend

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/aarushk09/SATez.git
   cd SATez
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up the required Supabase tables:
   ```
   node utils/setupSupabaseTables.js
   ```

5. Start the development server:
   ```
   npx expo start
   ```

### Database Setup

The app requires the following tables in your Supabase database:

- `user_profiles`: Stores user profile information
- `vocab_practice_results`: Stores vocabulary practice results
- `reading_practice_results`: Stores reading comprehension results
- `full_length_test_results`: Stores full-length test results

Run the `setupSupabaseTables.js` script to create these tables automatically.

## Usage

1. Register a new account or log in with an existing account
2. Navigate to the Practice tab to start practicing vocabulary or reading comprehension
3. Complete practice sessions to track your progress
4. View your statistics on the Profile page

## Development

### Project Structure

- `app/`: Main application code with file-based routing
  - `(auth)/`: Authentication screens
  - `(tabs)/`: Tab-based navigation screens
- `components/`: Reusable UI components
- `constants/`: App constants like colors and theme
- `data/`: Static data like vocabulary words and reading passages
- `utils/`: Utility functions and API clients

### Environment Variables

The app uses the following environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `GROQ_API_KEY`: (Optional) API key for Groq AI integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the app framework
- [Supabase](https://supabase.io/) for the backend and authentication
- [React Navigation](https://reactnavigation.org/) for navigation
