import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import axios from 'axios';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Use environment variable with fallback
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://eduforge-web.vercel.app';
        const response = await axios.get(`${apiUrl}/api/courses/${courseId}`);
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <h3>Error</h3>
        <p>{error}</p>
        <Button as={Link} to="/courses" variant="primary">
          Back to Courses
        </Button>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="text-center mt-5">
        <h3>Course Not Found</h3>
        <p>The requested course could not be found.</p>
        <Button as={Link} to="/courses" variant="primary">
          Back to Courses
        </Button>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="py-5">
        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="border-0 shadow-sm">
              {course.imageUrl && (
                <div className="course-header position-relative">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="img-fluid w-100"
                    style={{
                      height: '300px',
                      objectFit: 'cover',
                      borderTopLeftRadius: 'calc(0.375rem - 1px)',
                      borderTopRightRadius: 'calc(0.375rem - 1px)'
                    }}
                  />
                  <div 
                    className="position-absolute bottom-0 start-0 w-100 p-4"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      color: 'white'
                    }}
                  >
                    <Badge bg="primary" className="mb-2">{course.category}</Badge>
                    <h1 className="mb-0">{course.title}</h1>
                  </div>
                </div>
              )}
              <Card.Body className="p-4">
                <Row className="mb-4">
                  <Col sm={6} md={3} className="mb-3 mb-md-0">
                    <div className="text-center">
                      <i className="fas fa-clock text-primary mb-2"></i>
                      <p className="mb-0"><strong>Duration</strong></p>
                      <p className="text-muted">{course.duration || '8 weeks'}</p>
                    </div>
                  </Col>
                  <Col sm={6} md={3} className="mb-3 mb-md-0">
                    <div className="text-center">
                      <i className="fas fa-signal text-primary mb-2"></i>
                      <p className="mb-0"><strong>Level</strong></p>
                      <p className="text-muted">{course.level || 'Intermediate'}</p>
                    </div>
                  </Col>
                  <Col sm={6} md={3} className="mb-3 mb-md-0">
                    <div className="text-center">
                      <i className="fas fa-users text-primary mb-2"></i>
                      <p className="mb-0"><strong>Students</strong></p>
                      <p className="text-muted">{course.enrolledStudents || '150+'}</p>
                    </div>
                  </Col>
                  <Col sm={6} md={3}>
                    <div className="text-center">
                      <i className="fas fa-star text-primary mb-2"></i>
                      <p className="mb-0"><strong>Rating</strong></p>
                      <p className="text-muted">{course.rating || '4.5'}/5</p>
                    </div>
                  </Col>
                </Row>

                <div className="mb-4">
                  <h3>Course Description</h3>
                  <p className="text-muted">{course.description}</p>
                </div>

                <div className="mb-4">
                  <h3>What You'll Learn</h3>
                  <ul className="list-unstyled">
                    {course.learningOutcomes ? (
                      course.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {outcome}
                        </li>
                      ))
                    ) : (
                      ['Master core concepts', 'Build real-world projects', 'Earn a certificate'].map((outcome, index) => (
                        <li key={index} className="mb-2">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {outcome}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default CourseDetails;