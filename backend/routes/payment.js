const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../models/Course');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/payment/create-order
// @desc    Create a new payment order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === userId
    );
    
    if (isEnrolled) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Create Razorpay order
    const options = {
      amount: course.price * 100, // Amount in paise (multiply by 100)
      currency: 'INR',
      receipt: `course_${courseId}_${userId}_${Date.now()}`,
      notes: {
        courseId: courseId,
        userId: userId,
        courseName: course.title
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      course: {
        id: course._id,
        title: course.title,
        price: course.price
      }
    });

  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating payment order',
      error: error.message 
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify payment and enroll user in course
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      courseId 
    } = req.body;
    
    const userId = req.user.id;

    // Skip signature verification for free enrollments
    if (razorpay_order_id !== 'free_enrollment') {
      // Verify payment signature for paid courses
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid payment signature' 
        });
      }
    }

    // Get course and user
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course or user not found' 
      });
    }

    // Check if already enrolled (double-check)
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === userId
    );
    
    if (isEnrolled) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already enrolled in this course' 
      });
    }

    // Enroll user in course
    course.enrolledStudents.push({
      student: userId,
      enrolledAt: new Date(),
      paymentId: razorpay_payment_id,
      paymentStatus: 'completed',
      progress: 0
    });

    // Update total students count
    course.totalStudents = course.enrolledStudents.length;
    
    await course.save();

    // Populate the course data for response
    await course.populate('enrolledStudents.student', 'name email');

    res.status(200).json({
      success: true,
      message: 'Payment verified and enrollment completed successfully',
      enrollment: {
        courseId: course._id,
        courseTitle: course.title,
        studentName: user.name,
        enrolledAt: new Date(),
        paymentId: razorpay_payment_id
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying payment',
      error: error.message 
    });
  }
});

// @route   GET /api/payment/enrolled-courses
// @desc    Get all enrolled courses for a user
// @access  Private
router.get('/enrolled-courses', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const enrolledCourses = await Course.find({
      'enrolledStudents.student': userId,
      'enrolledStudents.paymentStatus': 'completed'
    }).populate('educator', 'name email');

    // Filter and format the response to include only relevant enrollment data
    const coursesWithEnrollmentInfo = enrolledCourses.map(course => {
      const userEnrollment = course.enrolledStudents.find(
        enrollment => enrollment.student.toString() === userId
      );

      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        gradeRange: course.gradeRange,
        duration: course.duration,
        imageUrl: course.imageUrl,
        educator: course.educator,
        lessons: course.lessons,
        enrolledAt: userEnrollment.enrolledAt,
        progress: userEnrollment.progress,
        paymentId: userEnrollment.paymentId
      };
    });

    res.status(200).json({
      success: true,
      enrolledCourses: coursesWithEnrollmentInfo
    });

  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching enrolled courses',
      error: error.message 
    });
  }
});

// @route   POST /api/payment/update-progress
// @desc    Update course progress for enrolled student
// @access  Private
router.post('/update-progress', protect, async (req, res) => {
  try {
    const { courseId, progress } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find user's enrollment
    const enrollmentIndex = course.enrolledStudents.findIndex(
      enrollment => enrollment.student.toString() === userId && 
                   enrollment.paymentStatus === 'completed'
    );

    if (enrollmentIndex === -1) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }

    // Update progress
    course.enrolledStudents[enrollmentIndex].progress = Math.min(Math.max(progress, 0), 100);
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      progress: course.enrolledStudents[enrollmentIndex].progress
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating progress',
      error: error.message 
    });
  }
});

module.exports = router;