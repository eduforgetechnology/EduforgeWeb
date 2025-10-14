import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

const About = () => {
  const team = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years in edtech, passionate about democratizing education.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Alice Johnson',
      role: 'CTO',
      bio: 'Tech innovator specializing in scalable learning platforms and AI-driven education.',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?cs=srgb&dl=pexels-simon-robben-55958-614810.jpg&fm=jpg'
    },
    {
      name: 'Jane Smith',
      role: 'Head of Education',
      bio: 'Former professor with expertise in curriculum development and student success.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        className="about-hero-section text-white py-5"
        style={{ background: 'var(--primary-gradient)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <motion.h1
                className="display-4 text-white"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                About E-Learning Platform
              </motion.h1>
              <motion.p
                className="lead text-white"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                Empowering learners worldwide with innovative, accessible, and personalized education solutions.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mb-4"
              >
                <Button variant="light" size="lg" className="text-primary fw-bold bg-white">Learn More</Button>
              </motion.div>
            </Col>
            <Col md={6}>
              <motion.img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop"
                alt="Company"
                className="img-fluid rounded shadow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </Col>
          </Row>
        </Container>
      </motion.div>

      <Container className="mt-5">
        {/* Mission */}
        <motion.section
          className="mb-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Row>
            <Col>
              <h2 className="text-center mb-4">Our Mission</h2>
              <p className="text-center lead">
                To revolutionize education by providing cutting-edge, technology-driven learning experiences
                that empower individuals to achieve their full potential and contribute meaningfully to society.
              </p>
            </Col>
          </Row>
        </motion.section>

        {/* Stats */}
        <motion.section
          className="mb-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Row className="text-center">
            <Col md={3}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="stat-card p-3"
              >
                <h3 className="text-primary fw-bold">10,000+</h3>
                <p className="text-dark mb-0">Students Enrolled</p>
              </motion.div>
            </Col>
            <Col md={3}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="stat-card p-3"
              >
                <h3 className="text-primary fw-bold">500+</h3>
                <p className="text-dark mb-0">Courses Offered</p>
              </motion.div>
            </Col>
            <Col md={3}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="stat-card p-3"
              >
                <h3 className="text-primary fw-bold">50+</h3>
                <p className="text-dark mb-0">Expert Educators</p>
              </motion.div>
            </Col>
            <Col md={3}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="stat-card p-3"
              >
                <h3 className="text-primary fw-bold">95%</h3>
                <p className="text-dark mb-0">Student Satisfaction</p>
              </motion.div>
            </Col>
          </Row>
        </motion.section>

        {/* CEO */}
        <motion.section
          className="mb-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-center mb-4">Meet Our CEO</h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="text-center shadow">
                <Card.Img variant="top" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=face" />
                <Card.Body>
                  <Card.Title>John Doe</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">CEO & Founder</Card.Subtitle>
                  <Card.Text>
                    With over 15 years in the education technology sector, John has led the development of
                    innovative learning platforms that have impacted millions of learners globally. His vision
                    for accessible, personalized education drives our company's mission to democratize learning.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.section>

        {/* Team */}
        <motion.section
          className="mb-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-center mb-4">Our Leadership Team</h2>
          <Row>
            {team.map((member, index) => (
              <Col md={4} key={index} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="h-100 text-center shadow">
                    <Card.Img variant="top" src={member.image} />
                    <Card.Body>
                      <Card.Title>{member.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
                      <Card.Text>{member.bio}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.section>

        {/* Contact */}
        <motion.section
          className="mb-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-center mb-4">Get In Touch</h2>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>Contact Us</Card.Title>
                  <p><strong>Email:</strong> info@elearningplatform.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Address:</strong> 123 Education Street, Learning City, LC 12345</p>
                  <Button variant="primary" className="text-white">Send Message</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.section>
      </Container>
    </div>
  );
};

export default About;
