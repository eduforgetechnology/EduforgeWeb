const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    
    console.log('Cleared existing data...');

    // Create educators
    const educator1 = await User.create({
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@eduforge.com',
      password: 'password123',
      role: 'educator',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786'
    });

    const educator2 = await User.create({
      name: 'Prof. Michael Rodriguez',
      email: 'michael.rodriguez@eduforge.com',
      password: 'password123',
      role: 'educator',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    });

    const educator3 = await User.create({
      name: 'Dr. Emily Watson',
      email: 'emily.watson@eduforge.com',
      password: 'password123',
      role: 'educator',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    });

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eduforge.com',
      password: 'admin123',
      role: 'admin',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    });

    console.log('Created educators and admin...');

    // Create all 48 courses
    const courses = [
      {
        title: 'Institute_Junior Circuit Explorer - Level 2',
        description: 'Advanced circuit exploration for young innovators. Learn complex circuit designs and electronic principles.',
        price: 599,
        category: 'Institute',
        level: 'Intermediate',
        educator: educator1._id
      },
      {
        title: 'Tech FastTrack: NanoBit Innovation',
        description: 'Fast-paced course on nanotechnology and bit-level computing innovations.',
        price: 699,
        category: 'Tech',
        level: 'Advanced',
        educator: educator2._id
      },
      {
        title: 'School_Autonomous Bots-1-12',
        description: 'Comprehensive robotics course covering autonomous robot design and programming for grades 1-12.',
        price: 799,
        category: 'School',
        level: 'All Levels',
        educator: educator3._id
      },
      {
        title: 'School_Design Studio Basics - 2-12',
        description: 'Foundation course in digital design principles and practices for grades 2-12.',
        price: 499,
        category: 'School',
        level: 'Beginner',
        educator: educator1._id
      },
      {
        title: 'School_Mobile App Creators_12',
        description: 'Learn to create mobile applications from concept to deployment.',
        price: 899,
        category: 'School',
        level: 'Intermediate',
        educator: educator2._id
      },
      {
        title: 'School_RC Engineering Lab-1-12',
        description: 'Hands-on engineering course focused on remote-controlled systems.',
        price: 699,
        category: 'School',
        level: 'All Levels',
        educator: educator3._id
      },
      {
        title: 'Tech Makers: Mini IoT Innovators',
        description: 'Introduction to Internet of Things (IoT) concepts and applications.',
        price: 599,
        category: 'Tech',
        level: 'Beginner',
        educator: educator1._id
      },
      {
        title: 'Institute_Python CodePath Level 2',
        description: 'Advanced Python programming concepts and applications for grades 2-10.',
        price: 799,
        category: 'Institute',
        level: 'Advanced',
        educator: educator2._id
      },
      {
        title: 'School_GameDev with Python_12',
        description: 'Game development fundamentals using Python programming.',
        price: 699,
        category: 'School',
        level: 'Intermediate',
        educator: educator3._id
      },
      {
        title: 'Institute_Python Beginners Path',
        description: 'Start your Python programming journey with fundamental concepts for grades 1-10.',
        price: 499,
        category: 'Institute',
        level: 'Beginner',
        educator: educator1._id
      },
      {
        title: 'Child Safety Awareness',
        description: 'Essential course on child safety and protection measures.',
        price: 299,
        category: 'Safety',
        level: 'All Levels',
        educator: educator2._id
      },
      {
        title: 'School_Automated Makers',
        description: 'Learn to create automated systems for grades 5-12.',
        price: 799,
        category: 'School',
        level: 'Intermediate',
        educator: educator3._id
      },
      {
        title: 'School_Digital Design Playground',
        description: 'Creative course on digital design for grades 1-12.',
        price: 599,
        category: 'School',
        level: 'Beginner',
        educator: educator1._id
      },
      {
        title: 'School_MicroLogic Lab-1-12',
        description: 'Explore microcontroller programming and logic design.',
        price: 699,
        category: 'School',
        level: 'Intermediate',
        educator: educator2._id
      },
      {
        title: 'School_TinyTech Circuits_24',
        description: 'Introduction to basic circuit design and electronics.',
        price: 499,
        category: 'School',
        level: 'Beginner',
        educator: educator3._id
      },
      {
        title: 'School_Automated Engineering',
        description: 'Advanced automation and engineering concepts for grades 7-12.',
        price: 899,
        category: 'School',
        level: 'Advanced',
        educator: educator1._id
      },
      {
        title: 'School_Mechanics Fundamentals',
        description: 'Core principles of mechanical engineering for grades 2-12.',
        price: 699,
        category: 'School',
        level: 'Beginner',
        educator: educator2._id
      },
      {
        title: 'Institute_Autonomous Robotics',
        description: 'Advanced autonomous robotics systems and programming.',
        price: 999,
        category: 'Institute',
        level: 'Advanced',
        educator: educator3._id
      },
      {
        title: 'Institute_Junior Circuit Explorer - Level 1',
        description: 'Introduction to circuit design and electronics basics.',
        price: 499,
        category: 'Institute',
        level: 'Beginner',
        educator: educator1._id
      },
      {
        title: 'CODEAVOUR CHALLENGE',
        description: 'Competitive programming and coding challenges.',
        price: 299,
        category: 'Challenge',
        level: 'All Levels',
        educator: educator2._id
      },
      {
        title: 'Institute_Microcontroller Lab',
        description: 'Hands-on experience with microcontroller programming.',
        price: 799,
        category: 'Institute',
        level: 'Intermediate',
        educator: educator3._id
      },
      {
        title: 'School_Circuit Starters',
        description: 'Beginner-friendly circuit design for grades 1-12.',
        price: 399,
        category: 'School',
        level: 'Beginner',
        educator: educator1._id
      },
      {
        title: 'School_TechBuddies Electronics',
        description: 'Fun and interactive electronics learning.',
        price: 449,
        category: 'School',
        level: 'Beginner',
        educator: educator2._id
      },
      {
        title: 'Institute_AppCrafters Academy 1-12',
        description: 'Comprehensive app development course.',
        price: 899,
        category: 'Institute',
        level: 'Intermediate',
        educator: educator3._id
      },
      {
        title: 'Institute_Python CodePath - Grades 3-10',
        description: 'Python programming pathway for grades 3-10.',
        price: 699,
        category: 'Institute',
        level: 'Intermediate',
        educator: educator1._id
      },
      {
        title: 'Institute_EV3 RoboMakers Essentials_24',
        description: 'LEGO EV3 robotics programming and building.',
        price: 799,
        category: 'Institute',
        level: 'Intermediate',
        educator: educator2._id
      },
      {
        title: 'School_Smart Machines Engineering',
        description: 'Smart machines and engineering for grades 6-12.',
        price: 899,
        category: 'School',
        level: 'Advanced',
        educator: educator3._id
      },
      {
        title: 'Institute_CircuitMasters Advanced V2.0',
        description: 'Advanced circuit design and analysis.',
        price: 999,
        category: 'Institute',
        level: 'Advanced',
        educator: educator1._id
      },
      {
        title: 'Institute_Duplo - Little Engineers_12',
        description: 'Engineering basics with LEGO Duplo.',
        price: 399,
        category: 'Institute',
        level: 'Beginner',
        educator: educator2._id
      },
      {
        title: 'Institute_AppInnovators Studio 2-12',
        description: 'Innovative app development for grades 2-12.',
        price: 799,
        category: 'Institute',
        level: 'Intermediate',
        educator: educator3._id
      },
      {
        title: 'Institute_Scratch ProBuilders',
        description: 'Advanced Scratch programming concepts.',
        price: 599,
        category: 'Institute',
        level: 'Intermediate',
        educator: educator1._id
      },
      {
        title: 'School_Python Visual Programming_1-12',
        description: 'Visual programming with Python for grades 1-12.',
        price: 699,
        category: 'School',
        level: 'Beginner',
        educator: educator2._id
      },
      {
        title: 'School_Smart Data Science-1-12',
        description: 'Introduction to data science concepts.',
        price: 799,
        category: 'School',
        level: 'Intermediate',
        educator: educator3._id
      },
      {
        title: 'School_PlayTech Circuits-1',
        description: 'Playful introduction to circuit design.',
        price: 399,
        category: 'School',
        level: 'Beginner',
        educator: educator1._id
      },
      {
        title: 'School_Machine Makers',
        description: 'Machine building and automation for grades 1-12.',
        price: 699,
        category: 'School',
        level: 'Intermediate',
        educator: educator2._id
      },
      {
        title: 'School_CreativeCode Studio-1-12',
        description: 'Creative coding and digital art.',
        price: 599,
        category: 'School',
        level: 'All Levels',
        educator: educator3._id
      },
      {
        title: 'Institute_Web Creators Academy 2-12',
        description: 'Web development and design fundamentals.',
        price: 799,
        category: 'Institute',
        level: 'Intermediate',
        educator: educator1._id
      },
      {
        title: 'Institute_Web Design Foundations-1-12',
        description: 'Core web design principles and practices.',
        price: 699,
        category: 'Institute',
        level: 'Beginner',
        educator: educator2._id
      },
      {
        title: 'Schools_BotBuilders Workshop',
        description: 'Robot building and programming workshop.',
        price: 899,
        category: 'School',
        level: 'Intermediate',
        educator: educator3._id
      },
      {
        title: 'School_STEM Celebrations & Events',
        description: 'Special STEM events and celebrations.',
        price: 299,
        category: 'School',
        level: 'All Levels',
        educator: educator1._id
      },
      {
        title: 'Institute_Intelligent Systems Lab-1-12',
        description: 'AI and intelligent systems exploration.',
        price: 999,
        category: 'Institute',
        level: 'Advanced',
        educator: educator2._id
      },
      {
        title: 'Institute_Predictive Analytics Lab-2-12',
        description: 'Predictive modeling and analytics.',
        price: 899,
        category: 'Institute',
        level: 'Advanced',
        educator: educator3._id
      },
      {
        title: 'School_Python Essentials-1',
        description: 'Essential Python programming concepts.',
        price: 599,
        category: 'School',
        level: 'Beginner',
        educator: educator1._id
      },
      {
        title: 'Welcome to Innovation Lab',
        description: 'Introduction to innovation and technology.',
        price: 299,
        category: 'Tech',
        level: 'Beginner',
        educator: educator2._id
      },
      {
        title: 'Institute_Scratch Builders',
        description: 'Learn to build with Scratch programming.',
        price: 499,
        category: 'Institute',
        level: 'Beginner',
        educator: educator3._id
      },
      {
        title: 'Tech Discovery: NanoBit Innovators',
        description: 'Technology discovery for grade 4.',
        price: 599,
        category: 'Tech',
        level: 'Beginner',
        educator: educator1._id
      },
      {
        title: 'WSRO_Advanced Robo Rally',
        description: 'Advanced robotics competition training.',
        price: 999,
        category: 'WSRO',
        level: 'Advanced',
        educator: educator2._id
      },
      {
        title: 'School_Powered Constructions_24',
        description: 'Build powered mechanical constructions.',
        price: 799,
        category: 'School',
        level: 'Intermediate',
        educator: educator3._id
      }
    ];

    // Create default lessons for each course
    const defaultLessons = [
      {
        title: 'Course Introduction',
        content: 'Overview of the course curriculum and learning objectives.'
      },
      {
        title: 'Fundamentals',
        content: 'Essential concepts and foundational knowledge.'
      },
      {
        title: 'Hands-on Projects',
        content: 'Practical application through engaging projects.'
      },
      {
        title: 'Advanced Concepts',
        content: 'Deep dive into advanced topics and techniques.'
      },
      {
        title: 'Final Project',
        content: 'Capstone project to demonstrate learned skills.'
      }
    ];

    // Add courses with lessons to database
    for (const course of courses) {
      await Course.create({
        ...course,
        lessons: defaultLessons,
        duration: '12 weeks',
        imageUrl: `https://source.unsplash.com/400x250/?${course.category.toLowerCase()},education`
      });
    }

    console.log('Created all 48 courses...');
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();