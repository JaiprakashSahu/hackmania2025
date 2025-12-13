const { spawn } = require('child_process');

console.log('Applying database migration...');

const child = spawn('npx', ['drizzle-kit', 'push:pg'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

// Send answers to migration questions
let questionCount = 0;
const answers = [
  '+ description',     // create new column
  '+ duration',        // create new column
  '+ video_urls',      // create new column
  '+ order_index',     // create new column
  '+ updated_at',      // create new column
  '+ category',        // create new column
  '+ difficulty',      // create new column
  '+ duration',        // create new column
  '+ chapter_count',   // create new column
  '+ include_videos',  // create new column
  '+ thumbnail',       // create new column
  '+ topic',           // create new column
  '+ user_description', // create new column
  '+ updated_at',      // create new column
  '+ clerk_id',        // create new column
  '+ first_name',      // create new column
  '+ last_name',       // create new column
  '+ updated_at'       // create new column
];

child.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  // Check if this is a question about column creation
  if (output.includes('?') && (output.includes('column') || output.includes('created or renamed'))) {
    if (questionCount < answers.length) {
      console.log(`\n🤖 Auto-answering: ${answers[questionCount]}`);
      child.stdin.write(answers[questionCount] + '\n');
      questionCount++;
    }
  }
});

child.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

child.on('close', (code) => {
  console.log(`\n✅ Migration completed with exit code: ${code}`);
  if (code === 0) {
    console.log('🎉 Database schema updated successfully!');
  } else {
    console.log('❌ Migration failed. Please check the errors above.');
  }
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping migration...');
  child.kill('SIGINT');
  process.exit(0);
});















