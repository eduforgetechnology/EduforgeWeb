import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import {
  FaHome,
  FaBook,
  FaUsers,
  FaMoneyBill,
  FaTrophy,
  FaInfo,
  FaSignOutAlt,
  FaUser,
  FaEnvelope,
  FaBars,
  FaServicestack
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Monitor scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navbarClasses = `navbar-main ${scrolled ? 'navbar-scrolled' : ''}`;

  const handleNavbarToggle = () => {
    setExpanded(!expanded);
  };

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 } 
    },
    hover: { 
      scale: 1.05,
      color: 'var(--accent-color)',
      transition: { duration: 0.2 }
    }
  };

  return (
    <Navbar 
      variant="dark" 
      expand="lg" 
      fixed="top" 
      className={navbarClasses}
      expanded={expanded}
      onToggle={handleNavbarToggle}
    >
      <Container fluid>
        <div className="d-flex align-items-center">
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <div className="d-flex align-items-center">
              <img src="/eduforge.svg" alt="EduForge Logo" className="navbar-logo" />
            </div>
          </Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <FaBars />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="align-items-center">
            {!user ? (
              // Navigation items for non-logged in users
              <>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/"
                    className={isActive('/') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaHome className="nav-icon" /> Home
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/competitions"
                    className={isActive('/competitions') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaTrophy className="nav-icon" /> Competitions
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/services"
                    className={isActive('/services') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaServicestack className="nav-icon" /> Services
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/contact"
                    className={isActive('/contact') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaEnvelope className="nav-icon" /> Contact
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/about"
                    className={isActive('/about') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaInfo className="nav-icon" /> About
                  </Nav.Link>
                </motion.div>
                <Button
                  as={Link}
                  to="/login"
                  variant="primary"
                  className="login-button ms-3"
                  onClick={() => setExpanded(false)}
                >
                  <FaUser className="me-2" /> Login
                </Button>
              </>
            ) : (
              // Navigation items for logged in users
              <>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/"
                    className={isActive('/') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaHome className="nav-icon" /> Home
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/courses"
                    className={isActive('/courses') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaBook className="nav-icon" /> Courses
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/educators"
                    className={isActive('/educators') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaUsers className="nav-icon" /> Educators
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/tuitions"
                    className={isActive('/tuitions') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaMoneyBill className="nav-icon" /> Tuitions
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/competitions"
                    className={isActive('/competitions') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaTrophy className="nav-icon" /> Competitions
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className={isActive('/dashboard') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaUser className="nav-icon" /> Dashboard
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/services"
                    className={isActive('/services') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaServicestack className="nav-icon" /> Services
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/about"
                    className={isActive('/about') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaInfo className="nav-icon" /> About
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/contact"
                    className={isActive('/contact') ? 'active' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaEnvelope className="nav-icon" /> Contact
                  </Nav.Link>
                </motion.div>
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    onClick={() => {
                      logout();
                      setExpanded(false);
                    }}
                    className="text-danger"
                  >
                    <FaSignOutAlt className="nav-icon" /> Logout
                  </Nav.Link>
                </motion.div>
                
                {/* User profile indicator */}
                <div className="user-profile-indicator ms-3">
                  <div className="profile-circle">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
