import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { FaRobot, FaTimes, FaComments, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm EduAssist, your AI helper. How can I assist you today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Predefined responses for common queries
  const predefinedResponses = {
    greetings: [
      "Hello! How can I assist you with EduForge today?",
      "Hi there! What would you like to know about our courses or services?",
      "Greetings! I'm here to help you navigate our educational platform."
    ],
    about: [
      "EduForge is an online learning platform offering expert-led courses in technology, business, design, and more. We focus on interactive learning experiences with practical skills development.",
      "We're an e-learning platform dedicated to helping students master in-demand skills through interactive courses designed by industry experts."
    ],
    courses: [
      "We offer a wide range of courses including web development, data science, UI/UX design, digital marketing, and business management. You can explore all our courses in the Courses section.",
      "Our course catalog includes both beginner and advanced level courses in technology, business, and creative fields. All courses include hands-on projects and certification upon completion."
    ],
    pricing: [
      "Our pricing varies depending on the course. We offer subscription plans starting at $15/month for access to our complete library, or you can purchase individual courses. We also provide financial aid options for eligible students.",
      "We have flexible pricing options including monthly subscriptions and one-time purchases. Check our course pages for specific pricing details."
    ],
    contact: [
      "You can reach our support team through the Contact page on our website, or email us directly at support@eduforge.com. Our team is available Monday-Friday, 9AM-5PM EST.",
      "For any questions or concerns, please visit our Contact page or email support@eduforge.com. We aim to respond within 24 hours."
    ],
    default: [
      "I'm not sure I understand. Could you rephrase your question about our educational platform?",
      "I don't have information about that. Would you like to know about our courses, pricing, or support options instead?",
      "I'm still learning! Could you ask something about our courses, educators, or learning resources?"
    ]
  };

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const generateResponse = (userMessage) => {
    // Convert to lowercase for easier matching
    const message = userMessage.toLowerCase();
    
    // Check for greeting patterns
    if (/^(hi|hello|hey|greetings|howdy|hi there)/i.test(message)) {
      return getRandomResponse('greetings');
    }
    
    // Check for "how are you" type questions
    if (/how are you|how('s| is) it going|what('s| is) up|how('s| is) your day/i.test(message)) {
      return "I'm doing great, thanks for asking! I'm here to help you with any questions about our educational platform. How can I assist you today?";
    }
    
    // Check for "about" questions
    if (/what is|who is|about|tell me about|eduforge|platform|website/i.test(message)) {
      return getRandomResponse('about');
    }
    
    // Check for course related questions
    if (/courses|classes|lessons|learning|study|course|offerings|programs|curriculum/i.test(message)) {
      return getRandomResponse('courses');
    }
    
    // Check for pricing questions
    if (/cost|price|pricing|how much|fee|subscription|payment/i.test(message)) {
      return getRandomResponse('pricing');
    }
    
    // Check for contact questions
    if (/contact|support|help|reach|email|phone|call/i.test(message)) {
      return getRandomResponse('contact');
    }
    
    // Default response if no patterns match
    return getRandomResponse('default');
  };

  const getRandomResponse = (category) => {
    const responses = predefinedResponses[category] || predefinedResponses.default;
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate typing delay for a more natural feel
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      {/* Chat button */}
      <motion.div 
        className="ai-assistant-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
      >
        <FaComments />
      </motion.div>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="ai-assistant-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="ai-assistant-card">
              <Card.Header className="d-flex justify-content-between align-items-center" style={{ background: "#4263eb" }}>
                <div className="d-flex align-items-center">
                  <FaRobot className="me-2" />
                  <h5 className="mb-0 text-white">EduAssist</h5>
                </div>
                <Button 
                  variant="link" 
                  className="p-0 text-secondary" 
                  onClick={toggleChat}
                >
                  <FaTimes />
                </Button>
              </Card.Header>
              
              <Card.Body className="ai-assistant-messages">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message-bubble ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}
                  >
                    <div className="message-text">{message.text}</div>
                    <div className="message-time">{formatTime(message.timestamp)}</div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message-bubble bot-message typing-indicator">
                    <div className="dots">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </Card.Body>
              
              <Card.Footer>
                <Form onSubmit={handleSendMessage}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={handleInputChange}
                      className="border border-dark"
                    />
                    <Button 
                      type="submit"
                      disabled={!inputMessage.trim() || isTyping}
                      style={{
                        background: "#4263eb",
                        border: "1px solid #4263eb",
                        color: "white",
                        opacity: "1",
                        boxShadow: "none",
                        transition: "none"
                      }}
                      className="rounded-0 rounded-end"
                    >
                      {isTyping ? <FaSpinner className="fa-spin" /> : <FaPaperPlane />}
                    </Button>
                  </InputGroup>
                </Form>
              </Card.Footer>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;