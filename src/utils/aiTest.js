import { testAIConnection, generateSingleQuestion } from '../services/aiService';

// Test AI connection
export const testConnection = async () => {
  try {
    console.log('Testing AI connection...');
    const isConnected = await testAIConnection();
    
    if (isConnected) {
      console.log('✅ AI connection successful');
      return true;
    } else {
      console.log('❌ AI connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ AI connection test error:', error);
    return false;
  }
};

// Test question generation
export const testQuestionGeneration = async (subject = 'Computer Science', topic = 'Data Structures') => {
  try {
    console.log(`Testing question generation for ${subject} - ${topic}...`);
    const question = await generateSingleQuestion(subject, topic, 'multiple-choice');
    
    console.log('✅ Question generated successfully:', question);
    return question;
  } catch (error) {
    console.error('❌ Question generation test error:', error);
    return null;
  }
};

// Run all tests
export const runAITests = async () => {
  console.log('🧪 Running AI Service Tests...\n');
  
  // Test connection
  const connectionTest = await testConnection();
  
  if (connectionTest) {
    // Test question generation
    await testQuestionGeneration();
  }
  
  console.log('\n🧪 AI Service Tests Complete');
}; 