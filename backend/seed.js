const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    // Create sample users
    const educator = await User.create({
      name: 'John Doe',
      email: 'educator@example.com',
      password: 'password123',
      role: 'educator',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    });
    const educator2 = await User.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
      role: 'educator',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    });
    const student = await User.create({
      name: 'Jane Smith',
      email: 'student@example.com',
      password: 'password123',
      role: 'student',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    });

    // Create sample courses
    await Course.create({
      title: 'Introduction to React',
      description: 'Learn the basics of React.js',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      educator: educator._id,
      lessons: [
        { title: 'What is React?', content: 'React is a JavaScript library for building user interfaces.' },
        { title: 'Components', content: 'Components are the building blocks of React applications.' }
      ]
    });

    await Course.create({
      title: 'Advanced Node.js',
      description: 'Deep dive into Node.js',
      imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
      educator: educator._id,
      lessons: [
        { title: 'Event Loop', content: 'The event loop is what allows Node.js to perform non-blocking I/O operations.' },
        { title: 'Streams', content: 'Streams are objects that let you read data from a source or write data to a destination.' }
      ]
    });

    await Course.create({
      title: 'Electronics Fundamentals',
      description: 'Learn the basics of electronics, circuits, and components.',
      imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop',
      educator: educator2._id,
      lessons: [
        { title: 'Basic Circuits', content: 'Understanding resistors, capacitors, and basic circuit design.' },
        { title: 'Microcontrollers', content: 'Introduction to Arduino and basic programming.' }
      ]
    });

    await Course.create({
      title: 'Robotics Engineering',
      description: 'Explore robotics, automation, and AI in machines.',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop',
      educator: educator2._id,
      lessons: [
        { title: 'Robot Kinematics', content: 'Study of motion and mechanics in robots.' },
        { title: 'Sensors and Actuators', content: 'How robots sense and interact with the environment.' }
      ]
    });

    await Course.create({
      title: 'Computer Science Basics',
      description: 'Foundations of computer science, algorithms, and data structures.',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
      educator: educator._id,
      lessons: [
        { title: 'Algorithms', content: 'Introduction to sorting, searching, and complexity.' },
        { title: 'Data Structures', content: 'Arrays, linked lists, trees, and graphs.' }
      ]
    });

    console.log('Data seeded');
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedData();
