const StudySession = require('../models/StudySession');

// Log a new study session
exports.logSession = async (req, res) => {
  try {
    const { courseId, startTime, endTime, duration, activityType, notes } = req.body;
    const userId = req.user.id;
    const session = new StudySession({
      userId,
      courseId: courseId || null,
      startTime,
      endTime,
      duration,
      activityType,
      notes
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Failed to log study session', error: err.message });
  }
};

// Get all study sessions for a user (optionally by course or date range)
exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, startDate, endDate } = req.query;
    const query = { userId };
    if (courseId) query.courseId = courseId;
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }
    const sessions = await StudySession.find(query).sort({ startTime: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch study sessions', error: err.message });
  }
};

// Delete a study session
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const session = await StudySession.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied: Session does not belong to user' });
    }
    await StudySession.findByIdAndDelete(sessionId);
    res.json({ message: 'Study session deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete study session', error: err.message });
  }
}; 