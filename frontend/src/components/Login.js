import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Card, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', isRegister: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    if (form.isRegister) {
      if (!form.name || form.name.length < 3) {
        errors.name = "Name must be at least 3 characters";
      }
      
      if (form.password !== form.confirmPassword) {
        errors.confirmPassword = "Passwords don't match";
      }
    }
    
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!form.password ){
      errors.password = "Password Required!";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear specific field error when user starts typing again
    if (formErrors[name]) {
      setFormErrors({...formErrors, [name]: ''});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (form.isRegister) {
        await register(form);
        setSuccess('Registration successful! Redirecting to dashboard...');
      } else {
        await login(form);
        setSuccess('Login successful! Redirecting to dashboard...');
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000); // Small delay for user to see success message
      
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isRegister: !form.isRegister
    });
    setError('');
    setSuccess('');
    setFormErrors({});
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      x: "-100vw",
      transition: { ease: "easeInOut" }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2,
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="py-5"
    >
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col lg={5} md={8} sm={10}>
            <motion.div variants={formVariants}>
              <Card className="border-0 shadow-lg">
                <Card.Header className="bg-primary-gradient text-white text-center py-4">
                  <h3 className="mb-0">
                    {form.isRegister ? 'Create Your Account' : 'Welcome Back'}
                  </h3>
                </Card.Header>
                <Card.Body className="p-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant="danger">
                        <i className="fas fa-exclamation-circle me-2"></i>
                        {error}
                      </Alert>
                    </motion.div>
                  )}
                  
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant="success">
                        <i className="fas fa-check-circle me-2"></i>
                        {success}
                      </Alert>
                    </motion.div>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    {form.isRegister && (
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <InputGroup hasValidation>
                          <InputGroup.Text>
                            <i className="fas fa-user"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            isInvalid={!!formErrors.name}
                            className="border-start-0"
                          />
                          {formErrors.name && (
                            <Form.Control.Feedback type="invalid">
                              {formErrors.name}
                            </Form.Control.Feedback>
                          )}
                        </InputGroup>
                      </Form.Group>
                    )}
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Email address</Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text>
                          <i className="fas fa-envelope"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={form.email}
                          onChange={handleChange}
                          isInvalid={!!formErrors.email}
                          className="border-start-0"
                        />
                        {formErrors.email && (
                          <Form.Control.Feedback type="invalid">
                            {formErrors.email}
                          </Form.Control.Feedback>
                        )}
                      </InputGroup>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text>
                          <i className="fas fa-lock"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          value={form.password}
                          onChange={handleChange}
                          isInvalid={!!formErrors.password}
                          className="border-start-0 border-end-0"
                        />
                        <Button 
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          className="border-start-0"
                        >
                          <i className={`fas fa-${showPassword ? "eye-slash" : "eye"}`}></i>
                        </Button>
                        {formErrors.password && (
                          <Form.Control.Feedback type="invalid">
                            {formErrors.password}
                          </Form.Control.Feedback>
                        )}
                      </InputGroup>
                    </Form.Group>
                    
                    {form.isRegister && (
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup hasValidation>
                          <InputGroup.Text>
                            <i className="fas fa-lock"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            isInvalid={!!formErrors.confirmPassword}
                            className="border-start-0"
                          />
                          {formErrors.confirmPassword && (
                            <Form.Control.Feedback type="invalid">
                              {formErrors.confirmPassword}
                            </Form.Control.Feedback>
                          )}
                        </InputGroup>
                      </Form.Group>
                    )}
                    
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 py-2 mt-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {form.isRegister ? 'Creating Account...' : 'Logging In...'}
                        </>
                      ) : (
                        form.isRegister ? 'Sign Up' : 'Sign In'
                      )}
                    </Button>
                    
                    {!form.isRegister && (
                      <div className="text-center mt-3">
                        <Link to="/forgot-password" className="text-decoration-none">
                          <small>Forgot your password?</small>
                        </Link>
                      </div>
                    )}
                  </Form>
                </Card.Body>
                <Card.Footer className="bg-white text-center py-3 border-0">
                  <p className="mb-0">
                    {form.isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <Button
                      variant="link"
                      className="ms-1 p-0"
                      onClick={toggleForm}
                    >
                      {form.isRegister ? 'Sign In' : 'Sign Up'}
                    </Button>
                  </p>
                </Card.Footer>
              </Card>
              
              <div className="text-center mt-4">
                <Link to="/" className="text-decoration-none">
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Home
                </Link>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Login;
