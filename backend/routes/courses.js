const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

// @route GET /api/courses
router.get('/', async (req, res) => {
  try {
    console.log('Received request for courses');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    console.log(`Fetching courses with limit: ${limit}, skip: ${skip}`);
    
    const totalCourses = await Course.countDocuments();
    console.log(`Total courses in database: ${totalCourses}`);
    
    const courses = await Course.find()
      .populate('educator', 'name')
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Found ${courses.length} courses`);
    
    res.json({
      courses,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
      totalCourses
    });
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

// @route GET /api/courses/enrolled
router.get('/enrolled', protect, async (req, res) => {
  try {
    console.log('Fetching enrolled courses for user:', req.user.id);
    
    // Find courses where the user is in the enrolledStudents array
    const courses = await Course.find({
      'enrolledStudents.student': req.user.id
    })
    .populate('educator', 'name email')
    .select('title description category level price duration imageUrl lessons enrolledStudents')
    .lean();

    console.log(`Found ${courses.length} enrolled courses`);
    
    // Add enrollment info to each course
    const coursesWithEnrollmentInfo = courses.map(course => {
      const enrollment = course.enrolledStudents.find(
        enrollment => enrollment.student.toString() === req.user.id
      );
      
      return {
        ...course,
        enrollmentDate: enrollment?.enrolledAt,
        paymentStatus: enrollment?.paymentStatus,
        progress: enrollment?.progress || 0
      };
    });

    res.json(coursesWithEnrollmentInfo);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching enrolled courses',
      error: error.message 
    });
  }
});

module.exports = router;
