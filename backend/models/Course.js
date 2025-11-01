const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true // Add index for faster title searches
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Institute', 'School', 'Tech', 'WSRO', 'Safety', 'Challenge'],
    default: 'Institute',
    index: true // Add index for faster category filtering
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'All Levels'
  },
  gradeRange: {
    type: String,
    default: '1-12'
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  duration: {
    type: String,
    default: '6 weeks'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  educator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessons: [{
    title: String,
    content: String,
    videoUrl: String, // AWS S3 URL for video file
    videoKey: String,  // AWS S3 key for video file
    pptUrl: String,    // AWS S3 URL for PPT file
    pptKey: String,    // AWS S3 key for PPT file
    duration: {
      type: Number,
      default: 30 // minutes
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    paymentId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    progress: {
      type: Number,
      default: 0 // percentage
    }
  }],
  rating: {
    type: Number,
    default: 4.5
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
