import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../styles/privacy-notification.css';

const PrivacyNotification = () => {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted the privacy policy
    const policyAccepted = localStorage.getItem('privacyPolicyAccepted');
    if (!policyAccepted) {
      // If not accepted, show the notification banner
      setShowBanner(true);
    }
  }, []);
  
  const handleAccept = () => {
    // Save to localStorage that user accepted the privacy policy
    localStorage.setItem('privacyPolicyAccepted', 'true');
    // Hide the banner
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="privacy-notification-banner">
      <Container>
        <Row className="align-items-center">
          <Col md={8} sm={12}>
            <p className="mb-md-0 mb-3">
              This website uses cookies to ensure you get the best experience. By continuing to use this site, you consent to our <Link to="/privacy" className="notification-link">Privacy Policy</Link> and <Link to="/terms" className="notification-link">Terms of Service</Link>.
            </p>
          </Col>
          <Col md={4} sm={12} className="text-md-end text-center">
            <Button 
              variant="light" 
              className="accept-button me-2"
              onClick={handleAccept}
            >
              Accept
            </Button>
            <Link to="/privacy">
              <Button variant="outline-light" className="learn-more-button">
                Learn More
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivacyNotification;