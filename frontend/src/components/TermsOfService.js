import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/terms.css';

const TermsOfService = () => {
  return (
    <div className="terms-container">
      <Container className="py-5">
        <div className="terms-content">
          <h1 className="text-center mb-4">Terms of Service</h1>
                  <p className="terms-intro">
                    Welcome to EduForge! These Terms of Service govern your use of our website and services. 
                    By accessing or using our platform, you agree to be bound by these Terms.
                  </p>
                  
                  <div className="terms-section">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                      By accessing or using EduForge services, you acknowledge that you have read, understood, 
                      and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, 
                      please do not use our services.
                    </p>
                  </div>
                  
                  <div className="terms-section">
                    <h2>2. Description of Services</h2>
                    <p>
                      EduForge provides educational services including but not limited to online courses, tutoring, 
                      educational resources, and collaborative learning experiences. We reserve the right to modify, 
                      suspend, or discontinue any aspect of our services at any time.
                    </p>
                  </div>
                  
                  <div className="terms-section">
                    <h2>3. User Accounts</h2>
                    <p>
                      To access certain features of our platform, you may need to create an account. You are responsible for:
                    </p>
                    <ul className="terms-list">
                      <li>Maintaining the confidentiality of your account credentials</li>
                      <li>All activities that occur under your account</li>
                      <li>Providing accurate and complete information</li>
                    </ul>
                    <p>
                      We reserve the right to suspend or terminate accounts that violate our terms or engage in 
                      inappropriate behavior.
                    </p>
                  </div>
                  
                  <div className="terms-section">
                    <h2>4. Payment Terms</h2>
                    <p>
                      For paid services:
                    </p>
                    <ul className="terms-list">
                      <li>Payments are processed securely through third-party payment processors</li>
                      <li>Prices are subject to change with notice</li>
                      <li>Refunds are handled according to our refund policy</li>
                      <li>Subscription services will automatically renew unless canceled</li>
                    </ul>
                  </div>
                  
                  <div className="terms-section">
                    <h2>5. Intellectual Property</h2>
                    <p>
                      All content on EduForge, including courses, materials, logos, and designs, is protected by 
                      copyright and other intellectual property laws. Users may not reproduce, distribute, or create 
                      derivative works without explicit permission.
                    </p>
                  </div>
                  
                  <div className="terms-section">
                    <h2>6. User Conduct</h2>
                    <p>
                      When using our services, you agree to:
                    </p>
                    <ul className="terms-list">
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Respect the rights and dignity of others</li>
                      <li>Not engage in disruptive, harmful, or fraudulent activities</li>
                      <li>Not attempt to gain unauthorized access to our systems</li>
                    </ul>
                  </div>
                  
                  <div className="terms-section">
                    <h2>7. Limitation of Liability</h2>
                    <p>
                      EduForge provides services "as is" without warranties of any kind. We shall not be liable 
                      for any indirect, incidental, special, or consequential damages arising from the use of our services.
                    </p>
                  </div>
                  
                  <div className="terms-section">
                    <h2>8. Termination</h2>
                    <p>
                      We reserve the right to terminate or suspend access to our services at our sole discretion, 
                      without prior notice, for conduct that we believe violates these Terms or is harmful to other 
                      users, us, or third parties, or for any other reason.
                    </p>
                  </div>
                  
                  <div className="terms-section">
                    <h2>9. Changes to Terms</h2>
                    <p>
                      We may update these Terms of Service from time to time. The updated version will be effective 
                      as soon as it is accessible. We encourage you to review these Terms periodically.
                    </p>
                  </div>
                  
                  <div className="terms-section">
                    <h2>10. Contact Information</h2>
                    <p>
                      For questions about these Terms, please contact us at:
                    </p>
                    <p>
                      📧 <a href="mailto:lokesh@eduforge.co" className="terms-link">lokesh@eduforge.co</a>
                    </p>
                  </div>
                  
                  <div className="mt-5 text-center">
                    <p className="text-muted">
                      <strong>Last Updated:</strong> October 22, 2025
                    </p>
                  </div>
        </div>
      </Container>
    </div>
  );
};

export default TermsOfService;