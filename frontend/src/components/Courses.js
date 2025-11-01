import React, { useEffect, useState, useContext, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Modal, Form, Badge, Spinner, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import PaymentModal from './PaymentModal';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollingCourses, setEnrollingCourses] = useState(new Set());
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useContext(AuthContext);
  const courseRef = useRef(null);

  // Categories for filtering (in real app, these would come from backend)
  const predefinedCategories = [
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

  const loadCourses = useCallback(async (page = 1, reset = false) => {
    setLoading(true);
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://eduforge-web.vercel.app';
    
    try {
      // Check cache first
      const cacheKey = `courses_${page}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      
      if (cachedData && !reset) {
        const { courses: cachedCourses, timestamp } = JSON.parse(cachedData);
        // Use cache if it's less than 5 minutes old
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          if (reset) {
            setCourses(cachedCourses);
          } else {
            setCourses(prevCourses => [...prevCourses, ...cachedCourses]);
          }
          setLoading(false);
          return;
        }
      }

      const response = await axios.get(`${apiUrl}/api/courses?page=${page}&limit=8`);
      const { courses: newCourses, currentPage, totalPages: totalPgs } = response.data;
      
      // Process courses efficiently
      const processedCourses = newCourses.map(course => ({
        ...course,
        rating: course.rating || "4.5",
        students: course.students?.length || Math.floor(Math.random() * 100) + 50,
        category: course.category || "Institute",
        level: course.level || "All Levels"
      }));
      
      // Cache the results
      sessionStorage.setItem(cacheKey, JSON.stringify({
        courses: processedCourses,
        timestamp: Date.now()
      }));

      if (reset) {
        setCourses(processedCourses);
      } else {
        setCourses(prevCourses => [...prevCourses, ...processedCourses]);
      }
      
      setTotalPages(totalPgs);
      setCurrentPage(currentPage);
      setHasMore(currentPage < totalPgs);
      setLoading(false);
    } catch (err) {
      console.error('Error loading courses:', err);
      setMessage('Error loading courses. Please try again later.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses(1, true);
    
    // Cache cleanup when component unmounts
    return () => {
      setCourses([]);
      setFilteredCourses([]);
    };
  }, [loadCourses]);

  // Optimized debounce implementation with proper cleanup
  const debounce = useCallback((func, wait) => {
    let timeoutId = null;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(null, args);
        timeoutId = null;
      }, wait);
    };
  }, []);

  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchTerm(value.trim()); // Trim whitespace for more accurate searching
    }, 400), // Increased slightly for better performance
    [debounce]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      const searchInput = document.querySelector('input[aria-label="Search courses"]');
      if (searchInput) {
        searchInput.value = '';
      }
    };
  }, []);
  
  // Memoize filtering to improve performance
  const filteredAndSortedCourses = useMemo(() => {
    if (loading || !courses.length) return [];

    // Create a cached search term to avoid repeated toLowerCase() calls
    const searchTermLower = searchTerm.toLowerCase();
    const isAllCategory = !filter || filter.toLowerCase() === 'all';
    
    // Create a filtered array using efficient conditions
    const filtered = courses.filter(course => {
      // Exit early if possible
      if (!isAllCategory && course.category !== filter) return false;
      
      // If no search term and category matches, include the course
      if (!searchTerm) return true;
      
      // Search in relevant fields
      const titleMatch = course.title?.toLowerCase().includes(searchTermLower);
      if (titleMatch) return true; // Exit early if title matches
      
      const descMatch = course.description?.toLowerCase().includes(searchTermLower);
      if (descMatch) return true; // Exit early if description matches
      
      return course.educator?.name?.toLowerCase().includes(searchTermLower);
    });

    // Sort courses only if needed
    if (sortBy === 'none' || filtered.length <= 1) return filtered;

    // Use efficient sorting
    const sortedCourses = [...filtered]; // Create copy only when sorting
    
    // Use optimized comparison functions
    const sortFunctions = {
      newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      oldest: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      name_asc: (a, b) => (a.title || '').localeCompare(b.title || ''),
      name_desc: (a, b) => (b.title || '').localeCompare(a.title || ''),
      popular: (a, b) => (b.students || 0) - (a.students || 0)
    };

    return sortedCourses.sort(sortFunctions[sortBy] || sortFunctions.newest);
  }, [courses, searchTerm, filter, sortBy, loading]);

  // Update filteredCourses when the memoized result changes
  useEffect(() => {
    setFilteredCourses(filteredAndSortedCourses);
  }, [filteredAndSortedCourses]);

  const handleEnroll = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    if (course) {
      setSelectedCourse(course);
      setShowPaymentModal(true);
    }
  };

  const handleEnrollmentSuccess = (enrollmentData) => {
    setMessage(`Successfully enrolled in ${enrollmentData.courseTitle}!`);
    
    // Update UI to show enrolled status
    setCourses(prev => 
      prev.map(course => 
        course._id === enrollmentData.courseId ? { ...course, enrolled: true } : course
      )
    );
    
    setTimeout(() => setMessage(''), 5000);
  };

  const handleShowModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  // Removed automatic scroll behavior that interferes with button clicks

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      y: -10,
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
                <h1 className="display-4 fw-bold mb-4 text-white">Expand Your Knowledge</h1>
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
                      defaultValue={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
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
          {loading && currentPage === 1 ? (
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
                        
                        <Card.Title className="mb-2">{course.title || 'Untitled Course'}</Card.Title>
                        <Card.Text className="text-muted small mb-3">
                          {course.description ? course.description.substring(0, 100) : 'No description available'}
                          {course.description && course.description.length > 100 ? '...' : ''}
                        </Card.Text>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center">
                            <span className="h5 mb-0 text-primary fw-bold">
                              {course.price === 0 ? 'FREE' : `₹${course.price}`}
                            </span>
                          </div>
                          <div className="text-end">
                            <small className="text-muted d-block">{course.duration || '6 weeks'}</small>
                            <small className="text-muted">{course.gradeRange || 'All Levels'}</small>
                          </div>
                        </div>
                        
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
                              {course.educator?.name?.charAt(0) || 'T'}
                            </div>
                            <small className="text-muted">{course.educator?.name || 'Instructor'}</small>
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
                              disabled={enrollingCourses.has(course._id)}
                            >
                              {enrollingCourses.has(course._id) ? (
                                <>
                                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                  <span className="ms-2">Enrolling...</span>
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-graduation-cap me-1"></i> 
                                  {course.price === 0 ? 'Enroll Free' : `Enroll - ₹${course.price}`}
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
        
        {/* Load More Button */}
        {filteredCourses.length > 0 && hasMore && (
          <div className="text-center mt-4 mb-5">
            <Button 
              variant="outline-primary" 
              size="lg" 
              onClick={() => loadCourses(currentPage + 1)} 
              disabled={loading}
              className="px-5"
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Loading...
                </>
              ) : (
                'Load More Courses'
              )}
            </Button>
          </div>
        )}
      </Container>

      {/* Course Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>{selectedCourse?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6} className="mb-3">
              <LazyLoadImage
                src={selectedCourse?.imageUrl || `https://source.unsplash.com/600x400/?education,${selectedCourse?._id}`}
                alt={selectedCourse?.title}
                effect="blur"
                className="img-fluid rounded mb-3 w-100"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
                placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23cccccc'/%3E%3C/svg%3E"
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
                        {lesson?.title || `Lesson ${idx + 1}`}
                      </h6>
                      <small className="text-muted">{(idx + 1) * 15} minutes</small>
                    </div>
                    <Badge bg={idx === 0 ? 'success' : 'secondary'}>
                      {idx === 0 ? 'Free Preview' : 'Premium'}
                    </Badge>
                  </div>
                  {idx === 0 && (
                    <p className="mb-0 mt-2 small">
                      {lesson?.content || 'Course content preview will be available here.'}
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
              onClick={() => handleEnroll(selectedCourse._id)}
              disabled={enrollingCourses.has(selectedCourse._id)}
            >
              <i className="fas fa-graduation-cap me-2"></i>
              {enrollingCourses.has(selectedCourse._id) ? 'Enrolling...' : 'Enroll Now'}
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

      {/* Payment Modal */}
      <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        course={selectedCourse}
        onEnrollmentSuccess={handleEnrollmentSuccess}
      />
    </div>
  );
};

export default Courses;
