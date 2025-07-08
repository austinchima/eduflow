const fs = require('fs');
const path = require('path');
const Material = require('../models/Material');

// POST /api/ai/lesson-feedback
exports.collectLessonFeedback = (req, res) => {
  const { topic, type } = req.body;
  if (!topic || !type) {
    return res.status(400).json({ error: 'Missing topic or type' });
  }
  const feedback = { topic, type, timestamp: Date.now() };
  const feedbackFile = path.join(__dirname, '../tmp/lessonFeedback.json');
  let feedbacks = [];
  try {
    if (fs.existsSync(feedbackFile)) {
      feedbacks = JSON.parse(fs.readFileSync(feedbackFile, 'utf8'));
    }
  } catch (e) {}
  feedbacks.push(feedback);
  try {
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2));
  } catch (e) {
    return res.status(500).json({ error: 'Failed to save feedback' });
  }
  res.json({ success: true });
};

// POST /api/ai/generate-lesson-with-materials
exports.generateLessonWithMaterials = async (req, res) => {
  const { topic, materialIds } = req.body;
  if (!topic || !Array.isArray(materialIds) || materialIds.length === 0) {
    return res.status(400).json({ error: 'Missing topic or materialIds' });
  }
  try {
    // Fetch materials and concatenate their extracted text
    const materials = await Material.find({ _id: { $in: materialIds } });
    const contextText = materials.map(m => m.text || '').join('\n\n');
    const prompt = `Generate a comprehensive educational module on ${topic} using the following course materials as context.\n\nMATERIALS:\n${contextText}\n\n- Cover both basic and advanced concepts, with real-world examples and best practices.\n- Reference official documentation and reputable sources.\n- Embed at least one relevant YouTube video with a summary.\n- Include clear code examples and a hands-on practice task.\n- Suggest further learning resources.\n\nOutput structure:\n1. What You'll Learn\n2. Key Points (bulleted)\n3. Example (code snippet)\n4. Embedded Video (YouTube link + summary)\n5. Practice Task\n6. Further Learning (links)`;
    // Use your existing AI service (e.g., generateAIContent)
    const { generateAIContent } = require('./aiService');
    const lessonContent = await generateAIContent(prompt);
    res.json({ content: lessonContent });
  } catch (err) {
    console.error('Lesson generation error:', err);
    res.status(500).json({ error: 'Failed to generate lesson' });
  }
}; 