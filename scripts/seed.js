const { query } = require('../lib/config/postgres');

async function seed() {
  try {
    // Optional seeding logic for initial data
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();