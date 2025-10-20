import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaArrowRight,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaBook,
  FaUsers,
  FaTrophy,
  FaMoneyBill,
  FaInfo,
  FaChevronUp,
  FaHeart
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Animation variants
  const footerLinkVariants = {
    hover: { 
      x: 5,
      color: 'var(--accent-color)',
      transition: { duration: 0.2 }
    }
  };

  const socialIconVariants = {
    hover: { 
      y: -5,
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <footer className="footer-area">
      {/* Wave element removed as requested */}
      <Container className="footer-main">
        <Row>
          <Col lg={3} md={6} sm={12}>
            <div className="footer-widget">
              <div className="footer-logo mb-4 mt-3">
                <Link to="/">
                  <img src="/eduforge.svg" alt="EduForge Logo" style={{ height: '60px', width: 'auto'}} />
                </Link>
              </div>
              <p className="footer-desc mb-4">
                Transforming education through technology and innovation. EduForge provides cutting-edge courses, workshops, and competitions to help students master in-demand tech skills.
              </p>
              <div className="footer-social">
                <motion.a 
                  href="https://www.facebook.com/profile.php?id=61581901205228" 
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover="hover"
                  className="social-icon facebook"
                >
                  <FaFacebookF />
                </motion.a>
                <motion.a 
                  href="https://x.com/Edu_Forge" 
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover="hover"
                  className="social-icon twitter"
                >
                  <FaTwitter />
                </motion.a>
                <motion.a 
                  href="https://www.instagram.com/eduforgetechnology/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover="hover"
                  className="social-icon instagram"
                >
                  <FaInstagram />
                </motion.a>
                <motion.a 
                  href="https://www.linkedin.com/in/eduforge/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover="hover"
                  className="social-icon linkedin"
                >
                  <FaLinkedinIn />
                </motion.a>
                <motion.a 
                  href="https://youtube.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialIconVariants}
                  whileHover="hover"
                  className="social-icon youtube"
                >
                  <FaYoutube />
                </motion.a>
              </div>
            </div>
          </Col>
          
          <Col lg={3} md={6} sm={12}>
            <div className="footer-widget">
              <h4 className="widget-title">Explore</h4>
              <ul className="footer-links">
                <li>
                  <motion.div variants={footerLinkVariants} whileHover="hover">
                    <Link to="/courses"><FaBook className="me-2" /> Our Courses</Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div variants={footerLinkVariants} whileHover="hover">
                    <Link to="/educators"><FaUsers className="me-2" /> Our Educators</Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div variants={footerLinkVariants} whileHover="hover">
                    <Link to="/tuitions"><FaMoneyBill className="me-2" /> Tuition Plans</Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div variants={footerLinkVariants} whileHover="hover">
                    <Link to="/competitions"><FaTrophy className="me-2" /> Competitions</Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div variants={footerLinkVariants} whileHover="hover">
                    <Link to="/about"><FaInfo className="me-2" /> About Us</Link>
                  </motion.div>
                </li>
              </ul>
            </div>
          </Col>
          
          <Col lg={3} md={6} sm={12}>
            <div className="footer-widget">
              <h4 className="widget-title">Contact Info</h4>
              <ul className="footer-contact-info">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <div className="contact-text">
                   31, Begampur, Malviya Nagar, Delhi NCR, India, PIN 110017
                  </div>
                </li>
                <li>
                  <FaPhoneAlt className="contact-icon" />
                  <div className="contact-text">
                    <a href="tel:+11234567890">+91 9306230386</a>
                  </div>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <div className="contact-text">
                    <a href="mailto:info@eduforge.com">lokesh@eduforge.co</a>
                  </div>
                </li>
              </ul>
            </div>
          </Col>
          
          <Col lg={3} md={6} sm={12}>
            <div className="footer-widget">
              <h4 className="widget-title">Newsletter</h4>
              <p className="newsletter-text">Subscribe to our newsletter to receive updates on new courses, promotions, and educational content.</p>
              <Form onSubmit={handleSubscribe} className="footer-newsletter">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="newsletter-btn" 
                    disabled={subscribed}
                  >
                    {subscribed ? 'Subscribed!' : (
                      <>
                        Subscribe <FaArrowRight className="ms-1" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      
      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <p className="copyright-text">
                &copy; {new Date().getFullYear()} EduForge. All rights reserved. Made with <FaHeart className="heart-icon" /> for learning.
              </p>
            </Col>
            <Col md={6}>
              <div className="footer-bottom-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
                <Link to="/faq">FAQ</Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      

    </footer>
  );
};

export default Footer;