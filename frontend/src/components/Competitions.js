import React from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';

const Competitions = () => {
  const upcomingCompetitions = [
    {
      title: 'Math Olympiad 2023',
      date: 'October 15, 2023',
      description: 'Challenge your mathematical skills in this prestigious competition.',
      prize: '$1000',
      status: 'Open',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=250&fit=crop'
    },
    {
      title: 'Science Fair',
      date: 'November 5, 2023',
      description: 'Showcase your innovative science projects and win recognition.',
      prize: '$500',
      status: 'Open',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop'
    },
    {
      title: 'Coding Challenge',
      date: 'December 1, 2023',
      description: 'Solve complex programming problems and compete with the best.',
      prize: '$750',
      status: 'Registration Closed',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alice Johnson', score: 950, competition: 'Math Olympiad' },
    { rank: 2, name: 'Bob Smith', score: 920, competition: 'Math Olympiad' },
    { rank: 3, name: 'Charlie Brown', score: 890, competition: 'Math Olympiad' },
    { rank: 4, name: 'Diana Prince', score: 880, competition: 'Science Fair' },
    { rank: 5, name: 'Eve Wilson', score: 870, competition: 'Coding Challenge' }
  ];

  return (
    <Container className="mt-4">
      <motion.h2
        className="text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Academic Competitions
      </motion.h2>
      <motion.p
        className="text-center mb-5 lead"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Challenge yourself, compete with peers, and win exciting prizes while showcasing your academic prowess.
      </motion.p>

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
                <Card className="h-100 shadow">
                  <Card.Img variant="top" src={comp.image} alt={comp.title} />
                  <Card.Body>
                    <Card.Title>{comp.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{comp.date}</Card.Subtitle>
                    <Card.Text>{comp.description}</Card.Text>
                    <p><strong>Prize:</strong> {comp.prize}</p>
                    <Badge bg={comp.status === 'Open' ? 'success' : 'secondary'}>{comp.status}</Badge>
                    <br />
                    <Button 
                      variant="primary" 
                      className="mt-3 bg-primary" 
                      disabled={comp.status !== 'Open'}
                      style={{color: 'white'}}
                    >
                      {comp.status === 'Open' ? 'Register Now' : 'Registration Closed'}
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.section>

      {/* Leaderboard */}
      <motion.section
        className="mb-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-center mb-4">Current Leaderboard</h3>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Table striped bordered hover responsive className="shadow">
            <thead className="table-dark">
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Competition</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <td>
                    {entry.rank === 1 && '🥇'}
                    {entry.rank === 2 && '🥈'}
                    {entry.rank === 3 && '🥉'}
                    {entry.rank}
                  </td>
                  <td>{entry.name}</td>
                  <td>{entry.score}</td>
                  <td>{entry.competition}</td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </motion.div>
      </motion.section>

      {/* How to Participate */}
      <motion.section
        className="mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-center mb-4">How to Participate</h3>
        <motion.div
          className="bg-blue p-4 rounded shadow"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ol className="list-unstyled">
            <li className="mb-3">
              <strong>1. Register</strong><br />
              Sign up for the competition of your choice during the registration period.
            </li>
            <li className="mb-3">
              <strong>2. Prepare</strong><br />
              Study the competition guidelines and prepare thoroughly for the challenge.
            </li>
            <li className="mb-3">
              <strong>3. Compete</strong><br />
              Participate in the competition and showcase your skills to win prizes.
            </li>
          </ol>
        </motion.div>
      </motion.section>

      {/* Call to Action */}
      <motion.div
        className="text-center mb-5 bg-blue text-white py-5 rounded shadow"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <h3>Ready to Compete?</h3>
        <p className="lead">Don't miss out on the opportunity to challenge yourself and win prizes.</p>
        <Button variant="light" size="lg">View All Competitions</Button>
      </motion.div>
    </Container>
  );
};

export default Competitions;