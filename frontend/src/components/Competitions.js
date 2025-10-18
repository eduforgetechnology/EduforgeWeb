import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaTrophy, FaCalendarAlt, FaRocket, FaSearch, FaUserPlus, FaTools, FaPlay, FaAward } from 'react-icons/fa';
import '../styles/competitions.css';

const Competitions = () => {
  const upcomingCompetitions = [
    {
      title: 'WRO(World Robot Olympiad)',
      date: 'November 26-28, 2025',
      description: 'The World Robot Olympiad (WRO) is a global robotics competition where students design and program robots to solve real-world challenges, promoting creativity, teamwork, and innovation in STEM.',
      image: 'https://wroindia.org/wp-content/uploads/2024/03/Cover-week-09-1024x536.jpg',
      registrationLink: 'https://wro-association.org/'
    },
    {
      title: 'FTC (FIRST Tech Challenge)',
      date: 'December 2025 and January 2026',
      description: 'The FIRST Tech Challenge (FTC) is a global robotics competition where students build and program robots to complete missions, fostering creativity, teamwork, and STEM skills.',
      image: 'https://upload.wikimedia.org/wikipedia/en/e/ee/FIRST_Tech_challenge_logo.png',
      registrationLink: 'https://ftcindia.org.in/'
    },
    {
      title: 'VEX V5 Robotics Competition',
      date: 'October 2025 through April 2026',
      description: 'VEX V5 Robotics Competition is a global robotics challenge where students design and program robots to complete tasks, encouraging creativity, teamwork, and practical STEM skills.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu775UoWWPzknJQ00HG0gzG6IFBwnbl4GHnA&s',
      registrationLink: 'https://www.robotevents.com/robot-competitions/vex-robotics-competition'
    },
    {
      title: 'WSRO(World STEM & Robotics Olympiad )',
      date: 'October 4th and 5th, 2025',
      description: 'World STEM & Robotics Olympiad (WSRO) is a global competition where students design and program robots to solve STEM-based challenges, promoting creativity, teamwork, and innovation in science and technology.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg7SiF7Dzi9_zRGescF0xYobzd9JCYMNgQdA&s',
      registrationLink: 'https://wsro.in/'
    },
    {
      title: 'ICode',
      date: ' October 2025',
      description: 'ICode is an international coding and robotics competition where students develop programming and problem-solving skills, fostering creativity, teamwork, and innovation in technology and STEM.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV33smJHyYkJRcu8KR3kc4NS8pmhI0AUyF0A&s',
      registrationLink: 'https://icode.org/'
    },
    {
      title: 'CodeAvour',
      date: 'August 30, 2025',
      description: 'Codeavour is a global coding and technology competition where students showcase their programming skills, solve real-world challenges, and develop creativity, teamwork, and STEM innovation.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY46CjKSWsVkXzUAjAyb39hoS5EnN8csCo5w&s',
      registrationLink: 'https://codeavour.org/'
    }
  ];


  return (
    <div className="competitions-container">
      <Container>
        <motion.h2
          className="competitions-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaTrophy className="trophy-icon" /> Competitions & Challenges
        </motion.h2>
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <motion.p
              className="competitions-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              We actively encourage participation in a variety of national and international competitions that promote creativity, innovation, and problem-solving skills. Events such as the World Robot Olympiad (WRO), FIRST Tech Challenge (FTC), and World Science Robot Olympiad (WSRO) provide students with valuable hands-on experience, teamwork opportunities, and exposure to emerging technologies. Through these competitions, participants develop confidence, leadership, and a spirit of collaboration that extends beyond the classroom.
            </motion.p>
          </Col>
          <Col md={6}>
            <motion.img
              src="https://media.istockphoto.com/id/1357832129/photo/children-in-robotics-classes-celebrate-victory.webp?a=1&b=1&s=612x612&w=0&k=20&c=1BSDorwTdUVn7fNRts4kctvVJfbV__q39rveiS4UV5c="
              alt="Students participating in robotics competition"
              className="img-fluid rounded"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </Col>
        </Row>

      {/* Upcoming Competitions */}
      <motion.section
        className="mb-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-center mb-4">Upcoming Competitions</h3>
        <Row>
          {upcomingCompetitions.map((comp, index) => (
            <Col md={4} key={index} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="competition-card h-100">
                  <Card.Img variant="top" src={comp.image} alt={comp.title} className="competition-card-img" />
                  <Card.Body className="competition-card-body">
                    <Card.Title className="competition-card-title">
                      <FaRocket className="me-2" style={{color: '#ff6b6b'}} />
                      {comp.title}
                    </Card.Title>
                    <Card.Subtitle className="competition-card-date">
                      <FaCalendarAlt className="me-1" />
                      {comp.date}
                    </Card.Subtitle>
                    <Card.Text className="competition-card-text">{comp.description}</Card.Text>
                    <Button className="register-btn w-100" as="a" href={comp.registrationLink} target="_blank" rel="noopener noreferrer">
                      Register Now
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.section>



      {/* How to Participate */}
      <motion.section
        className="participate-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="participate-title">How to Participate</h3>
        <motion.div
          className="participate-steps"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="step-item">
            <div className="step-icon">
              <FaSearch />
            </div>
            <div className="step-content">
              <h4>1. Discover Competitions</h4>
              <p>Explore our diverse range of competitions and find the perfect challenge that matches your interests and skill level.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-icon">
              <FaUserPlus />
            </div>
            <div className="step-content">
              <h4>2. Register & Join</h4>
              <p>Sign up through our streamlined registration process. Form teams, provide necessary details, and secure your spot.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-icon">
              <FaTools />
            </div>
            <div className="step-content">
              <h4>3. Prepare & Train</h4>
              <p>Access resources, practice challenges, and refine your skills with our mentorship programs and training materials.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-icon">
              <FaPlay />
            </div>
            <div className="step-content">
              <h4>4. Compete & Excel</h4>
              <p>Showcase your talents on competition day. Collaborate, innovate, and strive for excellence in your chosen challenge.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-icon">
              <FaAward />
            </div>
            <div className="step-content">
              <h4>5. Celebrate & Grow</h4>
              <p>Celebrate your achievements, learn from the experience, and continue your STEM journey with newfound skills and confidence.</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Call to Action */}
      <motion.div
        className="cta-section"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="cta-title">Ready to Compete?</h3>
        <p className="cta-text">Don't miss out on the opportunity to challenge yourself and win prizes.</p>
        <Button className="cta-btn">View All Competitions</Button>
      </motion.div>



      </Container>
    </div>
  );
};

export default Competitions;