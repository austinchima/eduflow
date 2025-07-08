require('@dotenvx/dotenvx').config();
const axios = require('axios');

async function testTogetherAPI() {
  console.log('🧪 Testing Together API Connection...\n');
  
  // Check if API key is configured
  if (!process.env.TOGETHER_API_KEY) {
    console.error('❌ TOGETHER_API_KEY not found in environment variables');
    console.log('💡 Please add your Together API key to your .env file:');
    console.log('   TOGETHER_API_KEY=your_api_key_here');
    return;
  }
  
  console.log('✅ API key found in environment variables');
  console.log('🔑 Key starts with:', process.env.TOGETHER_API_KEY.substring(0, 8) + '...');
  
  try {
    console.log('\n📡 Testing API connection...');
    
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
        messages: [
          {
            role: 'user',
            content: 'Hello! Please respond with "API connection successful" if you can see this message.'
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ API connection successful!');
    console.log('🤖 Response:', response.data.choices[0].message.content);
    console.log('📊 Usage:', response.data.usage);
    
    // Test different models
    console.log('\n🔍 Testing available models...');
    const models = [
      'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
      'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
      'togethercomputer/llama-2-70b-chat'
    ];
    
    for (const model of models) {
      try {
        console.log(`\n📝 Testing model: ${model}`);
        const modelResponse = await axios.post(
          'https://api.together.xyz/v1/chat/completions',
          {
            model,
            messages: [
              {
                role: 'user',
                content: 'Say "Model works"'
              }
            ],
            max_tokens: 20,
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(`✅ ${model} - Works!`);
      } catch (error) {
        console.log(`❌ ${model} - ${error.response?.data?.error?.message || error.message}`);
      }
    }
    
  } catch (error) {
    console.error('\n❌ API connection failed:');
    if (error.response?.status === 401) {
      console.error('🔐 Authentication failed - Invalid API key');
      console.log('💡 Please check your TOGETHER_API_KEY in the .env file');
    } else if (error.response?.status === 429) {
      console.error('⏰ Rate limit exceeded');
    } else if (error.response?.data) {
      console.error('📄 Error details:', error.response.data);
    } else {
      console.error('🌐 Network error:', error.message);
    }
  }
}

// Run the test
testTogetherAPI(); 