import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRobot, FaCode, FaTrophy, FaLightbulb, FaUsers, FaRocket, FaQuoteLeft, FaAward, FaGraduationCap, FaHandshake } from 'react-icons/fa';
import '../styles/about.css';

const About = () => {
  const colors = ['#007bff', '#28a745', '#fd7e14', '#6f42c1'];

  const services = [
    {
      icon: <FaRobot />,
      title: 'Robotics Education',
      description: 'Hands-on robotics courses covering design, programming, and real-world applications.'
    },
    {
      icon: <FaCode />,
      title: 'Coding & Programming',
      description: 'Comprehensive coding curriculum from basics to advanced algorithms and AI development.'
    },
    {
      icon: <FaTrophy />,
      title: 'Competitions & Challenges',
      description: 'Participation in national and international robotics and coding competitions.'
    },
    {
      icon: <FaLightbulb />,
      title: 'STEM Innovation',
      description: 'Fostering creativity through electronics, IoT, and emerging technology projects.'
    }
  ];

  const testimonials = [
    {
      name: 'Arun Kumar',
      role: 'Parent',
      content: 'EduForge transformed my child\'s interest in technology into a passion. The hands-on approach is incredible!'
    },
    {
      name: 'Dr. Dinesh Patil',
      role: 'STEM Educator',
      content: 'The quality of education and resources provided by EduForge is unparalleled. Highly recommended!'
    },
    {
      name: 'Arjun Singh',
      role: 'Student',
      content: 'Learning robotics here has opened up so many opportunities. The community is amazing!'
    }
  ];

  const achievements = [
    'B.Sc. (Electronics) - Foundation in Technology',
    'B.Ed. (CS, Maths, Physical Science) - Teaching Excellence',
    'M.Sc. (Computer Science) - Advanced Computing',
    'CTET Level 1 & 2 Qualified - Certified Educator'
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <motion.div
        className="about-hero-section text-white py-2 py-md-5"
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
                About EduForge Platform
              </motion.h1>
              <motion.p
                className="lead text-white"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                EduForge is a dynamic learning platform dedicated to empowering students with the skills and knowledge they need to thrive in a technology-driven world.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mb-4"
              >
                <Button variant="light" size="lg" className="text-primary fw-bold bg-white me-3">Learn More</Button>
                <Link to="/contact">
                  <Button variant="outline-light" size="lg">Send Message</Button>
                </Link>
              </motion.div>
            </Col>
            <Col md={6}>
              <motion.img
                src="/img2.jpg"
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
          <Card className="about-section-card">
            <Card.Body className="about-section-card-body">
              <h2 className="text-center mb-4 text-blue">Our Mission</h2>
              <p className="text-center lead">
               At EduForge, our mission is to make cutting-edge technology education accessible, engaging, and practical for students everywhere. We aim to inspire curiosity and creativity by providing hands-on learning experiences in fields like robotics, electronics, computer science, and emerging global technologies. By bridging the gap between traditional education and real-world innovation, we strive to empower the next generation of problem-solvers, inventors, and tech leaders to confidently shape the future.
              </p>
            </Card.Body>
          </Card>
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
                <h3 className="text-white fw-bold">10,000+</h3>
                <p className="text-white mb-0">Students Enrolled</p>
              </motion.div>
            </Col>
            <Col md={3}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="stat-card p-3"
              >
                <h3 className="text-white fw-bold">500+</h3>
                <p className="text-white mb-0">Courses Offered</p>
              </motion.div>
            </Col>
            <Col md={3}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="stat-card p-3"
              >
                <h3 className="text-white fw-bold">50+</h3>
                <p className="text-white mb-0">Expert Educators</p>
              </motion.div>
            </Col>
            <Col md={3}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="stat-card p-3"
              >
                <h3 className="text-white fw-bold">95%</h3>
                <p className="text-white mb-0">Student Satisfaction</p>
              </motion.div>
            </Col>
          </Row>
        </motion.section>

        {/* Services Overview */}
        <motion.section
          className="mb-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-center mb-5 text-white">Our Core Services</h2>
          <Row>
            {services.map((service, index) => (
              <Col md={6} lg={3} key={index} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 15px 35px rgba(${colors[index] === '#007bff' ? '0,123,255' : colors[index] === '#28a745' ? '40,167,69' : colors[index] === '#fd7e14' ? '253,126,20' : '111,66,193'}, 0.3)`
                  }}
                >
                  <Card className="h-100 text-center border-0" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: `2px solid ${colors[index]}` }}>
                    <Card.Body className="d-flex flex-column">
                      <motion.div
                        className="mb-3"
                        style={{ fontSize: '3rem', color: colors[index] }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        {service.icon}
                      </motion.div>
                      <Card.Title className="fw-bold" style={{ color: colors[index] }}>{service.title}</Card.Title>
                      <Card.Text className="text-muted">{service.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.section>

        {/* CEO */}
        <motion.section
          className="mb-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-center mb-4 text-white fw-bold fs-1">Meet Our CEO</h2>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="about-ceo-card shadow-lg border-0">
                <Card.Body className="p-5">
                  <Row className="align-items-center">
                    <Col md={4} className="text-center mb-4 mb-md-0">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                      >
                        <div className="about-ceo-avatar mx-auto">
                          <span className="about-ceo-initials">LS</span>
                        </div>
                      </motion.div>
                    </Col>
                    <Col md={8}>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h3 className="about-ceo-name mb-3">Lokesh Sharma</h3>
                        <Badge className="about-ceo-badge mb-4">Founder & CEO, Eduforge.co</Badge>
                        <blockquote className="about-ceo-quote mb-4">
                          "Education is not just about learning facts; it's about igniting curiosity, fostering innovation, and empowering the next generation to solve the world's most pressing challenges."
                        </blockquote>
                        <p className="about-ceo-description mb-4">
                          A passionate educator and innovator dedicated to transforming STEM education through practical, hands-on learning experiences that prepare students for tomorrow's challenges.
                        </p>
                        <div className="row g-2">
                          {achievements.map((achievement, index) => (
                            <Col md={6} key={index}>
                              <div className="about-achievement-item p-2 rounded">
                                {achievement}
                              </div>
                            </Col>
                          ))}
                        </div>
                      </motion.div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.section>

        {/* Vision */}
        <motion.section
          className="mb-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Row>
            <Col lg={12}>
          <h2 className="text-center mb-4 mt-4 text-white">Our Vision for the Future</h2>
            </Col>
            <Col lg={12} className="mb-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="d-flex justify-content-center"
              >
                <img
                  src="https://media.istockphoto.com/id/500504909/photo/business-vision.jpg?s=612x612&w=0&k=20&c=sfAyloZ4GkAkZQ7KIm_Jeg33a4Z-HuR7lTijWbRN95g="
                  alt="Future of STEM Education"
                  className="img-fluid rounded shadow-lg"
                  style={{ width: '100%', height: 'auto', maxWidth: '600px' }}
                />
              </motion.div>
            </Col>
            <Col lg={12}>
              <p className="lead text-center mb-4 text-white">
                We envision a world where every student has the opportunity to become a creator, innovator, and problem-solver. Through our comprehensive STEM education platform, we're building the foundation for the next generation of technology leaders.
              </p>
              <div className="row g-3 justify-content-center">
                <div className="col-md-6 col-lg-3">
                  <div className="d-flex align-items-center mb-3 text-white">
                    <FaRocket className="text-white me-3" size={24} />
                    <span>Innovation-Driven Learning</span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="d-flex align-items-center mb-3 text-white">
                    <FaUsers className="text-white me-3" size={24} />
                    <span>Collaborative Communities</span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="d-flex align-items-center mb-3 text-white">
                    <FaGraduationCap className="text-white me-3" size={24} />
                    <span>Real-World Applications</span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="d-flex align-items-center mb-3 text-white">
                    <FaHandshake className="text-white me-3" size={24} />
                    <span>Industry Partnerships</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          className="mb-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-center mb-3 text-white">What Our Community Says</h2>
          <Row>
            {testimonials.map((testimonial, index) => (
              <Col md={4} key={index} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="h-100 shadow-lg border-0">
                    <Card.Body className="text-center p-4">
                      <Card.Text className="mb-3">"{testimonial.content}"</Card.Text>
                      <Card.Title className="h6">{testimonial.name}</Card.Title>
                      <Badge bg="secondary">{testimonial.role}</Badge>
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
          <h2 className="text-center mb-4 text-white">Get In Touch</h2>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="shadow">
                <Card.Body>
                  <Card.Title>Contact Us</Card.Title>
                  <p><strong>Email:</strong> lokesh@eduforge.co</p>
                  <p><strong>Phone:</strong> +91 9306230386</p>
                  <p><strong>Address:</strong> 31, Begampur, Malviya Nagar, Delhi NCR, India, PIN 110017</p>
               <Link to="/contact">
                  <Button variant="primary" size="lg">Send Message</Button>
                </Link>
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
