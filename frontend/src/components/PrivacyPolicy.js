import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/privacy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <Container className="py-5">
        <div className="privacy-content">
          <h1 className="text-center mb-4">Privacy Policy</h1>
                  <p className="privacy-intro">
                    At EduForge, accessible at <a href="https://www.eduforge.co" className="privacy-link">https://www.eduforge.co</a>, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services, including our online courses, tutoring services, and educational collaborations with schools and colleges.
                  </p>
                  <p className="mb-4">
                    Please read this privacy policy carefully. If you do not agree with the terms, please do not access the site or use our services.
                  </p>

                  <div className="privacy-section">
                    <h2>1. Information We Collect</h2>
                    <p>We collect personal information in the following ways:</p>

                    <h3>a. Information You Provide Directly</h3>
                    <ul className="privacy-list">
                      <li>Full name, email address, phone number</li>
                      <li>Age, educational background, and school/college details</li>
                      <li>Payment information (processed securely via third-party processors)</li>
                      <li>Account login credentials</li>
                      <li>Communication content (support requests, feedback, etc.)</li>
                    </ul>

                    <h3>b. Information Collected Automatically</h3>
                    <p>When you use our site, we may collect:</p>
                    <ul className="privacy-list">
                      <li>IP address</li>
                      <li>Browser type and device information</li>
                      <li>Pages visited, time spent, and user interactions</li>
                      <li>Cookies and similar tracking technologies (see "Cookies" section below)</li>
                    </ul>
                  </div>

                  <div className="privacy-section">
                    <h2>2. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul className="privacy-list">
                      <li>Provide and manage your account</li>
                      <li>Deliver online courses, tuition, and learning resources</li>
                      <li>Communicate with you (e.g., confirmations, support, updates)</li>
                      <li>Improve our services and user experience</li>
                      <li>Comply with legal and regulatory obligations</li>
                      <li>Partner with educational institutions (only with consent)</li>
                    </ul>
                  </div>

                  <div className="privacy-section">
                    <h2>3. Sharing of Information</h2>
                    <p>We do not sell your personal data. However, we may share information with:</p>
                    <ul className="privacy-list">
                      <li>Trusted third-party service providers (e.g., payment processors, cloud storage, LMS platforms)</li>
                      <li>Educational institutions, if part of a collaboration and only with prior consent</li>
                      <li>Legal authorities, if required to comply with applicable laws or to protect rights and safety</li>
                    </ul>
                  </div>

                  <div className="privacy-section">
                    <h2>4. Use of Cookies and Tracking Technologies</h2>
                    <p>
                      We use cookies and similar tools to enhance your experience, analyze site usage, and for marketing purposes. 
                      You can manage your cookie preferences through your browser settings.
                    </p>
                  </div>

                  <div className="privacy-section">
                    <h2>5. Data Security</h2>
                    <p>We implement appropriate technical and organizational measures to protect your data, including:</p>
                    <ul className="privacy-list">
                      <li>Encrypted data transmission (SSL)</li>
                      <li>Secure storage with access controls</li>
                      <li>Regular monitoring for vulnerabilities</li>
                    </ul>
                  </div>

                  <div className="privacy-section">
                    <h2>6. Data Retention</h2>
                    <p>
                      We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy,
                      unless a longer retention period is required by law.
                    </p>
                  </div>

                  <div className="privacy-section">
                    <h2>7. Children's Privacy</h2>
                    <p>
                      EduForge services are intended for users aged 13 and above. For users under 18, use of our platform
                      must be with parental or school/college supervision and consent.
                    </p>
                  </div>

                  <div className="privacy-section">
                    <h2>8. Your Rights</h2>
                    <p>Depending on your location, you may have the right to:</p>
                    <ul className="privacy-list">
                      <li>Access the personal data we hold about you</li>
                      <li>Request correction or deletion of your data</li>
                      <li>Withdraw consent at any time</li>
                      <li>Lodge a complaint with a data protection authority</li>
                    </ul>
                    <p>
                      To exercise your rights, please contact us at:<br />
                      📧 <a href="mailto:privacy@eduforge.co" className="privacy-link">privacy@eduforge.co</a>
                    </p>
                  </div>

                  <div className="privacy-section">
                    <h2>9. Third-Party Links</h2>
                    <p>
                      Our platform may contain links to third-party websites or services. We are not responsible for their privacy practices.
                      We encourage you to review their privacy policies separately.
                    </p>
                  </div>

                  <div className="privacy-section">
                    <h2>10. Changes to This Policy</h2>
                    <p>
                      We may update this Privacy Policy from time to time. The updated version will be indicated by a revised
                      "Effective Date" and will be effective as soon as it is published. We recommend checking this page periodically.
                    </p>
                  </div>

          <div className="mt-5 text-center">
            <p className="text-muted">
              <strong>Effective Date:</strong> October 22, 2025
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;