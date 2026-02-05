require('dotenv').config();
const mongoose = require('mongoose');

console.log('Starting connection test...');
console.log('MONGODB_URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codetunisiepro')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const Test = require('../models/Test');
    const Question = require('../models/Question');
    
    const testCount = await Test.countDocuments();
    const questionCount = await Question.countDocuments();
    
    console.log(`Current tests: ${testCount}`);
    console.log(`Current questions: ${questionCount}`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection error:', err);
    process.exit(1);
  });
