import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'otp', 'success'
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setStep('otp');
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetToken(data.resetToken);
        setMessage('OTP verified successfully! Redirecting to password reset...');
        setTimeout(() => {
          window.location.href = `/reset-password?token=${data.resetToken}`;
        }, 2000);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('New OTP sent to your email!');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="forgot-password-page" style={{ 
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
                    <h2 className="fw-bold text-primary mb-2">
                      {step === 'email' ? 'Forgot Password' : 'Verify OTP'}
                    </h2>
                    <p className="text-muted">
                      {step === 'email' 
                        ? 'Enter your email address to receive a password reset code'
                        : 'Enter the 6-digit code sent to your email'
                      }
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

                  {step === 'email' && (
                    <Form onSubmit={handleEmailSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter your registered email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{ 
                            padding: '12px 15px',
                            borderRadius: '10px',
                            border: '2px solid #e9ecef',
                            fontSize: '16px'
                          }}
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100 fw-semibold"
                        disabled={isLoading}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
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
                            Sending...
                          </>
                        ) : (
                          'Send Reset Code'
                        )}
                      </Button>
                    </Form>
                  )}

                  {step === 'otp' && (
                    <Form onSubmit={handleOTPSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Enter OTP</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          required
                          maxLength={6}
                          style={{ 
                            padding: '12px 15px',
                            borderRadius: '10px',
                            border: '2px solid #e9ecef',
                            fontSize: '18px',
                            textAlign: 'center',
                            letterSpacing: '3px'
                          }}
                        />
                        <Form.Text className="text-muted">
                          Code sent to: {email}
                        </Form.Text>
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100 fw-semibold mb-3"
                        disabled={isLoading || otp.length !== 6}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
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
                            Verifying...
                          </>
                        ) : (
                          'Verify OTP'
                        )}
                      </Button>

                      <div className="text-center">
                        <span className="text-muted">Didn't receive the code? </span>
                        <Button
                          variant="link"
                          className="p-0 fw-semibold"
                          onClick={resendOTP}
                          disabled={isLoading}
                          style={{ textDecoration: 'none' }}
                        >
                          Resend OTP
                        </Button>
                      </div>
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

export default ForgotPassword;