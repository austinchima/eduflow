const express = require('express');
const router = express.Router();
const axios = require('axios');
const aiController = require('../controllers/aiController');
require('dotenv').config();

// Rate limiting configuration
const rateLimit = {
  requests: [],
  maxRequests: 10,
  windowMs: 60000, // 1 minute
  cleanupInterval: 60000 // Clean up old requests every minute
};

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  rateLimit.requests = rateLimit.requests.filter(time => now - time < rateLimit.windowMs);
}, rateLimit.cleanupInterval);

// Check rate limit
const checkRateLimit = () => {
  const now = Date.now();
  rateLimit.requests = rateLimit.requests.filter(time => now - time < rateLimit.windowMs);
  
  if (rateLimit.requests.length >= rateLimit.maxRequests) {
    return false;
  }
  
  rateLimit.requests.push(now);
  return true;
};

// Simple content generation without web search
const generateContent = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again in a minute.');
  }

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    },
    {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    }
  );

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

// Simplified JSON parsing with better error handling
const parseAIResponse = (output) => {
  if (!output || typeof output !== 'string') {
    throw new Error('Invalid AI response format');
  }

  let content = null;
  let parseError = null;

  // Strategy 1: Direct JSON parse
  try {
    content = JSON.parse(output.trim());
    if (Array.isArray(content)) {
      return content;
    }
  } catch (e) {
    parseError = e;
  }

  // Strategy 2: Extract JSON array from text
  try {
    const arrayMatch = output.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      content = JSON.parse(arrayMatch[0]);
      if (Array.isArray(content)) {
        return content;
      }
    }
  } catch (e) {
    parseError = e;
  }

  // Strategy 3: Clean up markdown formatting
  try {
    let cleanedOutput = output
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    const arrayMatch = cleanedOutput.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      content = JSON.parse(arrayMatch[0]);
      if (Array.isArray(content)) {
        return content;
      }
    }
  } catch (e) {
    parseError = e;
  }

  throw new Error(`Failed to parse AI response: ${parseError?.message || 'Unknown error'}`);
};

// Validate course content structure
const validateCourseContent = (content) => {
  if (!Array.isArray(content) || content.length === 0) {
    throw new Error('Content must be a non-empty array');
  }

  for (let i = 0; i < content.length; i++) {
    const module = content[i];
    if (!module.title || typeof module.title !== 'string') {
      throw new Error(`Module ${i} must have a valid title`);
    }
    if (!Array.isArray(module.lessons) || module.lessons.length === 0) {
      throw new Error(`Module ${i} must have at least one lesson`);
    }

    for (let j = 0; j < module.lessons.length; j++) {
      const lesson = module.lessons[j];
      const requiredFields = ['title', 'summary', 'keyPoints', 'example', 'task'];
      
      for (const field of requiredFields) {
        if (!lesson[field]) {
          throw new Error(`Lesson ${j} in module ${i} missing required field: ${field}`);
        }
      }

      if (!Array.isArray(lesson.keyPoints) || lesson.keyPoints.length === 0) {
        throw new Error(`Lesson ${j} in module ${i} must have at least one key point`);
      }
    }
  }

  return true;
};

// POST /api/ai/ask - Simple AI chat endpoint
router.post('/ask', async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    const output = await generateContent(prompt);
    res.json({ output });
  } catch (err) {
    console.error('AI ask error:', err.message);
    
    let errorMessage = 'AI service error';
    if (err.message.includes('API key')) {
      errorMessage = 'AI service not configured. Please check your environment setup.';
    } else if (err.message.includes('Rate limit')) {
      errorMessage = 'Too many requests. Please wait a minute and try again.';
    } else if (err.message.includes('timeout')) {
      errorMessage = 'Request timed out. Please try again.';
    }
    
    res.status(500).json({ message: errorMessage });
  }
});

// GET /api/ai/status - Check AI service status
router.get('/status', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'AI service not configured' 
      });
    }

    const output = await generateContent('ping');
    if (output && output.toLowerCase().includes('ping')) {
      return res.json({ status: 'ok' });
    }
    
    return res.json({ status: 'ok' });
  } catch (err) {
    console.error('AI status check error:', err.message);
    return res.status(500).json({ 
      status: 'error', 
      message: 'AI service unavailable' 
    });
  }
});

// POST /api/ai/generate-course-content - Generate course content
router.post('/generate-course-content', async (req, res) => {
  const { topic, materialText = '' } = req.body;
  
  if (!topic) {
    return res.status(400).json({ message: 'Topic is required' });
  }

  try {
    // Simplified prompt for more reliable JSON generation
    let prompt = `Generate a course outline for "${topic}" in this exact JSON format:

[
  {
    "title": "Module Title",
    "lessons": [
      {
        "title": "Lesson Title",
        "summary": "Brief summary of what will be learned",
        "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
        "example": "A practical example or activity",
        "task": "A simple practice task"
      }
    ]
  }
]

Requirements:
- Create 2-3 modules with 2-3 lessons each
- Use simple, beginner-friendly language
- Focus on practical learning
- Return ONLY the JSON array, no other text
- Ensure all strings are properly escaped for JSON`;

    if (materialText && materialText.trim().length > 0) {
      prompt += `\n\nReference material: ${materialText.substring(0, 1000)}`;
    }

    const output = await generateContent(prompt);
    console.log('AI response received, length:', output.length);

    const content = parseAIResponse(output);
    validateCourseContent(content);

    console.log('Course content generated successfully:', content.length, 'modules');
    res.json({ content });

  } catch (err) {
    console.error('Course content generation error:', err.message);
    
    let errorMessage = 'Failed to generate course content';
    if (err.message.includes('parse')) {
      errorMessage = 'AI returned invalid format. Please try again.';
    } else if (err.message.includes('validate')) {
      errorMessage = 'Generated content is incomplete. Please try again.';
    } else if (err.message.includes('Rate limit')) {
      errorMessage = 'Too many requests. Please wait a minute and try again.';
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: err.message 
    });
  }
});

// POST /api/ai/generate-course-content-from-materials - Generate from uploaded materials
router.post('/generate-course-content-from-materials', async (req, res) => {
  const { course, materials = [] } = req.body;
  
  if (!course || !course.name) {
    return res.status(400).json({ message: 'Course information is required' });
  }

  try {
    // Extract relevant content from materials
    let materialContext = '';
    if (materials && materials.length > 0) {
      const materialTexts = materials
        .map(material => material.text || '')
        .filter(text => text.trim().length > 0)
        .join('\n\n');
      
      materialContext = materialTexts.substring(0, 2000); // Limit context size
    }

    // Create focused prompt
    let prompt = `Create a comprehensive course structure for "${course.name}" in this exact JSON format:

[
  {
    "title": "Module Title",
    "lessons": [
      {
        "title": "Lesson Title",
        "summary": "Brief summary of what will be learned",
        "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
        "example": "A practical example or activity",
        "task": "A simple practice task"
      }
    ]
  }
]

Course Details:
- Name: ${course.name}
- Instructor: ${course.instructor || 'Not specified'}
- Credits: ${course.credits || 'Not specified'}
- Semester: ${course.semester || 'Not specified'}
- Description: ${course.description || 'Not specified'}

Requirements:
- Create 3-4 modules with 2-4 lessons each
- Tailor content specifically to "${course.name}"
- Use current best practices and modern approaches
- Include practical examples and exercises
- Return ONLY the JSON array, no other text
- Ensure all strings are properly escaped for JSON`;

    if (materialContext) {
      prompt += `\n\nCourse Materials Context:\n${materialContext}`;
    }

    const output = await generateContent(prompt);
    console.log('AI response received for materials-based generation, length:', output.length);

    const content = parseAIResponse(output);
    validateCourseContent(content);

    console.log('Course content generated from materials successfully:', content.length, 'modules');
    res.json({ 
      message: 'Course content generated successfully',
      content: content
    });

  } catch (err) {
    console.error('Materials-based course generation error:', err.message);
    
    let errorMessage = 'Failed to generate course content from materials';
    if (err.message.includes('parse')) {
      errorMessage = 'AI returned invalid format. Please try again.';
    } else if (err.message.includes('validate')) {
      errorMessage = 'Generated content is incomplete. Please try again.';
    } else if (err.message.includes('Rate limit')) {
      errorMessage = 'Too many requests. Please wait a minute and try again.';
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: err.message 
    });
  }
});

// Generate lesson with selected materials
router.post('/generate-lesson-with-materials', aiController.generateLessonWithMaterials);

// Collect lesson feedback
router.post('/lesson-feedback', aiController.collectLessonFeedback);

module.exports = router;

