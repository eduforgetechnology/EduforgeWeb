import React, { useState, useContext } from 'react';
import { Modal, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const PaymentModal = ({ show, onHide, course, onEnrollmentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, token } = useContext(AuthContext);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // Create payment order
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      
      const orderResponse = await axios.post(
        `${apiUrl}/api/payment/create-order`,
        { courseId: course._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const { orderId, amount, currency } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: 'rzp_test_your_key_id_here', // This should come from environment
        amount: amount,
        currency: currency,
        name: 'EduForge Technology',
        description: `Enrollment for ${course.title}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            setLoading(true);
            
            // Verify payment
            const verifyResponse = await axios.post(
              `${apiUrl}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course._id
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            if (verifyResponse.data.success) {
              setLoading(false);
              onHide();
              if (onEnrollmentSuccess) {
                onEnrollmentSuccess(verifyResponse.data.enrollment);
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (verifyError) {
            setLoading(false);
            setError('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', verifyError);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        notes: {
          course_id: course._id,
          course_name: course.title
        },
        theme: {
          color: '#6366F1'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment was cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || error.message || 'Payment failed. Please try again.');
      console.error('Payment error:', error);
    }
  };

  const handleFreeEnrollment = async () => {
    try {
      setLoading(true);
      setError('');

      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      
      // For free courses, we can directly enroll without payment
      const enrollResponse = await axios.post(
        `${apiUrl}/api/payment/verify`,
        {
          razorpay_order_id: 'free_enrollment',
          razorpay_payment_id: 'free_enrollment',
          razorpay_signature: 'free_enrollment',
          courseId: course._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (enrollResponse.data.success) {
        setLoading(false);
        onHide();
        if (onEnrollmentSuccess) {
          onEnrollmentSuccess(enrollResponse.data.enrollment);
        }
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Enrollment failed. Please try again.');
      console.error('Free enrollment error:', error);
    }
  };

  if (!course) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Enroll in Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="border-0">
          <Card.Body>
            <div className="d-flex align-items-start mb-4">
              <div 
                className="course-image-container me-3"
                style={{ 
                  width: '120px',
                  height: '120px',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {course.imageUrl || `https://source.unsplash.com/600x400/?education,${course._id}` ? (
                  <img 
                    src={course.imageUrl || `https://source.unsplash.com/600x400/?education,${course._id}`}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<i class="fas fa-graduation-cap fa-3x text-white"></i>';
                    }}
                  />
                ) : (
                  <i className="fas fa-graduation-cap fa-3x text-white"></i>
                )}
              </div>
              <div className="flex-grow-1">
                <h5 className="mb-2">{course.title}</h5>
                <p className="text-muted mb-2">
                  <i className="fas fa-building me-2"></i>
                  Institute • {course.level || 'Intermediate'}
                </p>
                <p className="text-muted mb-2">
                  <i className="fas fa-clock me-2"></i>
                  Duration: {course.duration || '12 weeks'}
                </p>
                <div className="d-flex align-items-center">
                  <span className="h4 mb-0 text-primary me-2">
                    {course.price === 0 ? 'FREE' : `₹${course.price || '899'}`}
                  </span>
                  <span className="text-muted">Lifetime access</span>
                </div>
              </div>
            </div>

            <div className="bg-light p-4 rounded mb-4">
              <h6 className="mb-3">What's included:</h6>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center">
                  <i className="fas fa-infinity text-primary me-3"></i>
                  <span>Lifetime access to course materials</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-certificate text-primary me-3"></i>
                  <span>Certificate of completion</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-project-diagram text-primary me-3"></i>
                  <span>Interactive lessons and practical projects</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-headset text-primary me-3"></i>
                  <span>Expert instructor support</span>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <div className="text-muted small mb-3">
              <p className="mb-2">
                <i className="fas fa-check-circle text-success me-2"></i>
                Lifetime access to course materials
              </p>
              <p className="mb-2">
                <i className="fas fa-check-circle text-success me-2"></i>
                Interactive lessons and practical projects
              </p>
              <p className="mb-0">
                <i className="fas fa-check-circle text-success me-2"></i>
                Certificate of completion
              </p>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        {course.price === 0 ? (
          <Button 
            variant="success" 
            onClick={handleFreeEnrollment} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                Enrolling...
              </>
            ) : (
              'Enroll for Free'
            )}
          </Button>
        ) : (
          <Button 
            variant="primary" 
            onClick={handlePayment} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                Processing...
              </>
            ) : (
              `Pay ₹${course.price} & Enroll`
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;