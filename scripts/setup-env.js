#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 SATez Environment Setup');
console.log('==========================\n');

const envPath = path.join(__dirname, '..', '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('Please check your existing .env file and ensure it has the correct Supabase credentials.\n');
} else {
  // Create .env template
  const envTemplate = `# Supabase Configuration
# Replace these with your actual Supabase project credentials
# You can find these in your Supabase dashboard under Settings > API

EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Example format:
# EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Groq API Key for AI features
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
`;

  try {
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ Created .env template file');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
  }
}

console.log('📋 Setup Instructions:');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Create a new project or select an existing one');
console.log('3. Go to Settings > API');
console.log('4. Copy the Project URL and anon/public key');
console.log('5. Replace the placeholder values in your .env file');
console.log('6. Run the database migrations: npm run migrate');
console.log('7. Restart your development server\n');

console.log('🔧 Troubleshooting:');
console.log('- Make sure your Supabase project is active');
console.log('- Check that your internet connection is stable');
console.log('- Verify the URL format: https://your-project-ref.supabase.co');
console.log('- Ensure the anon key is copied completely\n');

console.log('📚 Need help? Check the README.md file for detailed setup instructions.'); 