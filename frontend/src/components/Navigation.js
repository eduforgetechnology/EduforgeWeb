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
  FaBars
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
      <Container>
        <div className="d-flex align-items-center">
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <div className="d-flex align-items-center">
              <div className="logo-icon">
                <span>E</span>
              </div>
    <div className="brand-text ms-2">EduForge</div>
            </div>
          </Navbar.Brand>
        </div>

        {/* Login button for non-logged in users */}
        {!user && (
          <div className="d-flex align-items-center ms-auto">
            <Button
              as={Link}
              to="/login"
              variant="primary"
              className="login-button"
            >
              <FaUser className="me-2" /> Login
            </Button>
          </div>
        )}

        {/* Menu toggle and collapse only for logged in users */}
        {user && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto">
              <FaBars />
            </Navbar.Toggle>

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto">
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/"
                    className={isActive('/') ? 'active-nav-link' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaHome className="nav-icon" />
                    <span>Home</span>
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
                    className={isActive('/courses') ? 'active-nav-link' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaBook className="nav-icon" />
                    <span>Courses</span>
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
                    className={isActive('/educators') ? 'active-nav-link' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaUsers className="nav-icon" />
                    <span>Educators</span>
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
                    className={isActive('/tuitions') ? 'active-nav-link' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaMoneyBill className="nav-icon" />
                    <span>Tuitions</span>
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
                    className={isActive('/competitions') ? 'active-nav-link' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaTrophy className="nav-icon" />
                    <span>Competitions</span>
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
                    className={isActive('/about') ? 'active-nav-link' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaInfo className="nav-icon" />
                    <span>About</span>
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
                    className={isActive('/contact') ? 'active-nav-link' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaEnvelope className="nav-icon" />
                    <span>Contact</span>
                  </Nav.Link>
                </motion.div>

                {/* Add Dashboard and Logout to the main navigation */}
                <motion.div
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className={isActive('/dashboard') ? 'active-nav-link' : ''}
                    onClick={() => setExpanded(false)}
                  >
                    <FaUser className="nav-icon" />
                    <span>Dashboard</span>
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
                    className="nav-link-logout"
                  >
                    <FaSignOutAlt className="nav-icon" />
                    <span>Logout</span>
                  </Nav.Link>
                </motion.div>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default Navigation;