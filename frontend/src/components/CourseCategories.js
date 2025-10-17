import React from 'react';
import { BookOpen, Code, Cpu, Zap } from 'lucide-react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/courseCategories.css';

export default function CourseCategories() {
  const courseCategories = [
    {
      category: 'School Courses (Grades 1-12)',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-600',
      courses: [
        'Automated Engineering (Grades 7-12)',
        'Mechanics Fundamentals (Grades 2-12)',
        'Circuit Starters (Grades 1-12)',
        'TechBuddies Electronics',
        'Python Visual Programming (Grades 1-12)',
        'Smart Data Science (Grades 1-12)',
        'Machine Makers (Grades 1-12)',
        'CreativeCode Studio (Grades 1-12)',
        'Powered Constructions',
        'Autonomous Bots (Grades 1-12)',
        'Smart Machines Engineering (Grades 6-12)',
        'RC Engineering Lab (Grades 1-12)',
        'Mobile App Creators',
        'GameDev with Python',
        'MicroLogic Lab (Grades 1-12)',
        'Digital Design Playground (Grades 1-12)'
      ]
    },
    {
      category: 'Institute Programs',
      icon: Cpu,
      gradient: 'from-purple-500 to-pink-600',
      courses: [
        'Autonomous Robotics',
        'Junior Circuit Explorer (Level 1 & 2)',
        'Microcontroller Lab',
        'AppCrafters Academy (Grades 1-12)',
        'Python CodePath (Grades 3-10)',
        'EV3 RoboMakers Essentials',
        'CircuitMasters Advanced V2.0',
        'Duplo - Little Engineers',
        'AppInnovators Studio (Grades 2-12)',
        'Scratch ProBuilders',
        'Web Creators Academy (Grades 2-12)',
        'Web Design Foundations (Grades 1-12)',
        'Intelligent Systems Lab (Grades 1-12)',
        'Predictive Analytics Lab (Grades 2-12)',
        'Scratch Builders',
        'Python Beginners Path (Grades 1-10)'
      ]
    },
    {
      category: 'Competitions & Challenges',
      icon: Zap,
      gradient: 'from-orange-500 to-red-600',
      courses: [
        'CODEAVOUR CHALLENGE',
        'WRO - Advanced Robo Rally',
        'Child Safety Awareness (POCSO)'
      ]
    },
    {
      category: 'Special Programs',
      icon: Code,
      gradient: 'from-green-500 to-teal-600',
      courses: [
        'BotBuilders Workshop',
        'STEM Celebrations & Events',
        'Welcome to Innovation Lab',
        'Tech Discovery: NanoBit Innovators (Grade 4)',
        'Tech FastTrack: NanoBit Innovation',
        'Mini IoT Innovators',
        'PlayTech Circuits'
      ]
    }
  ];

  return (
    <section className="py-5 bg-white">
      <Container>
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center bg-gradient-to-r rounded-pill px-3 py-2 mb-3" 
               style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: 'white' }}>
            <BookOpen className="me-2" size={18} />
            <span className="fw-bold">Course Catalog</span>
          </div>
          <h2 className="display-5 fw-bold mb-3">
            50+ Innovative Courses
          </h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
            From basic electronics to advanced robotics and AI - comprehensive curriculum for all age groups
          </p>
        </div>

        <Row className="g-4">
          {courseCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Col md={6} key={index}>
                <Card className="h-100 border course-category-card">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="d-inline-flex align-items-center justify-content-center rounded p-2 me-3 shadow-sm" 
                        style={{
                          background: index === 0 ? 'linear-gradient(135deg, #3B82F6, #06B6D4)' :
                                    index === 1 ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' :
                                    index === 2 ? 'linear-gradient(135deg, #F59E0B, #EF4444)' :
                                    'linear-gradient(135deg, #10B981, #14B8A6)',
                          width: '48px',
                          height: '48px'
                        }}
                      >
                        <Icon className="text-white" size={24} />
                      </div>
                      <h3 className="fs-4 fw-bold mb-0">{category.category}</h3>
                    </div>

                    <div className="overflow-auto custom-scrollbar" style={{ maxHeight: '320px' }}>
                      {category.courses.map((course, idx) => (
                        <div
                          key={idx}
                          className="d-flex align-items-start mb-2 p-2 bg-light rounded course-item"
                        >
                          <div 
                            className="rounded-circle me-2 mt-2 flex-shrink-0"
                            style={{ 
                              width: '8px', 
                              height: '8px',
                              background: index === 0 ? 'linear-gradient(135deg, #3B82F6, #06B6D4)' :
                                        index === 1 ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' :
                                        index === 2 ? 'linear-gradient(135deg, #F59E0B, #EF4444)' :
                                        'linear-gradient(135deg, #10B981, #14B8A6)',
                            }}
                          ></div>
                          <span className="text-secondary">{course}</span>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}