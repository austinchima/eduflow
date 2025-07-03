// All Together API code only. No transformers.js or Hugging Face references.

// Helper: Call Together API for text generation
export async function togetherGenerate({ prompt, model = 'mistralai/Mixtral-8x7B-Instruct-v0.1', max_tokens = 512, temperature = 0.7, ...rest }) {
  const payload = {
    prompt,
    model,
    max_tokens,
    temperature,
    ...rest
  };
  const response = await fetch('/api/ai/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('AI backend error: ' + response.statusText);
  const data = await response.json();
  // Together API returns completions in 'output' or 'choices', adapt as needed
  return data.output || data.choices?.[0]?.text || data.result || '';
}

// Generate quiz questions using Together API
export const generateQuizQuestions = async (subject, topic, difficulty = 'medium', questionCount = 5) => {
  const prompt = `Generate ${questionCount} quiz questions for the subject "${subject}" on the topic "${topic}".\n\nRequirements:\n- Difficulty level: ${difficulty}\n- Mix of question types: multiple-choice, multiple-select, and text-input\n- Each question should test understanding of key concepts\n- Include explanations for correct answers\n- Questions should be educational and relevant to the topic\n\nFormat the response as a JSON array.`;
  const text = await togetherGenerate({ prompt });
  let questions;
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      questions = JSON.parse(jsonMatch[0]);
    } else {
      questions = JSON.parse(text);
    }
  } catch (parseError) {
    throw new Error('Failed to parse AI-generated questions: ' + text);
  }
  return questions;
};

// Example: Generate general AI content
export async function generateAIContent(prompt, options = {}) {
  return togetherGenerate({ prompt, ...options });
}

// Generate a single question for testing
export const generateSingleQuestion = async (subject, topic, questionType = 'multiple-choice') => {
  const prompt = `Generate 1 ${questionType} question for the subject "${subject}" on the topic "${topic}".\n\nFormat as JSON:\n{\n  \"id\": \"test_q1\",\n  \"type\": \"${questionType}\",\n  \"text\": \"Question text\",\n  \"points\": 2,\n  \"options\": [\n    {\"id\": \"a\", \"text\": \"Option text\", \"isCorrect\": true/false}\n  ],\n  \"correctAnswer\": \"text for text-input\",\n  \"explanation\": \"Explanation\"\n}`;
  const text = await togetherGenerate({ prompt });
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('Invalid response format');
};

// Test the AI service connection
export const testAIConnection = async () => {
  try {
    const text = await togetherGenerate({ prompt: "Hello, this is a test message." });
    return text.length > 0;
  } catch (error) {
    console.error('AI connection test failed:', error);
    return false;
  }
};

// Helper function to get user's preferred model
const getUserPreferredModel = (user) => {
  if (user?.preferences?.defaultAiModel) {
    return user.preferences.defaultAiModel;
  }
  // Fallback to system default
  return 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free';
};

// Generate detailed course content using AI
export const generateCourseContent = async (courseName, courseOutline = '', sectionCount = 6, user = null) => {
  const prompt = `Generate a detailed course plan for \"${courseName}\".\n\nCourse Outline: ${courseOutline}\n\nInclude:\n- Description\n- Objectives\n- Schedule (at least ${sectionCount} sections)`;
  const text = await togetherGenerate({ prompt });
  let parsed;
  try {
    parsed = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);
  } catch (e) {
    throw new Error('Failed to parse AI-generated course plan');
  }
  return parsed;
};

// Helper: Combine all text from course materials and AI content
export const getCourseCombinedText = (course) => {
  let materialText = '';
  if (Array.isArray(course.materials)) {
    materialText = course.materials.map(m => m.name).join('\n');
  }
  let aiContentText = '';
  if (Array.isArray(course.content)) {
    aiContentText = course.content.map(section => `${section.title}\n${section.explanation}\n${section.keyPoints?.join('\n') || ''}`).join('\n');
  }
  return `${materialText}\n${aiContentText}`.trim();
};

// Generate quiz questions using AI from combined content
export const generateQuizQuestionsFromCourse = async (course, difficulty = 'medium', questionCount = 5, user = null) => {
  const contextText = getCourseCombinedText(course);
  const prompt = `Based on the following course content and materials, generate ${questionCount} quiz questions.\n\n${contextText}\n\nRequirements:\n- Difficulty: ${difficulty}\n- Mix of question types: multiple-choice, multiple-select, text-input\n- Each question should test understanding of key concepts\n- Include explanations for correct answers\n- Format as a JSON array as before.`;
  const aiResponse = await generateAIContent(prompt, user);
  let questions;
  try {
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      questions = JSON.parse(jsonMatch[0]);
    } else {
      questions = JSON.parse(aiResponse);
    }
  } catch (parseError) {
    throw new Error('Failed to parse AI-generated questions');
  }
  return questions;
};

// Generate flashcards using Together API
export const generateFlashcardsFromCourse = async (course, cardCount = 10) => {
  const contextText = getCourseCombinedText(course);
  const prompt = `Based on the following course content and materials, generate ${cardCount} flashcards.\n\n${contextText}\n\nFormat as a JSON array:\n[\n  {\n    \"front\": \"Question or term\",\n    \"back\": \"Answer or explanation\"\n  }\n]`;
  const text = await togetherGenerate({ prompt });
  let cards;
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cards = JSON.parse(jsonMatch[0]);
    } else {
      cards = JSON.parse(text);
    }
  } catch (parseError) {
    throw new Error('Failed to parse AI-generated flashcards: ' + text);
  }
  return cards;
};