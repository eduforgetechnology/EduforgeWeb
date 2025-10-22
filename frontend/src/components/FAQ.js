import React, { useState } from 'react';
import { Container, Accordion } from 'react-bootstrap';
import '../styles/faq.css';

const FAQ = () => {
  const [activeKey, setActiveKey] = useState('0');

  const faqItems = [
    {
      question: "What courses does EduForge offer?",
      answer: "EduForge offers a wide range of technology and STEM education courses including robotics, coding, electronics, artificial intelligence, and more. Our courses are designed for different age groups and skill levels."
    },
    {
      question: "How do I enroll in a course?",
      answer: "To enroll in a course, you need to create an account on our platform. Once logged in, you can browse our catalog, select your desired course, and complete the registration process by making payment through our secure payment gateway."
    },
    {
      question: "Are there age requirements for your courses?",
      answer: "Yes, our courses are designed for specific age groups. Most of our programs are suitable for students aged 8 and above. Some advanced courses may have higher age requirements. Each course description specifies the recommended age group."
    },
    {
      question: "Do I need any special equipment for online courses?",
      answer: "Requirements vary by course. Some courses can be completed with just a computer and internet connection, while others may require specific hardware like robotics kits. The required materials are always listed in the course description before enrollment."
    },
    {
      question: "How do competitions work?",
      answer: "EduForge organizes and helps students participate in various robotics and coding competitions. We provide training, mentorship, and registration support. Students can join as individuals or form teams depending on the competition format."
    },
    {
      question: "What is your refund policy?",
      answer: "We offer a 7-day satisfaction guarantee for most courses. If you're not satisfied with your course, you can request a refund within 7 days of purchase. Certain exclusions may apply, as outlined in our Terms of Service."
    },
    {
      question: "How do I access course materials after enrolling?",
      answer: "After enrolling, all course materials are accessible through your student dashboard. You'll have access to videos, tutorials, assignments, and interactive elements. Most course materials remain accessible even after course completion."
    },
    {
      question: "Do you offer certificates upon course completion?",
      answer: "Yes, we provide digital certificates upon successful completion of our courses. These certificates verify the skills and knowledge acquired and can be downloaded or shared directly from your student dashboard."
    },
    {
      question: "How can schools or educational institutions partner with EduForge?",
      answer: "We offer special partnership programs for schools and educational institutions. These can include customized curriculum, teacher training, equipment setup, and ongoing support. Please contact our partnerships team at partnerships@eduforge.co for more information."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team through the Contact Us page on our website, by emailing lokesh@eduforge.co, or by calling our helpline at +91 9306230386. Our support hours are Monday to Friday, 9 AM to 6 PM IST."
    }
  ];

  return (
    <div className="faq-container">
      <Container fluid className="py-5">
        <div className="faq-content">
          <h1 className="faq-title text-center mb-4">Frequently Asked Questions</h1>
          <p className="faq-subtitle text-center mb-5">Find answers to common questions about our courses, enrollment process, and services.</p>
          
          <div className="faq-accordion-container">
            <Accordion activeKey={activeKey} className="faq-accordion w-100">
              {faqItems.map((item, index) => (
                <Accordion.Item 
                  eventKey={index.toString()} 
                  key={index}
                  className="faq-item"
                >
                  <Accordion.Header 
                    className="faq-header"
                    onClick={() => setActiveKey(activeKey === index.toString() ? null : index.toString())}
                  >
                    <div className="question-text">{item.question}</div>
                  </Accordion.Header>
                  <Accordion.Body className="faq-body">
                    {item.answer}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
            
            <div className="text-center mt-5">
              <p className="faq-contact-info">
                Still have questions? Contact us at <a href="mailto:lokesh@eduforge.co" className="faq-link">lokesh@eduforge.co</a> or call <a href="tel:+919306230386" className="faq-link">+91 9306230386</a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FAQ;