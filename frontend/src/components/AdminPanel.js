import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Modal, Spinner, Dropdown } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import '../styles/admin-dashboard.css';

const AdminPanel = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEducators: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLessonEditor, setShowLessonEditor] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);

  // Form states
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'Institute',
    level: 'Intermediate',
    price: '',
    duration: '12 weeks'
  });

  const [files, setFiles] = useState({
    thumbnail: null,
    video: null,
    ppt: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout();
      navigate('/'); // Redirect to homepage
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      
      const [coursesResponse, statsResponse] = await Promise.all([
        axios.get(`${apiUrl}/api/admin/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${apiUrl}/api/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setCourses(coursesResponse.data.courses || coursesResponse.data);
      setStats(statsResponse.data.stats || statsResponse.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/admin/courses`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: 100, // Fetch more courses at once
          sort: '-createdAt' // Sort by newest first
        }
      });
      
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else if (response.data.courses) {
        setCourses(response.data.courses);
      } else {
        setError('Invalid data format received from server');
        setCourses([]);
      }
      
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.response?.data?.message || 'Failed to fetch courses. Please try again.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      
      // Append files if they exist
      if (files.thumbnail) {
        formData.append('thumbnail', files.thumbnail);
      }
      if (files.video) {
        formData.append('video', files.video);
      }
      if (files.ppt) {
        formData.append('ppt', files.ppt);
      }

      const response = await axios.post(`${apiUrl}/api/admin/courses`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setCourses(prev => [...prev, response.data]);
      setShowModal(false);
      resetForm();
      setError('Course created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleAddLesson = async (courseId) => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const formData = new FormData();
      formData.append('title', 'New Lesson');
      formData.append('content', 'Lesson content here');
      formData.append('duration', '30');

      if (files.video) {
        formData.append('video', files.video);
      }
      if (files.ppt) {
        formData.append('ppt', files.ppt);
      }

      await axios.post(`${apiUrl}/api/admin/courses/${courseId}/lessons`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh courses to show new lesson
      await fetchCourses();
    } catch (err) {
      setError('Failed to add lesson');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCourseData({
      title: '',
      description: '',
      category: 'Institute',
      level: 'Intermediate',
      price: '',
      duration: '12 weeks'
    });
    setFiles({
      thumbnail: null,
      video: null,
      ppt: null
    });
  };

  const handleLessonSave = async (courseId, lessonId, formData, progressCallback) => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    const url = lessonId 
      ? `${apiUrl}/api/admin/courses/${courseId}/lessons/${lessonId}`
      : `${apiUrl}/api/admin/courses/${courseId}/lessons`;

    const method = lessonId ? 'put' : 'post';

    await axios({
      method,
      url,
      data: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (progressCallback) {
          progressCallback(percentCompleted);
        }
      }
    });

    await fetchCourses();
  };

  const handlePreview = (content) => {
    setPreviewContent(content);
    setShowPreviewModal(true);
  };

  const handleDeleteLesson = async (courseId, lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
        await axios.delete(`${apiUrl}/api/admin/courses/${courseId}/lessons/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchCourses();
        setError('Lesson deleted successfully!');
      } catch (err) {
        setError('Failed to delete lesson');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <div className="d-flex align-items-center">
          <h4 className="mb-0 me-4">EduForge Admin</h4>
        </div>
        <div className="d-flex align-items-center">
          {loading && <Spinner size="sm" className="me-3" />}
          
          {/* Admin User Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="link" 
              id="admin-dropdown" 
              className="text-white text-decoration-none border-0 bg-transparent"
            >
              <i className="fas fa-user-circle me-2"></i>
              {user?.name || 'Admin'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>
                <div className="fw-bold">{user?.name || 'Admin'}</div>
                <div className="text-muted small">{user?.email}</div>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav>
      
      <div className="admin-main-content">
        <Container fluid>
          {/* Dashboard Stats */}
          <Row className="mb-4">
            <Col sm={6} xl={3} className="mb-4">
              <Card className="admin-stat-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Total Courses</h6>
                      <h3 className="mb-0">{stats.totalCourses || courses.length}</h3>
                    </div>
                    <div className="stat-icon">
                      <i className="fas fa-graduation-cap"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} xl={3} className="mb-4">
              <Card className="admin-stat-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Total Students</h6>
                      <h3 className="mb-0">{stats.totalStudents}</h3>
                    </div>
                    <div className="stat-icon">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} xl={3} className="mb-4">
              <Card className="admin-stat-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Total Educators</h6>
                      <h3 className="mb-0">{stats.totalEducators}</h3>
                    </div>
                    <div className="stat-icon">
                      <i className="fas fa-chalkboard-teacher"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} xl={3} className="mb-4">
              <Card className="admin-stat-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Total Revenue</h6>
                      <h3 className="mb-0">₹{stats.totalRevenue}</h3>
                    </div>
                    <div className="stat-icon">
                      <i className="fas fa-rupee-sign"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4 align-items-center">
        <Col xs={12} md>
          <h2 className="mb-0">Admin Dashboard</h2>
          <p className="text-muted mb-md-0">
            {loading ? 'Loading courses...' : `${courses.length} courses available`}
          </p>
        </Col>
        <Col xs={12} md="auto">
          <Button 
            variant="primary" 
            onClick={() => setShowModal(true)} 
            className="me-2"
            disabled={loading}
          >
            <i className="fas fa-plus me-2"></i>
            Add New Course
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={fetchCourses} 
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert 
          variant={error.includes('success') ? 'success' : 'danger'} 
          dismissible 
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading courses...</p>
        </div>
      )}

      {/* Courses Table */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table className="table-hover mb-0">
            <thead>
              <tr>
                <th className="ps-4">Title</th>
                <th>Category</th>
                <th>Level</th>
                <th>Price</th>
                <th className="text-center">Lessons</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && courses.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <p className="text-muted mb-0">No courses found</p>
                  </td>
                </tr>
              )}
              {courses.map(course => (
                <React.Fragment key={course._id}>
                  <tr>
                    <td>{course.title}</td>
                    <td>{course.category}</td>
                    <td>{course.level}</td>
                    <td>₹{course.price}</td>
                    <td>{course.lessons?.length || 0}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => {
                          setSelectedCourse(course);
                          setSelectedLesson(null);
                          setShowLessonEditor(true);
                        }}
                      >
                        Add Lesson
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setExpandedCourse(expandedCourse === course._id ? null : course._id)}
                      >
                        {expandedCourse === course._id ? 'Hide Lessons' : 'Show Lessons'}
                      </Button>
                    </td>
                  </tr>
                  {expandedCourse === course._id && course.lessons && (
                    <tr>
                      <td colSpan="6">
                        <div className="ps-4">
                          <h6 className="mb-3">Course Lessons</h6>
                          <div className="lesson-list">
                            {course.lessons.map((lesson, index) => (
                              <Card key={lesson._id} className="mb-2">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <h6 className="mb-1">
                                      {index + 1}. {lesson.title}
                                    </h6>
                                    <small className="text-muted">
                                      Duration: {lesson.duration} minutes
                                    </small>
                                  </div>
                                  <div>
                                    {lesson.videoUrl && (
                                      <Button
                                        variant="link"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handlePreview({ type: 'video', url: lesson.videoUrl })}
                                      >
                                        <i className="fas fa-play"></i> Preview Video
                                      </Button>
                                    )}
                                    {lesson.pptUrl && (
                                      <Button
                                        variant="link"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handlePreview({ type: 'ppt', url: lesson.pptUrl })}
                                      >
                                        <i className="fas fa-file-powerpoint"></i> View PPT
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => {
                                        setSelectedCourse(course);
                                        setSelectedLesson(lesson);
                                        setShowLessonEditor(true);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => handleDeleteLesson(course._id, lesson._id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Course Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Course Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={courseData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Institute">Institute</option>
                    <option value="School">School</option>
                    <option value="Tech">Tech</option>
                    <option value="WSRO">WSRO</option>
                    <option value="Safety">Safety</option>
                    <option value="Challenge">Challenge</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Level</Form.Label>
                  <Form.Select
                    name="level"
                    value={courseData.level}
                    onChange={handleInputChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={courseData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    value={courseData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Course Thumbnail</Form.Label>
              <Form.Control
                type="file"
                name="thumbnail"
                onChange={handleFileChange}
                accept="image/*"
              />
            </Form.Group>

            {uploadProgress > 0 && (
              <div className="mb-3">
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Creating...
                  </>
                ) : (
                  'Create Course'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Preview Modal */}
      <Modal 
        show={showPreviewModal} 
        onHide={() => setShowPreviewModal(false)} 
        size="lg"
        className="preview-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Content Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="preview-content">
            {previewContent?.type === 'video' ? (
              <div className="video-container">
                <video controls>
                  <source src={previewContent.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : previewContent?.type === 'ppt' ? (
              <div className="video-container">
                <iframe
                  src={previewContent.url}
                  title="PPT Preview"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-muted mb-0">Preview not available</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Lesson Editor Modal */}
      <LessonEditor
        show={showLessonEditor}
        onHide={() => {
          setShowLessonEditor(false);
          setSelectedCourse(null);
          setSelectedLesson(null);
        }}
        course={selectedCourse}
        lesson={selectedLesson}
        onSave={handleLessonSave}
        uploadProgress={uploadProgress}
      />
        </Container>
      </div>
      
      {loading && (
        <div className="admin-loading-overlay">
          <div className="text-center">
            <Spinner animation="border" className="loading-spinner" />
            <p className="mt-2">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// LessonEditor Component
const LessonEditor = ({ show, onHide, course, lesson, onSave, uploadProgress }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    duration: 30,
    order: 1
  });
  const [files, setFiles] = useState({
    video: null,
    ppt: null
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        content: lesson.content || '',
        duration: lesson.duration || 30,
        order: lesson.order || 1
      });
    } else {
      setFormData({
        title: '',
        content: '',
        duration: 30,
        order: course?.lessons?.length + 1 || 1
      });
    }
    setFiles({ video: null, ppt: null });
  }, [lesson, course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!course) return;

    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('content', formData.content);
    submitFormData.append('duration', formData.duration);
    submitFormData.append('order', formData.order);

    if (files.video) {
      submitFormData.append('video', files.video);
    }
    if (files.ppt) {
      submitFormData.append('ppt', files.ppt);
    }

    onSave(
      course._id,
      lesson?._id,
      submitFormData,
      (progress) => {}
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="lesson-editor-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          {lesson ? 'Edit Lesson' : 'Add New Lesson'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Lesson Title *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter lesson title"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration (min)</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                      min="1"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Order</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                      min="1"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Lesson Content *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Describe what this lesson covers..."
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="fas fa-video me-2 text-primary"></i>
                  Video File
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setFiles({...files, video: e.target.files[0]})}
                  accept=".mp4,.avi,.mov,.wmv,.webm"
                />
                <Form.Text className="text-muted">
                  Upload video files (MP4, AVI, MOV, WMV, WebM) - Max 500MB
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="fas fa-file-powerpoint me-2 text-danger"></i>
                  Presentation/PDF File
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setFiles({...files, ppt: e.target.files[0]})}
                  accept=".pdf,.ppt,.pptx"
                />
                <Form.Text className="text-muted">
                  Upload PDF or PowerPoint files - Max 500MB
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {uploadProgress > 0 && (
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress">
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated" 
                  style={{width: `${uploadProgress}%`}}
                ></div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide} disabled={uploadProgress > 0}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={uploadProgress > 0}>
            {uploadProgress > 0 ? 'Uploading...' : (lesson ? 'Update Lesson' : 'Add Lesson')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AdminPanel;