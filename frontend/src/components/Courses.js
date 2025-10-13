import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Modal, Form, Badge, Spinner, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const { user } = useContext(AuthContext);
  const courseRef = useRef(null);

  // Categories for filtering (in real app, these would come from backend)
  const courseCategories = [
    'All', 
    'Development', 
    'Business', 
    'Design',
    'Marketing',
    'Personal Growth',
    'Photography',
    'Music',
    'Health & Fitness'
  ];

  useEffect(() => {
    // Extract unique categories from courses
    if (courses.length > 0) {
      const uniqueCategories = [...new Set(courses.map(course => course.category || 'Personal Growth'))];
      setCategories(['All', ...uniqueCategories]);
    }
  }, [courses]);

  useEffect(() => {
    setLoading(true);
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    
    axios.get(`${apiUrl}/api/courses`)
      .then(res => {
        // Add categories based on course content/title
        const coursesWithCategories = res.data.map((course, index) => {
          if (!course.category) {
            // Determine category based on course title
            let category;
            const title = course.title?.toLowerCase() || "";
            
            if (title.includes("javascript") || 
                title.includes("node") || 
                title.includes("react") || 
                title.includes("angular") || 
                title.includes("vue") || 
                title.includes("python") || 
                title.includes("java") || 
                title.includes("c++") || 
                title.includes("programming")) {
              category = "Development";
            } 
            else if (title.includes("marketing") ||
                     title.includes("seo") ||
                     title.includes("social media")) {
              category = "Marketing";
            }
            else if (title.includes("design") ||
                     title.includes("ui") ||
                     title.includes("ux") ||
                     title.includes("photoshop") ||
                     title.includes("illustrator")) {
              category = "Design";
            }
            else if (title.includes("business") ||
                     title.includes("management") ||
                     title.includes("leadership") ||
                     title.includes("entrepreneur")) {
              category = "Business";
            }
            else if (title.includes("photo") ||
                     title.includes("camera")) {
              category = "Photography";
            }
            else if (title.includes("music") ||
                     title.includes("guitar") ||
                     title.includes("piano")) {
              category = "Music";
            }
            else if (title.includes("health") ||
                     title.includes("fitness") ||
                     title.includes("yoga")) {
              category = "Health & Fitness";
            }
            else {
              category = "Personal Growth";
            }
            
            return {
              ...course, 
              category: category,
              rating: (3 + Math.random() * 2).toFixed(1),
              students: Math.floor(Math.random() * 1000) + 50,
              level: ['Beginner', 'Intermediate', 'Advanced'][index % 3]
            };
          }
          return course;
        });
        
        setCourses(coursesWithCategories);
        setFilteredCourses(coursesWithCategories);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading courses:', err);
        setMessage('Error loading courses. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...courses];
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.educator.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filter && filter !== 'all' && filter !== 'All') {
      result = result.filter(course => 
        course.category === filter
      );
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'newest':
        // Assuming _id is a MongoDB ObjectId which contains a timestamp
        result.sort((a, b) => b._id.localeCompare(a._id));
        break;
      case 'oldest':
        result.sort((a, b) => a._id.localeCompare(b._id));
        break;
      case 'name_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name_desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'popular':
        result.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
      default:
        break;
    }
    
    setFilteredCourses(result);
  }, [searchTerm, filter, sortBy, courses]);

  const handleEnroll = async (id) => {
    if (enrolling) return;
    
    setEnrolling(true);
    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/courses/${id}/enroll`);
      
      setMessage('You have successfully enrolled in this course!');
      
      // Update UI to show enrolled status
      setCourses(prev => 
        prev.map(course => 
          course._id === id ? { ...course, enrolled: true } : course
        )
      );
      
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setMessage(err.response?.data?.message || 'Error enrolling in course. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleShowModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  // Scroll to courses section when filtering
  useEffect(() => {
    if (!loading && filter !== 'all' && courseRef.current) {
      courseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [filter, loading]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const courseCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const getCourseLevelBadge = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'danger';
      default:
        return 'info';
    }
  };

  // Generate skeleton loaders for loading state
  const renderSkeletons = () => {
    return Array(6).fill().map((_, i) => (
      <Col md={4} key={`skeleton-${i}`} className="mb-4">
        <Card className="h-100 shadow">
          <div className="skeleton-img" style={{ height: '200px', background: '#e9ecef' }}></div>
          <Card.Body>
            <div className="skeleton-line w-75 mb-3"></div>
            <div className="skeleton-line w-100 mb-2"></div>
            <div className="skeleton-line w-100 mb-2"></div>
            <div className="skeleton-line w-50 mb-4"></div>
            <div className="d-flex justify-content-between">
              <div className="skeleton-button w-40"></div>
              <div className="skeleton-button w-40"></div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  return (
    <div className="courses-page">
      {/* Hero Section */}
      <div className="bg-primary-gradient text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="display-4 fw-bold mb-4">Expand Your Knowledge</h1>
                <p className="lead mb-4">
                  Browse our wide range of courses in electronics, robotics, and computer science.
                  Learn at your own pace and advance your skills with expert guidance.
                </p>
                <Form onSubmit={(e) => e.preventDefault()}>
                  <InputGroup className="mb-3 search-large">
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="What do you want to learn today?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search courses"
                    />
                    <Button variant="light">
                      <i className="fas fa-search"></i>
                    </Button>
                  </InputGroup>
                </Form>
              </motion.div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="courses-hero-graphic d-flex align-items-center justify-content-center"
              >
                <div className="course-hero-icons text-center">
                  <div className="course-icon-large">
                    <i className="fas fa-graduation-cap fa-4x text-white"></i>
                  </div>
                  <div className="d-flex justify-content-center mt-4 gap-4">
                    <div className="course-icon-small">
                      <i className="fas fa-laptop-code fa-2x"></i>
                    </div>
                    <div className="course-icon-small">
                      <i className="fas fa-book fa-2x"></i>
                    </div>
                    <div className="course-icon-small">
                      <i className="fas fa-robot fa-2x"></i>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container ref={courseRef} className="mb-5">
        {/* Filter Section */}
        <Row className="mb-4">
          <Col md={8}>
            <div className="d-flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge 
                    bg={filter === category.toLowerCase() ? "primary" : "light"} 
                    text={filter === category.toLowerCase() ? "white" : "dark"}
                    className="category-badge px-3 py-2 me-2 mb-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setFilter(category === 'All' ? 'all' : category)}
                  >
                    {category}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Col>
          <Col md={4}>
            <div className="d-flex align-items-center justify-content-md-end">
              <span className="me-2 text-muted">Sort by:</span>
              <DropdownButton 
                variant="outline-secondary"
                title={
                  sortBy === 'newest' ? 'Newest' :
                  sortBy === 'oldest' ? 'Oldest' :
                  sortBy === 'name_asc' ? 'Name (A-Z)' :
                  sortBy === 'name_desc' ? 'Name (Z-A)' :
                  sortBy === 'popular' ? 'Most Popular' : 'Sort by'
                }
                size="sm"
              >
                <Dropdown.Item onClick={() => setSortBy('newest')}>Newest</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('oldest')}>Oldest</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('name_asc')}>Name (A-Z)</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('name_desc')}>Name (Z-A)</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('popular')}>Most Popular</Dropdown.Item>
              </DropdownButton>
            </div>
          </Col>
        </Row>

        {/* Alert Messages */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert 
                variant={message.includes('success') ? 'success' : 'danger'}
                dismissible
                onClose={() => setMessage('')}
              >
                <i className={`fas fa-${message.includes('success') ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
                {message}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Course Listings */}
        <Row>
          {loading ? (
            renderSkeletons()
          ) : filteredCourses.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="row"
            >
              {filteredCourses.map((course, index) => (
                <Col md={4} key={course._id || index} className="mb-4">
                  <motion.div
                    variants={courseCardVariants}
                    whileHover={{ scale: 1.03 }}
                    className="h-100"
                  >
                    <Card className="h-100 border-0 shadow-sm course-card">
                      <div className="position-relative">
                        <div 
                          className="course-header d-flex align-items-center justify-content-between p-3"
                          style={{ 
                            background: index % 3 === 0 
                              ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' 
                              : index % 3 === 1 
                                ? 'linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)' 
                                : 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                            height: '120px',
                            borderTopLeftRadius: 'calc(0.375rem - 1px)',
                            borderTopRightRadius: 'calc(0.375rem - 1px)'
                          }}
                        >
                          <div>
                            <Badge bg={getCourseLevelBadge(course.level)} className="px-2 py-1">
                              {course.level || 'All Levels'}
                            </Badge>
                            
                            <div className="mt-2">
                              <i className={`fas fa-${
                                course.category === 'Development' ? 'laptop-code' :
                                course.category === 'Business' ? 'briefcase' :
                                course.category === 'Design' ? 'paint-brush' :
                                course.category === 'Marketing' ? 'bullhorn' :
                                course.category === 'Photography' ? 'camera' :
                                course.category === 'Music' ? 'music' :
                                course.category === 'Health & Fitness' ? 'heartbeat' : 'book'
                              } fa-2x text-white`}></i>
                            </div>
                          </div>
                          
                          {course.enrolled && (
                            <div>
                              <Badge bg="success" className="px-2 py-1">
                                <i className="fas fa-check me-1"></i> Enrolled
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Badge bg="light" text="dark" className="category-badge">
                            {course.category || (index % 3 === 0 ? 'Electronics' : index % 3 === 1 ? 'Robotics' : 'Programming')}
                          </Badge>
                          <div className="d-flex align-items-center">
                            <i className="fas fa-star text-warning me-1"></i>
                            <small>{course.rating || (3 + (index % 2)).toFixed(1)}</small>
                          </div>
                        </div>
                        
                        <Card.Title className="mb-2">{course.title}</Card.Title>
                        <Card.Text className="text-muted small mb-3">
                          {course.description.substring(0, 100)}
                          {course.description.length > 100 ? '...' : ''}
                        </Card.Text>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center">
                            <div className="educator-avatar me-2" style={{ 
                              width: '24px', 
                              height: '24px', 
                              borderRadius: '50%', 
                              backgroundColor: `rgba(99, 102, 241, ${0.3 + (index % 5) * 0.1})`,
                              color: '#4263eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              {course.educator.name.charAt(0)}
                            </div>
                            <small className="text-muted">{course.educator.name}</small>
                          </div>
                          <small className="text-muted">
                            <i className="fas fa-users me-1"></i> 
                            {course.students || Math.floor(Math.random() * 1000) + 50}
                          </small>
                        </div>
                        
                        <div className="d-flex justify-content-between">
                          <Button 
                            variant="outline-primary" 
                            onClick={() => handleShowModal(course)}
                            className="flex-grow-1 me-2"
                          >
                            <i className="fas fa-info-circle me-1"></i> Details
                          </Button>
                          {user && user.role === 'student' && !course.enrolled && (
                            <Button 
                              variant="primary" 
                              onClick={() => handleEnroll(course._id)}
                              className="flex-grow-1"
                              disabled={enrolling}
                            >
                              {enrolling ? (
                                <>
                                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                  <span className="ms-2">Enrolling...</span>
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-graduation-cap me-1"></i> Enroll
                                </>
                              )}
                            </Button>
                          )}
                          {user && user.role === 'student' && course.enrolled && (
                            <Button 
                              variant="success" 
                              className="flex-grow-1"
                            >
                              <i className="fas fa-play-circle me-1"></i> Continue
                            </Button>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </motion.div>
          ) : (
            <Col>
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h3>No courses found</h3>
                <p className="text-muted">Try adjusting your search or filter to find what you're looking for.</p>
                <Button variant="primary" onClick={() => {setSearchTerm(''); setFilter('all');}}>
                  Clear filters
                </Button>
              </div>
            </Col>
          )}
        </Row>
      </Container>

      {/* Course Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>{selectedCourse?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6} className="mb-3">
              <img
                src={selectedCourse?.imageUrl || `https://source.unsplash.com/600x400/?education,${selectedCourse?._id}`}
                alt={selectedCourse?.title}
                className="img-fluid rounded mb-3 w-100"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Badge bg="primary" className="px-3 py-2">
                  {selectedCourse?.category || 'Technology'}
                </Badge>
                <div className="d-flex align-items-center">
                  <i className="fas fa-star text-warning me-1"></i>
                  <span>{selectedCourse?.rating || '4.5'}</span>
                  <span className="text-muted ms-2">({selectedCourse?.students || '250'} students)</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center mb-3">
                <img 
                  src={`https://i.pravatar.cc/150?img=20`} 
                  alt={selectedCourse?.educator?.name} 
                  className="rounded-circle me-2"
                  width="40" 
                  height="40"
                />
                <div>
                  <h6 className="mb-0">{selectedCourse?.educator?.name}</h6>
                  <small className="text-muted">Expert Educator</small>
                </div>
              </div>
            </Col>
            
            <Col md={6}>
              <h5 className="mb-3">About This Course</h5>
              <p>{selectedCourse?.description}</p>
              
              <div className="mb-4">
                <h6>What you'll learn:</h6>
                <ul className="course-benefits">
                  <li>Comprehensive understanding of {selectedCourse?.category || 'the subject'}</li>
                  <li>Practical skills applicable to real-world projects</li>
                  <li>Industry-standard best practices and techniques</li>
                  <li>Certification upon completion of all modules</li>
                </ul>
              </div>
              
              <div className="course-info-grid mb-4">
                <div>
                  <i className="fas fa-clock text-primary me-2"></i>
                  <span>Duration: {selectedCourse?.duration || '6 weeks'}</span>
                </div>
                <div>
                  <i className="fas fa-signal text-primary me-2"></i>
                  <span>Level: {selectedCourse?.level || 'Intermediate'}</span>
                </div>
                <div>
                  <i className="fas fa-video text-primary me-2"></i>
                  <span>{selectedCourse?.lessons?.length || '12'} lessons</span>
                </div>
                <div>
                  <i className="fas fa-certificate text-primary me-2"></i>
                  <span>Certificate included</span>
                </div>
              </div>
            </Col>
          </Row>
          
          <hr className="my-4" />
          
          <h5>Course Content</h5>
          <div className="course-content">
            {selectedCourse?.lessons && selectedCourse.lessons.length > 0 ? (
              selectedCourse.lessons.map((lesson, idx) => (
                <div key={idx} className="lesson-item p-3 mb-2 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">
                        <i className="fas fa-play-circle me-2 text-primary"></i>
                        {lesson.title}
                      </h6>
                      <small className="text-muted">{(idx + 1) * 15} minutes</small>
                    </div>
                    <Badge bg={idx === 0 ? 'success' : 'secondary'}>
                      {idx === 0 ? 'Free Preview' : 'Premium'}
                    </Badge>
                  </div>
                  {idx === 0 && (
                    <p className="mb-0 mt-2 small">
                      {lesson.content}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-3">
                <p className="text-muted">No lessons available for this course yet.</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {user && user.role === 'student' && selectedCourse && !selectedCourse.enrolled && (
            <Button 
              variant="primary" 
              onClick={() => {
                handleEnroll(selectedCourse._id);
                handleCloseModal();
              }}
              disabled={enrolling}
            >
              <i className="fas fa-graduation-cap me-2"></i>
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          )}
          {user && user.role === 'student' && selectedCourse && selectedCourse.enrolled && (
            <Button variant="success">
              <i className="fas fa-play me-2"></i>
              Continue Learning
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Courses;
