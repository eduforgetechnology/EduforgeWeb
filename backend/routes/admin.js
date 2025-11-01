const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Course = require('../models/Course');
const User = require('../models/User');
const { adminOnly } = require('../middleware/adminAuth');
const s3Service = require('../services/s3Service');

// Configure multer storage
const uploadDir = path.join(__dirname, '..', 'uploads');
// Only create directory if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (error) {
    // Could not create uploads directory, using memory storage in production
  }
}

// Use memory storage in production (Vercel), disk storage in development
const storage = process.env.NODE_ENV === 'production' 
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  // Allow videos, presentations, PDFs, and images
  const allowedTypes = [
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm',
    'application/pdf', 'application/vnd.ms-powerpoint', 
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only videos, PDFs, PowerPoint presentations, and images are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  }
});

// @route   POST /api/admin/courses
// @desc    Create a new course (Admin only)
// @access  Private (Admin)
router.post('/courses', adminOnly, async (req, res) => {
  try {
    // Check if user is admin/educator
    if (req.user.role !== 'admin' && req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Access denied. Admin or Educator role required.' });
    }

    const {
      title,
      description,
      category,
      level,
      gradeRange,
      price,
      duration,
      imageUrl
    } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      level,
      gradeRange,
      price: parseFloat(price) || 0,
      duration,
      imageUrl,
      educator: req.user.id,
      lessons: []
    });

    await course.populate('educator', 'name email');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });

  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating course',
      error: error.message 
    });
  }
});

// @route   PUT /api/admin/courses/:id
// @desc    Update a course (Admin only)
// @access  Private (Admin)
router.put('/courses/:id', adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, price: parseFloat(req.body.price) || course.price },
      { new: true, runValidators: true }
    ).populate('educator', 'name email');

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });

  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating course',
      error: error.message 
    });
  }
});

// @route   DELETE /api/admin/courses/:id
// @desc    Delete a course (Admin only)
// @access  Private (Admin)
router.delete('/courses/:id', adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting course',
      error: error.message 
    });
  }
});

// @route   POST /api/admin/courses/:id/lessons
// @desc    Add a lesson to a course
// @access  Private (Admin)
router.post('/courses/:id/lessons', adminOnly, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'ppt', maxCount: 1 }
]), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    const { title, content, duration, order } = req.body;

    const newLesson = {
      title,
      content,
      duration: parseInt(duration) || 30,
      order: parseInt(order) || course.lessons.length + 1
    };

    // Handle video file upload with S3
    if (req.files && req.files.video) {
      const videoFile = req.files.video[0];
      
      try {
        // Check if S3 service is available
        if (s3Service.uploadFile) {
          // Handle both memory storage (production) and disk storage (development)
          const fileBuffer = videoFile.buffer || fs.readFileSync(videoFile.path);
          const uploadResult = await s3Service.uploadFile(
            fileBuffer,
            `${course.title}-${title}-video-${videoFile.originalname}`,
            videoFile.mimetype
          );
          
          newLesson.videoUrl = uploadResult.url;
          newLesson.videoEmbedUrl = uploadResult.url;
          newLesson.videoFileId = uploadResult.key;
          
          // Clean up temporary file (only in development where file.path exists)
          if (videoFile.path) {
            fs.unlinkSync(videoFile.path);
          }
        } else {
          // Fallback to local storage
          newLesson.videoUrl = `/uploads/${videoFile.filename}`;
        }
      } catch (error) {
        // Fallback to local storage
        newLesson.videoUrl = `/uploads/${videoFile.filename}`;
      }
    }

    // Handle PPT file upload with S3
    if (req.files && req.files.ppt) {
      const pptFile = req.files.ppt[0];
      
      try {
        // Check if S3 service is available
        if (s3Service.uploadFile) {
          // Handle both memory storage (production) and disk storage (development)
          const fileBuffer = pptFile.buffer || fs.readFileSync(pptFile.path);
          const uploadResult = await s3Service.uploadFile(
            fileBuffer,
            `${course.title}-${title}-ppt-${pptFile.originalname}`,
            pptFile.mimetype
          );
          
          newLesson.pptUrl = uploadResult.url;
          newLesson.pptEmbedUrl = `https://docs.google.com/gview?url=${encodeURIComponent(uploadResult.url)}&embedded=true`;
          newLesson.pptFileId = uploadResult.key;
          
          // Clean up temporary file (only in development where file.path exists)
          if (pptFile.path) {
            fs.unlinkSync(pptFile.path);
          }
        } else {
          // Fallback to local storage
          newLesson.pptUrl = `/uploads/${pptFile.filename}`;
        }
      } catch (error) {
        // Fallback to local storage
        newLesson.pptUrl = `/uploads/${pptFile.filename}`;
      }
    }

    course.lessons.push(newLesson);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Lesson added successfully',
      lesson: course.lessons[course.lessons.length - 1]
    });

  } catch (error) {
    console.error('Error adding lesson:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding lesson',
      error: error.message 
    });
  }
});

// @route   PUT /api/admin/courses/:courseId/lessons/:lessonId
// @desc    Update a lesson
// @access  Private (Admin)
router.put('/courses/:courseId/lessons/:lessonId', adminOnly, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Access denied. Admin or Educator role required.' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.educator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only edit your own courses.' });
    }

    const lessonIndex = course.lessons.findIndex(
      lesson => lesson._id.toString() === req.params.lessonId
    );

    if (lessonIndex === -1) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Update lesson fields
    const { title, content, videoUrl, pptUrl, duration, order } = req.body;
    
    course.lessons[lessonIndex] = {
      ...course.lessons[lessonIndex].toObject(),
      title: title || course.lessons[lessonIndex].title,
      content: content || course.lessons[lessonIndex].content,
      videoUrl: videoUrl || course.lessons[lessonIndex].videoUrl,
      pptUrl: pptUrl || course.lessons[lessonIndex].pptUrl,
      duration: parseInt(duration) || course.lessons[lessonIndex].duration,
      order: parseInt(order) || course.lessons[lessonIndex].order
    };

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      lesson: course.lessons[lessonIndex]
    });

  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating lesson',
      error: error.message 
    });
  }
});

// @route   POST /api/admin/upload
// @desc    Upload course content files (video/PPT) to S3
// @access  Private (Admin)
router.post('/upload', adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Access denied. Admin or Educator role required.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let fileUrl = `/uploads/${req.file.filename}`;
    let embedUrl = null;
    let fileId = null;

    // Try to upload to S3
    try {
      if (s3Service.uploadFile) {
        // Handle both memory storage (production) and disk storage (development)
        const fileBuffer = req.file.buffer || fs.readFileSync(req.file.path);
        const uploadResult = await s3Service.uploadFile(
          fileBuffer,
          `course-content-${req.file.originalname}`,
          req.file.mimetype
        );
        
        fileUrl = uploadResult.url;
        embedUrl = req.file.mimetype.includes('presentation') || req.file.mimetype.includes('powerpoint') ?
          `https://docs.google.com/gview?url=${encodeURIComponent(uploadResult.url)}&embedded=true` :
          uploadResult.url;
        fileId = uploadResult.key;
        
        // Clean up temporary file (only in development where file.path exists)
        if (req.file.path) {
          fs.unlinkSync(req.file.path);
        }
      }
    } catch (s3Error) {
      // Keep the local file URL as fallback
    }

    res.status(200).json({
      success: true,
      message: fileId ? 
        'File uploaded successfully to S3' : 
        'File uploaded successfully to local storage',
      fileUrl,
      embedUrl,
      fileId,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      cloudStorage: !!fileId
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading file',
      error: error.message 
    });
  }
});

// @route   GET /api/admin/courses
// @desc    Get all courses for admin management
// @access  Private (Admin)
router.get('/courses', adminOnly, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Access denied. Admin or Educator role required.' });
    }

    // Admin can see all courses, educators only see their own
    const query = req.user.role === 'admin' ? {} : { educator: req.user.id };
    const courses = await Course.find(query)
      .populate('educator', 'name email')
      .populate('enrolledStudents.student', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching courses',
      error: error.message 
    });
  }
});

// @route   GET /api/admin/dashboard-stats
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard-stats', adminOnly, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'educator') {
      return res.status(403).json({ message: 'Access denied. Admin or Educator role required.' });
    }

    // Admin can see stats for all courses, educators only see their own
    const query = req.user.role === 'admin' ? {} : { educator: req.user.id };
    const totalCourses = await Course.countDocuments(query);
    
    const courses = await Course.find(query);
    const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0);
    const totalRevenue = courses.reduce((sum, course) => {
      const courseRevenue = course.enrolledStudents
        .filter(enrollment => enrollment.paymentStatus === 'completed')
        .length * course.price;
      return sum + courseRevenue;
    }, 0);

    // Get total educators count (admin can see all, educators see 1)
    const totalEducators = req.user.role === 'admin' 
      ? await User.countDocuments({ role: { $in: ['admin', 'educator'] } })
      : 1;

    const recentEnrollments = courses
      .flatMap(course => 
        course.enrolledStudents.map(enrollment => ({
          courseName: course.title,
          studentName: enrollment.student?.name || 'Unknown',
          enrolledAt: enrollment.enrolledAt,
          amount: course.price
        }))
      )
      .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
      .slice(0, 10);

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalEducators,
        totalRevenue,
        recentEnrollments
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard stats',
      error: error.message 
    });
  }
});

module.exports = router;