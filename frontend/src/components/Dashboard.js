import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch enrolled courses (assuming backend has endpoint)
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://eduforge-web.vercel.app';
    console.log('Dashboard - API URL used:', apiUrl); // Debug logging
    axios.get(`${apiUrl}/api/courses/enrolled`)
      .then(res => setEnrolledCourses(res.data))
      .catch(err => {
        console.error('Error loading enrolled courses:', err);
        setError('Failed to load enrolled courses. Please try refreshing the page.');
      });
  }, []);

  // Dynamic chart data based on enrolled courses
  const chartData = useMemo(() => {
    const categoryCount = {};
    enrolledCourses.forEach(course => {
      const category = course.category || 'General';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([name, enrolled]) => ({ name, enrolled }));
  }, [enrolledCourses]);

  return (
    <Container className="mt-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row className="mb-4 dashboard-header">
          <Col md={8}>
            <h1 className="display-4">Welcome back, {user?.name}!</h1>
            <p className="lead">Track your learning progress and explore new courses.</p>
          </Col>
          <Col md={4} className="text-center">
            <img
              src={user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=150`}
              alt="Profile"
              className="rounded-circle shadow"
              style={{ width: '120px', height: '120px' }}
            />
            <p className="mt-2">Role: {user?.role}</p>
            <Button variant="outline-danger" onClick={logout}>Logout</Button>
          </Col>
        </Row>
      </motion.div>

      {/* Stats Cards */}
      <Row className="mb-4 dashboard-stats">
        <Col md={3} sm={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="text-center shadow">
              <Card.Body>
                <Card.Title className="text-primary">Enrolled Courses</Card.Title>
                <h3>{enrolledCourses.length}</h3>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3} sm={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="text-center shadow">
              <Card.Body>
                <Card.Title className="text-success">Completed</Card.Title>
                <h3>0</h3>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3} sm={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="text-center shadow">
              <Card.Body>
                <Card.Title className="text-warning">In Progress</Card.Title>
                <h3>{enrolledCourses.length}</h3>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col md={3} sm={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="text-center shadow">
              <Card.Body>
                <Card.Title className="text-info">Certificates</Card.Title>
                <h3>0</h3>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Chart */}
      <Row className="mb-4">
        <Col>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Card className="shadow">
              <Card.Header>
                <h4>Enrolled Courses by Category</h4>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="enrolled" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Enrolled Courses */}
      <Row>
        <Col>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            Your Enrolled Courses
          </motion.h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {enrolledCourses.length === 0 ? (
            <Alert variant="info">You haven't enrolled in any courses yet.</Alert>
          ) : (
            enrolledCourses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
              >
                <Card className="mb-3 shadow dashboard-course-card">
                  <Card.Body>
                    <Row>
                      <Col md={2} className="d-flex align-items-center justify-content-center">
                        <div
                          className="course-icon d-flex align-items-center justify-content-center"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "12px",
                            background: index % 3 === 0
                              ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                              : index % 3 === 1
                                ? 'linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)'
                                : 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'
                          }}
                        >
                          <i className={`fas fa-${
                            course.category === 'Development' ? 'laptop-code' :
                            course.category === 'Business' ? 'briefcase' :
                            course.category === 'Design' ? 'paint-brush' :
                            course.category === 'Marketing' ? 'bullhorn' :
                            course.category === 'Photography' ? 'camera' :
                            course.category === 'Music' ? 'music' :
                            course.category === 'Health & Fitness' ? 'heartbeat' : 'book'
                          } text-white fa-lg`}></i>
                        </div>
                      </Col>
                      <Col md={7}>
                        <Card.Title>{course.title}</Card.Title>
                        <Card.Text>{course.description}</Card.Text>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-light text-dark me-2">{course.category || 'General'}</span>
                          <span className="text-muted small">Start anytime</span>
                        </div>
                      </Col>
                      <Col md={3} className="text-end">
                        <Button variant="primary">Continue Learning</Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
