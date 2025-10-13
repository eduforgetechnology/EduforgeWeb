import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';

const Tuitions = () => {
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    message: ''
  });

  const tuitionPackages = [
    {
      title: 'Basic Tuition',
      description: 'One-on-one sessions with expert tutors. Perfect for foundational learning.',
      price: '$50',
      period: 'per month',
      color: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      icon: 'fas fa-book',
      features: ['Weekly 1-hour sessions', 'Homework assistance', 'Progress tracking'],
      popular: false
    },
    {
      title: 'Premium Tuition',
      description: 'Comprehensive learning with advanced resources and regular assessments.',
      price: '$100',
      period: 'per month',
      color: 'linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)',
      icon: 'fas fa-graduation-cap',
      features: ['3 sessions per week', 'Personalized curriculum', 'Mock exams', 'Parent-teacher meetings'],
      popular: true
    },
    {
      title: 'Elite Tuition',
      description: 'VIP learning experience with top educators and exclusive materials.',
      price: '$200',
      period: 'per month',
      color: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
      icon: 'fas fa-crown',
      features: ['Unlimited sessions', 'Advanced study materials', 'Guaranteed results', 'Career guidance'],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Wilson',
      role: 'Parent',
      text: 'The tuition program transformed my child\'s learning experience. Highly recommended!',
      rating: 5,
      color: '#4263eb'
    },
    {
      name: 'Mike Johnson',
      role: 'University Student',
      text: 'Excellent tutors and flexible scheduling. My grades improved significantly.',
      rating: 5,
      color: '#f59f00'
    },
    {
      name: 'Emily Davis',
      role: 'High School Student',
      text: 'Personalized attention made all the difference. Worth every penny!',
      rating: 5,
      color: '#37b24d'
    }
  ];
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Inquiry submitted:', formData);
    setInquirySubmitted(true);
    setTimeout(() => setInquirySubmitted(false), 5000);
    setFormData({
      name: '',
      email: '',
      course: '',
      message: ''
    });
  };

  return (
    <Container className="mt-5 tuition-section">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center fw-bold mb-2">Personalized <span className="text-primary">Tuition Services</span></h2>
        <motion.div 
          className="text-center mb-1"
          initial={{ width: 0 }}
          animate={{ width: '80px' }}
          style={{ height: '4px', background: 'var(--primary-gradient)', margin: '0 auto 20px' }}
        />
        <p className="text-center mb-5 lead text-muted">
          Tailored one-on-one tutoring to help students achieve academic excellence and build confidence.
        </p>
      </motion.div>

      {/* Tuition Packages */}
      <motion.section
        className="mb-5 pt-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h3 className="text-center mb-4 fw-bold">Choose Your <span className="text-primary">Tuition Package</span></h3>
        
        <Row className="mt-4">
          {tuitionPackages.map((pkg, index) => (
            <Col md={4} key={index} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className={`h-100 text-center border-0 package-card ${pkg.popular ? 'popular-package' : ''}`}>
                  {pkg.popular && (
                    <div className="popular-badge">
                      <Badge 
                        pill 
                        bg="warning" 
                        className="position-absolute top-0 start-50 translate-middle py-2 px-3 fw-bold"
                      >
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <Card.Header className="text-white border-0 py-4" style={{ background: pkg.color }}>
                    <div className="package-icon mb-3">
                      <i className={`${pkg.icon} fa-2x`}></i>
                    </div>
                    <h3 className="mb-0 fw-bold">{pkg.title}</h3>
                  </Card.Header>
                  
                  <Card.Body className="p-4">
                    <div className="mb-4">
                      <p className="text-muted mb-4">{pkg.description}</p>
                      <div className="price-container">
                        <h2 className="mb-0 fw-bold">{pkg.price}</h2>
                        <p className="text-muted mb-0">{pkg.period}</p>
                      </div>
                    </div>
                    
                    <div className="features-list mb-4">
                      {pkg.features.map((feature, i) => (
                        <motion.div 
                          key={i} 
                          className="feature-item mb-3"
                          whileHover={{ x: 5 }}
                        >
                          <div className="feature-icon">
                            <i className="fas fa-check-circle text-success"></i>
                          </div>
                          <div className="feature-text">
                            {feature}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant={pkg.popular ? "primary" : "outline-primary"} 
                        className={`w-100 py-2 fw-bold ${pkg.popular ? 'btn-lg' : ''}`}
                      >
                        Enroll Now
                      </Button>
                    </motion.div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="mb-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h3 className="text-center mb-4 fw-bold">How Our <span className="text-primary">Tuition Works</span></h3>
        <Row className="mt-4 g-4">
          {[
            {
              title: 'Assessment',
              description: 'We start with a thorough assessment to understand the student\'s strengths, weaknesses, and learning style.',
              icon: 'fas fa-clipboard-check',
              color: '#4263eb'
            },
            {
              title: 'Custom Plan',
              description: 'Our experts develop a personalized learning plan tailored to the student\'s specific needs and goals.',
              icon: 'fas fa-tasks',
              color: '#f59f00'
            },
            {
              title: 'Regular Sessions',
              description: 'Students engage in regular one-on-one or small group sessions with their assigned tutors.',
              icon: 'fas fa-chalkboard-teacher',
              color: '#37b24d'
            },
            {
              title: 'Progress Tracking',
              description: 'We continuously monitor progress and adjust the learning plan as needed to ensure optimal results.',
              icon: 'fas fa-chart-line',
              color: '#7048e8'
            }
          ].map((step, index) => (
            <Col md={3} sm={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="h-100"
              >
                <div className="process-step text-center p-4 h-100">
                  <div 
                    className="process-icon mb-4 mx-auto d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: `${step.color}20`, color: step.color }}
                  >
                    <i className={`${step.icon} fa-2x`}></i>
                  </div>
                  <h5 className="fw-bold mb-3">Step {index + 1}: {step.title}</h5>
                  <p className="text-muted mb-0">{step.description}</p>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="mb-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h3 className="text-center mb-4 fw-bold">What Our <span className="text-primary">Students Say</span></h3>
        <Row className="mt-4">
          {testimonials.map((testimonial, index) => (
            <Col md={4} key={index} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-100 border-0 testimonial-card">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between mb-4">
                      <div className="d-flex align-items-center">
                        <div 
                          className="testimonial-avatar rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ background: `${testimonial.color}40`, color: testimonial.color }}
                        >
                          <span className="fw-bold">{testimonial.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h5 className="mb-0 fw-bold">{testimonial.name}</h5>
                          <p className="mb-0 text-muted small">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <i key={i} className="fas fa-star text-warning"></i>
                        ))}
                      </div>
                    </div>
                    
                    <div className="testimonial-text">
                      <i className="fas fa-quote-left text-primary opacity-25 fa-2x mb-2"></i>
                      <p className="mb-0">{testimonial.text}</p>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.section>

      {/* Inquiry Form */}
      <motion.section
        className="mb-5 pb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h3 className="text-center mb-4 fw-bold">Request <span className="text-primary">More Information</span></h3>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="border-0 shadow-sm inquiry-card">
              <Card.Body className="p-4 p-md-5">
                {inquirySubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Alert variant="success" className="mb-4">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="fas fa-check-circle fa-2x text-success"></i>
                        </div>
                        <div>
                          <h5 className="alert-heading mb-1">Thank you!</h5>
                          <p className="mb-0">Your inquiry has been submitted successfully. We'll get back to you soon.</p>
                        </div>
                      </div>
                    </Alert>
                  </motion.div>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3 floating-form-group">
                        <Form.Control
                          type="text"
                          name="name"
                          id="name"
                          className="form-input-field"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder=" "
                        />
                        <Form.Label htmlFor="name" className="floating-label">
                          <i className="fas fa-user text-primary me-2"></i>Your Name
                        </Form.Label>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3 floating-form-group">
                        <Form.Control
                          type="email"
                          name="email"
                          id="email"
                          className="form-input-field"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder=" "
                        />
                        <Form.Label htmlFor="email" className="floating-label">
                          <i className="fas fa-envelope text-primary me-2"></i>Email Address
                        </Form.Label>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3 floating-form-group">
                    <Form.Control
                      type="text"
                      name="course"
                      id="course"
                      className="form-input-field"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <Form.Label htmlFor="course" className="floating-label">
                      <i className="fas fa-book text-primary me-2"></i>Course/Subject
                    </Form.Label>
                  </Form.Group>
                  
                  <Form.Group className="mb-4 floating-form-group">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      id="message"
                      className="form-input-field"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      style={{ resize: 'none' }}
                    />
                    <Form.Label htmlFor="message" className="floating-label">
                      <i className="fas fa-comment-alt text-primary me-2"></i>Your Message
                    </Form.Label>
                  </Form.Group>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg"
                      className="w-100 py-2 fw-bold"
                    >
                      <i className="fas fa-paper-plane me-2"></i>Submit Inquiry
                    </Button>
                  </motion.div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.section>
    </Container>
  );
};

export default Tuitions;
