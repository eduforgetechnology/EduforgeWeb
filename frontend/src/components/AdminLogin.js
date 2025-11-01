import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/adminLogin.css';

const AdminLogin = () => {
  const { user, setAuthData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If user is already logged in as admin, redirect to admin panel
  if (user && user.role === 'admin') {
    return <Navigate to="/admin-panel" replace />;
  }

  // If user is logged in but not admin, show access denied
  if (user && user.role !== 'admin') {
    return (
      <div className="admin-login-container">
        <Container>
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col md={6}>
              <Card className="admin-login-card">
                <Card.Body className="text-center p-5">
                  <div className="admin-access-denied">
                    <i className="fas fa-shield-alt fa-4x text-danger mb-4"></i>
                    <h3 className="text-danger">Access Denied</h3>
                    <p className="text-muted mb-4">
                      You don't have administrator privileges to access this area.
                    </p>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => window.location.href = '/'}
                    >
                      Go to Homepage
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/auth/login`, formData);

      // Backend returns: { _id, name, email, role, token }
      if (response.data && response.data.role === 'admin') {
        const userData = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        };
        setAuthData(userData, response.data.token);
        // Redirect will happen automatically via Navigate component
      } else if (response.data && response.data.role !== 'admin') {
        setError('Access denied. Administrator privileges required.');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={5}>
            <Card className="admin-login-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="admin-logo">
                    <i className="fas fa-shield-halved fa-3x text-primary mb-3"></i>
                  </div>
                  <h2 className="admin-title">Administrator Login</h2>
                  <p className="text-muted">Access the admin control panel</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="admin-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter admin email"
                      className="admin-input"
                      required
                      autoFocus
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="admin-label">
                      <i className="fas fa-lock me-2"></i>
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter admin password"
                      className="admin-input"
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="admin-login-btn w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Login to Admin Panel
                      </>
                    )}
                  </Button>
                </Form>

                <div className="admin-footer mt-4 text-center">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Authorized personnel only
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;