// All Gemini API code only. No Together API or Hugging Face references.
// Model used: gemini-2.0-flash

// Helper: Call Together API for text generation
/**
 * togetherGenerate
 * @description Helper function to call Together API for text generation
 * @param {object} options
 * @param {string} options.prompt - The input text to generate text from
 * @returns {Promise<string>}
 */
export async function togetherGenerate({ prompt, ...rest }) {
  const payload = { prompt };
  
  try {
    const response = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'AI backend error: ' + response.statusText);
    }
    
    const data = await response.json();
    
    // Handle the new response format from chat completions
    if (data.output) {
      return data.output;
    } else if (data.choices && data.choices.length > 0) {
      return data.choices[0].message?.content || data.choices[0].text || '';
    } else if (data.result) {
      return data.result;
    } else {
      throw new Error('Unexpected response format from AI service');
    }
  } catch (error) {
    console.error('Together API error:', error);
    throw error;
  }
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
export const generateCourseContent = async (courseName, courseOutline = '', sectionCount = 1, user = null) => {
  const prompt = `For the topic "${courseName}", generate a lesson module including:\n- A module title\n- A summary paragraph\n- An image prompt or description (for an illustration or concept art)\n- 3-5 key concepts, each with a short explanation and a suggested icon (e.g., robot, brain, code)\n- A recommended YouTube video (provide a search query, not a direct link)\n- An interactive example or activity description\nFormat the response as a JSON object with fields: title, summary, imagePrompt, keyConcepts (array of {name, explanation, icon}), video (searchQuery), interactiveExample.`;
  const text = await togetherGenerate({ prompt });
  console.log('AI raw response:', text);
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('AI returned an empty response. Please try again or check your course materials.');
  }
  let parsed;
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON object found in AI response.');
    parsed = JSON.parse(match[0]);
  } catch (e) {
    throw new Error('Failed to parse AI-generated lesson module. Raw response: ' + text);
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
    aiContentText = course.content.map(section => {
      const keyPointsText = section.keyPoints?.map(point => 
        typeof point === 'object' && point.point ? point.point : point
      ).join('\n') || '';
      return `${section.title}\n${section.explanation}\n${keyPointsText}`;
    }).join('\n');
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

// Generate comprehensive course content based on uploaded materials and course context
export const generateCourseContentFromMaterials = async (course, materials = [], user = null) => {
  try {
    // Step 1: Analyze uploaded materials to find course outline
    let courseOutline = '';
    let materialContext = '';
    
    if (materials && materials.length > 0) {
      // Look for files that might contain course outline
      const outlineKeywords = ['outline', 'syllabus', 'schedule', 'curriculum', 'plan', 'overview'];
      const outlineFiles = materials.filter(material => 
        outlineKeywords.some(keyword => 
          material.originalName?.toLowerCase().includes(keyword) ||
          material.description?.toLowerCase().includes(keyword)
        )
      );
      
      // If we found potential outline files, prioritize their content
      if (outlineFiles.length > 0) {
        courseOutline = outlineFiles.map(file => file.text || '').join('\n\n');
        materialContext = materials.map(file => file.text || '').join('\n\n');
      } else {
        // Use all materials as context
        materialContext = materials.map(file => file.text || '').join('\n\n');
      }
    }
    
    // Step 2: Create a comprehensive prompt for content generation
    const prompt = `You are an expert educator creating a comprehensive learning experience for the course "${course.name}".

COURSE CONTEXT:
- Course Name: ${course.name}
- Instructor: ${course.instructor || 'Not specified'}
- Credits: ${course.credits || 'Not specified'}
- Semester: ${course.semester || 'Not specified'}
- Description: ${course.description || 'Not specified'}

${courseOutline ? `COURSE OUTLINE FOUND:
${courseOutline}

` : ''}${materialContext ? `UPLOADED MATERIALS CONTEXT:
${materialContext}

` : ''}TASK: Generate a complete course structure with modules and lessons that:
1. Follows the course outline if provided, or creates a logical progression based on the course name and materials
2. Incorporates relevant information from uploaded materials
3. Includes supplementary content from reputable sources (text explanations, examples, practice activities)
4. Is tailored specifically to the course context (e.g., if it's "C# Programming 1", focus on beginner C# concepts)

REQUIREMENTS:
- Create 3-5 modules with 2-4 lessons each
- Each lesson should be comprehensive and self-contained
- Include practical examples and exercises
- Use simple, clear language suitable for the course level
- Ensure all content is relevant to the specific course topic
- Use proper markdown formatting for better readability

RESPONSE FORMAT: Return ONLY a valid JSON array with this exact structure:
[
  {
    "title": "Module Title",
    "lessons": [
      {
        "title": "Lesson Title",
        "summary": "2-3 sentence summary of what will be learned (use markdown formatting)",
        "keyPoints": [
          "**Key concept 1**: Brief explanation",
          "**Key concept 2**: Brief explanation", 
          "**Key concept 3**: Brief explanation"
        ],
        "example": "Practical example with code blocks and markdown formatting. For programming courses, include syntax-highlighted code blocks like:\n\n\`\`\`csharp\n// Example C# code\npublic class Example {\n    public void DoSomething() {\n        Console.WriteLine(\"Hello World!\");\n    }\n}\n\`\`\`",
        "task": "Practice exercise with clear instructions and markdown formatting. Include code examples where appropriate."
      }
    ]
  }
]

MARKDOWN FORMATTING GUIDELINES:
- Use **bold** for emphasis and important terms
- Use *italic* for definitions and foreign terms
- Use \`inline code\` for code snippets, variables, and technical terms
- Use \`\`\`language\ncode block\n\`\`\` for multi-line code examples
- Use - or * for bullet points
- Use numbered lists for step-by-step instructions
- Use > for important notes or warnings
- Use ### for subsections within examples or tasks

IMPORTANT: 
- Respond with ONLY the JSON array, no other text
- Ensure all content is relevant to "${course.name}"
- Make content engaging and educational
- Include real-world applications where appropriate
- Use proper markdown syntax for code blocks and formatting
- For programming courses, always include syntax-highlighted code examples`;

    console.log('Generating course content with prompt:', prompt);
    
    const text = await togetherGenerate({ prompt });
    console.log('AI raw response:', text);
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('AI returned an empty response. Please try again or check your course materials.');
    }
    
    let parsed;
    try {
      // Try multiple parsing strategies
      let content = null;
      
      // Strategy 1: Direct JSON parse
      try {
        content = JSON.parse(text);
      } catch (e) {
        console.log('Direct parse failed, trying regex extraction');
      }
      
      // Strategy 2: Extract JSON from markdown code blocks
      if (!content) {
        const jsonMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
        if (jsonMatch) {
          content = JSON.parse(jsonMatch[1]);
        }
      }
      
      // Strategy 3: Extract array from text
      if (!content) {
        const arrayMatch = text.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          content = JSON.parse(arrayMatch[0]);
        }
      }
      
      // Strategy 4: Clean up common AI formatting issues
      if (!content) {
        let cleanedOutput = text
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .replace(/^[^{]*/, '') // Remove text before first {
          .replace(/[^}]*$/, '') // Remove text after last }
          .trim();
        
        const match = cleanedOutput.match(/\[[\s\S]*\]/);
        if (match) {
          content = JSON.parse(match[0]);
        }
      }
      
      if (!content) {
        throw new Error('Failed to parse AI response as valid JSON');
      }
      
      parsed = content;
    } catch (e) {
      throw new Error('Failed to parse AI-generated course content. Raw response: ' + text);
    }
    
    // Validate the structure
    if (!Array.isArray(parsed)) {
      throw new Error('AI response is not an array');
    }
    
    // Validate each module has the required structure
    for (let i = 0; i < parsed.length; i++) {
      const module = parsed[i];
      if (!module.title || !Array.isArray(module.lessons)) {
        throw new Error(`Module ${i} missing required fields (title or lessons)`);
      }
      
      for (let j = 0; j < module.lessons.length; j++) {
        const lesson = module.lessons[j];
        if (!lesson.title || !lesson.summary || !Array.isArray(lesson.keyPoints) || !lesson.example || !lesson.task) {
          throw new Error(`Lesson ${j} in module ${i} missing required fields`);
        }
      }
    }
    
    return parsed;
  } catch (error) {
    console.error('Error generating course content from materials:', error);
    throw error;
  }
};

// Generate a substantial AI lesson module for a given topic
export async function generateLessonModule(topic) {
  const prompt = `Generate a comprehensive educational module on ${topic}.
- Cover both basic and advanced concepts, with real-world examples and best practices.
- Reference official documentation and reputable sources.
- Embed at least one relevant YouTube video with a summary.
- Include clear code examples and a hands-on practice task.
- Suggest further learning resources.

Output structure:
1. What You'll Learn
2. Key Points (bulleted)
3. Example (code snippet)
4. Embedded Video (YouTube link + summary)
5. Practice Task
6. Further Learning (links)`;
  return generateAIContent(prompt);
}