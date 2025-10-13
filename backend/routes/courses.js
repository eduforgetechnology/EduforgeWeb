const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

// @route GET /api/courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('educator', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/courses/enrolled
router.get('/enrolled', protect, async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user._id }).populate('educator', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('educator', 'name').populate('students', 'name');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/courses (for educators)
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'educator') {
    return res.status(403).json({ message: 'Only educators can create courses' });
  }

  const { title, description, lessons } = req.body;

  try {
    const course = await Course.create({ title, description, educator: req.user._id, lessons });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/courses/:id/enroll
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.students.includes(req.user._id)) return res.status(400).json({ message: 'Already enrolled' });
    course.students.push(req.user._id);
    await course.save();
    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
