const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '../migrations');

// Check if migrations directory exists
if (!fs.existsSync(migrationsDir)) {
  console.error('Migrations directory not found');
  process.exit(1);
}

// Get list of migration files
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort(); // Sort to ensure migrations run in the correct order

if (migrationFiles.length === 0) {
  console.log('No migration files found');
  process.exit(0);
}

console.log('Running migrations:');
migrationFiles.forEach(file => console.log(`- ${file}`));

// Import supabase client
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in environment variables');
  console.log('Please ensure you have EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY set in your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Run migrations
async function runMigrations() {
  for (const file of migrationFiles) {
    console.log(`Running migration: ${file}`);
    
    try {
      const migrationContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      // Execute SQL query
      const { data, error } = await supabase.rpc('run_sql', {
        query: migrationContent
      });
      
      if (error) {
        console.error(`Error running migration ${file}:`, error);
        process.exit(1);
      }
      
      console.log(`Successfully ran migration: ${file}`);
    } catch (err) {
      console.error(`Error processing migration ${file}:`, err);
      process.exit(1);
    }
  }
  
  console.log('All migrations completed successfully');
}

runMigrations(); 