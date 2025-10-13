import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

const Educators = () => {
  const [activeEducator, setActiveEducator] = useState(null);

  const educators = [
    {
      name: 'John Doe',
      title: 'Senior Web Development Instructor',
      specialty: 'Frontend Development',
      bio: 'Experienced software engineer with 10+ years in web development. Specializes in React and Node.js.',
      courses: ['Introduction to React', 'Advanced Node.js', 'Computer Science Basics'],
      stats: { students: 2547, rating: 4.9, reviews: 487 },
      color: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
    },
    {
      name: 'Alice Johnson',
      title: 'Technology Innovation Lead',
      specialty: 'AI & Development',
      bio: 'Tech innovator specializing in scalable learning platforms and AI-driven education. Expert in development and programming.',
      courses: ['Machine Learning Fundamentals', 'Full-Stack Development'],
      stats: { students: 1843, rating: 4.7, reviews: 312 },
      color: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'
    },
    {
      name: 'Jane Smith',
      title: 'Data Science Expert',
      specialty: 'Machine Learning',
      bio: 'Data scientist and AI enthusiast. Teaches machine learning and Python programming.',
      courses: ['Machine Learning Basics', 'Python for Data Science'],
      stats: { students: 3201, rating: 4.8, reviews: 529 },
      color: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)'
    },
    {
      name: 'Michael Chen',
      title: 'Design Thinking Coach',
      specialty: 'UX/UI Design',
      bio: 'Award-winning designer with experience across multiple industries. Passionate about creating intuitive user experiences.',
      courses: ['Design Fundamentals', 'User Experience Design', 'Portfolio Development'],
      stats: { students: 1756, rating: 4.9, reviews: 368 },
      color: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
    }
  ];

  return (
    <Container className="mt-5 educators-section">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center fw-bold mb-2">Meet Our <span className="text-primary">Expert Educators</span></h2>
        <motion.div 
          className="text-center mb-1"
          initial={{ width: 0 }}
          animate={{ width: '80px' }}
          style={{ height: '4px', background: 'var(--primary-color)', margin: '0 auto 20px' }}
        />
        <p className="text-center mb-5 lead text-muted">Learn directly from industry experts with years of experience in their specialized fields.</p>
      </motion.div>
      
      <Row className="mb-5">
        {educators.map((educator, index) => (
          <Col lg={3} md={6} key={index} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="h-100"
            >
              <Card 
                className="educator-card border-0 h-100" 
                onClick={() => setActiveEducator(activeEducator === index ? null : index)}
              >
                <div className="position-relative">
                  <div 
                    className="educator-header p-4 text-white" 
                    style={{ background: educator.color, borderRadius: '16px 16px 0 0' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="educator-avatar rounded-circle d-flex align-items-center justify-content-center">
                        <span className="fw-bold fs-3">{educator.name.charAt(0)}</span>
                      </div>
                      <Badge 
                        pill
                        bg="light" 
                        text="dark" 
                        className="py-2 px-3 fw-bold"
                      >
                        {educator.specialty}
                      </Badge>
                    </div>
                    <h4 className="mb-1 fw-bold">{educator.name}</h4>
                    <p className="mb-0 opacity-75">{educator.title}</p>
                  </div>
                </div>
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between text-center mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">{educator.stats.students.toLocaleString()}</h5>
                        <small className="text-muted">Students</small>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-1">{educator.stats.rating}</h5>
                        <small className="text-muted">Rating</small>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-1">{educator.stats.reviews}</h5>
                        <small className="text-muted">Reviews</small>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted mb-3">{educator.bio}</p>
                  
                  <motion.div
                    initial={{ opacity: 0.9 }}
                    whileHover={{ opacity: 1 }}
                    className="mb-3"
                  >
                    <h6 className="fw-bold text-primary mb-2">
                      <i className="fas fa-book-open me-2"></i>Courses Offered
                    </h6>
                    <ul className="ps-3 courses-list">
                      {educator.courses.map((course, i) => (
                        <motion.li 
                          key={i}
                          className="mb-1"
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {course}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  
                  <AnimatePresence>
                    {activeEducator === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3"
                      >
                        <div className="border-top pt-3 mt-2">
                          <h6 className="fw-bold mb-2">Contact Information</h6>
                          <p className="mb-1"><i className="fas fa-envelope me-2 text-primary"></i>contact@example.com</p>
                          <p className="mb-1"><i className="fas fa-clock me-2 text-primary"></i>Office Hours: Mon-Fri, 10am-4pm</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    className="mt-3"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      variant={activeEducator === index ? "primary" : "outline-primary"} 
                      className="w-100"
                    >
                      {activeEducator === index ? (
                        <>
                          <i className="fas fa-minus me-2"></i>Show Less
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user me-2"></i>View Profile
                        </>
                      )}
                    </Button>
                  </motion.div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-center mt-4 pt-3"
      >
        <div className="p-4 rounded-lg join-team-banner">
          <h3 className="fw-bold mb-3">Want to join our teaching team?</h3>
          <p className="lead mb-4">We're always looking for talented educators to join our platform.</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="primary" size="lg" className="px-4 py-2">
              <i className="fas fa-paper-plane me-2"></i>Apply Now
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </Container>
  );
};

export default Educators;
