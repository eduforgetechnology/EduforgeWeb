import React, { useEffect, useState, useContext, useRef } from 'react';
import { Container, Row, Col, Button, Card, Badge, Alert } from 'react-bootstrap';
import { motion, useInView, useAnimation } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CourseCategories from './CourseCategories';
import Services from './Services';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats] = useState({
    students: 15000,
    courses: 120,
    instructors: 85,
    satisfaction: 98
  });
  
  // Refs for scroll animations
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const statsControls = useAnimation();

  useEffect(() => {
    if (isStatsInView) {
      statsControls.start("visible");
    }
  }, [isStatsInView, statsControls]);

  useEffect(() => {
    // Use environment variable with fallback to ensure API works even if env isn't loaded
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://eduforge-web.vercel.app';
    setIsLoading(true);
    
    axios.get(`${apiUrl}/api/courses`, {
        params: {
          limit: 3 // Request only 3 courses from the backend
        }
      })
      .then(res => {
        if (res.data && res.data.courses) {
          setFeaturedCourses(res.data.courses);
        } else {
          console.error('Unexpected API response format:', res.data);
          setFeaturedCourses([]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setFeaturedCourses([]);
        setIsLoading(false);
      });
  }, []);

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const courseCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: index => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: index * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  return (
    <div>
      {/* Hero Section with Dynamic Background */}
      <motion.div
        className="bg-primary-gradient text-white py-2 py-md-5 py-lg-3 hero-section"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <Container>
          <Row className="align-items-center py-1 py-md-0 py-lg-0">
            <Col md={6}>
              <motion.h1
                className="display-4 fw-bold text-white"
                variants={itemVariants}
                style={{ color: 'white' }}
              >
                Transform Your Future With Expert-Led Learning
              </motion.h1>
              <motion.p
                className="lead mb-4"
                variants={itemVariants}
              >
               Professional teacher training and student robotics competition coaching for WRO, FTC, VEX V5, WSRO, iCode, and CodeAvour
              </motion.p>
              <motion.div variants={itemVariants} className="hero-buttons-container">
                <Button 
                  as={Link} 
                  to="/courses" 
                  variant="light" 
                  size="lg" 
                  className="hero-button explore-button me-3"
                >
                  <i className="fas fa-search me-2"></i>
                  Explore Courses
                </Button>
                <Button 
                  as={Link} 
                  to={user ? "/dashboard" : "/login"} 
                  variant="outline-light" 
                  size="lg" 
                  className="hero-button dashboard-button"
                >
                  {user ? "My Dashboard" : "Join Now"}
                  <i className="fas fa-arrow-right ms-2"></i>
                </Button>
              </motion.div>
            </Col>
            <Col md={6} className="mt-4 mt-md-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center"
              >
                <img
                  src="/img3.jpg"
                  alt="Students learning"
                  className="img-fluid rounded-lg shadow-lg"
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </motion.div>

      {/* Stats Section */}
      <div className="bg-light py-5">
        <Container>
          <motion.div
            ref={statsRef}
            className="text-center mb-5"
            initial="hidden"
            animate={statsControls}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <h2 className="mb-4">Join Our Growing Community</h2>
            <Row>
              {[
                { value: stats.students.toLocaleString(), label: "Students", icon: "fas fa-users" },
                { value: stats.courses, label: "Courses", icon: "fas fa-laptop-code" },
                { value: stats.instructors, label: "Expert Instructors", icon: "fas fa-chalkboard-teacher" },
                { value: stats.satisfaction + "%", label: "Satisfaction Rate", icon: "fas fa-star" }
              ].map((stat, index) => (
                <Col sm={6} md={3} key={index} className="mb-4">
                  <motion.div
                    className="p-4 bg-white rounded shadow-sm"
                    variants={statVariants}
                  >
                    <div className="text-primary mb-2">
                      <i className={`${stat.icon} fa-2x`}></i>
                    </div>
                    <h3 className="h2 mb-0 font-weight-bold">{stat.value}</h3>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </div>

      {/* Services Section */}
      <div style={{ marginBottom: '1rem' }}>
        <Services />
      </div>

      {/* Course Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <CourseCategories />
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="bg-primary-gradient text-white py-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Container className="text-center py-5">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-4 text-white"
            style={{ color: 'white' }}
          >
            Ready to Transform Your Career?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lead mb-4"
          >
            Join thousands of students advancing their skills with our expert-led courses.
            Get started today and take the first step towards your next opportunity.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="cta-buttons-container"
          >
            <Button
              as={Link}
              to={user ? "/courses" : "/login"}
              variant="light"
              size="lg"
              className="cta-button pulse"
            >
              <i className="fas fa-rocket me-2"></i>
              {user ? "Explore All Courses" : "Sign Up Now"}
            </Button>
            <Button
              as={Link}
              to="/contact"
              variant="outline-light"
              size="lg"
              className="cta-button"
            >
              <i className="fas fa-envelope me-2"></i>
              Contact Us
            </Button>
          </motion.div>
        </Container>
      </motion.div>
    </div>
  );
};

export default Home;
