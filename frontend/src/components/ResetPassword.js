import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    hasNumber: false,
    hasLower: false,
    hasUpper: false,
    hasSpecial: false
  });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ;

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  useEffect(() => {
    // Validate password as user types
    setPasswordValidation({
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (!doPasswordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div className={`d-flex align-items-center mb-1 ${isValid ? 'text-success' : 'text-muted'}`}>
      {isValid ? <FaCheck className="me-2" size={12} /> : <FaTimes className="me-2" size={12} />}
      <small>{text}</small>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (!token && !error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="reset-password-page" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary mb-2">Reset Password</h2>
                    <p className="text-muted">
                      Create a new secure password for your account
                    </p>
                  </div>

                  {error && (
                    <Alert variant="danger" className="mb-3">
                      {error}
                    </Alert>
                  )}

                  {message && (
                    <Alert variant="success" className="mb-3">
                      {message}
                    </Alert>
                  )}

                  {token && (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">New Password</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ 
                              padding: '12px 15px',
                              borderRadius: '10px 0 0 10px',
                              border: '2px solid #e9ecef',
                              fontSize: '16px'
                            }}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              borderRadius: '0 10px 10px 0',
                              border: '2px solid #e9ecef',
                              borderLeft: 'none'
                            }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </InputGroup>
                        
                        {/* Password Requirements */}
                        <div className="mt-2 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                          <small className="fw-semibold text-muted mb-2 d-block">Password Requirements:</small>
                          <ValidationItem 
                            isValid={passwordValidation.length} 
                            text="At least 8 characters long" 
                          />
                          <ValidationItem 
                            isValid={passwordValidation.hasLower} 
                            text="Contains lowercase letter (a-z)" 
                          />
                          <ValidationItem 
                            isValid={passwordValidation.hasUpper} 
                            text="Contains uppercase letter (A-Z)" 
                          />
                          <ValidationItem 
                            isValid={passwordValidation.hasNumber} 
                            text="Contains number (0-9)" 
                          />
                          <ValidationItem 
                            isValid={passwordValidation.hasSpecial} 
                            text="Contains special character (!@#$%^&*)" 
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ 
                              padding: '12px 15px',
                              borderRadius: '10px 0 0 10px',
                              border: `2px solid ${confirmPassword && !doPasswordsMatch ? '#dc3545' : '#e9ecef'}`,
                              fontSize: '16px'
                            }}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                              borderRadius: '0 10px 10px 0',
                              border: `2px solid ${confirmPassword && !doPasswordsMatch ? '#dc3545' : '#e9ecef'}`,
                              borderLeft: 'none'
                            }}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </InputGroup>
                        {confirmPassword && (
                          <div className={`mt-1 d-flex align-items-center ${doPasswordsMatch ? 'text-success' : 'text-danger'}`}>
                            {doPasswordsMatch ? <FaCheck className="me-1" size={12} /> : <FaTimes className="me-1" size={12} />}
                            <small>{doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}</small>
                          </div>
                        )}
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100 fw-semibold"
                        disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          background: isPasswordValid && doPasswordsMatch 
                            ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                            : '#6c757d',
                          border: 'none',
                          fontSize: '16px'
                        }}
                      >
                        {isLoading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              className="me-2"
                            />
                            Resetting Password...
                          </>
                        ) : (
                          'Reset Password'
                        )}
                      </Button>
                    </Form>
                  )}

                  <div className="text-center mt-4">
                    <Link 
                      to="/login" 
                      className="text-decoration-none fw-semibold"
                      style={{ color: '#667eea' }}
                    >
                      ← Back to Login
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;