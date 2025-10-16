const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Rate limiting for production
const rateLimit = require('express-rate-limit');
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 requests per windowMs
    message: { 
        success: false, 
        message: 'Too many contact requests. Please try again in an hour.' 
    }
});

// Create transporter with Gmail settings
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: process.env.NODE_ENV === 'production'
        }
    });
};

// Validate email format
const isValidEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

// Sanitize input
const sanitizeInput = (str) => {
    return str.replace(/<[^>]*>/g, '').trim();
};

// @route   POST /api/contact
// @desc    Send contact form email
// @access  Public
router.post('/', contactLimiter, async (req, res) => {
    try {
        // Input validation
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Sanitize inputs
        const sanitizedName = sanitizeInput(name);
        const sanitizedSubject = sanitizeInput(subject);
        const sanitizedMessage = sanitizeInput(message);

        // Verify required environment variables
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.EMAIL_RECIPIENT) {
            console.error('Missing required email configuration');
            return res.status(500).json({ 
                success: false, 
                message: 'Server configuration error' 
            });
        }

        const transporter = createTransporter();

        // Email options with sanitized input
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_RECIPIENT,
            replyTo: email,
            subject: `Contact Form: ${sanitizedSubject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${sanitizedName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${sanitizedSubject}</p>
                <p><strong>Message:</strong></p>
                <p>${sanitizedMessage}</p>
                <hr>
                <p><small>Sent from: ${req.get('origin') || 'Unknown'}</small></p>
                <p><small>Time: ${new Date().toISOString()}</small></p>
            `
        };

        try {
            // Verify email connection with timeout
            await Promise.race([
                transporter.verify(),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('SMTP connection timeout')), 5000)
                )
            ]);

            // Send email with timeout
            const info = await Promise.race([
                transporter.sendMail(mailOptions),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Email send timeout')), 10000)
                )
            ]);

            // Log success but not in production
            if (process.env.NODE_ENV !== 'production') {
                console.log('Message sent: %s', info.messageId);
            }

            res.status(200).json({ 
                success: true, 
                message: 'Email sent successfully' 
            });

        } catch (error) {
            // Log error details but not in production response
            console.error('Email error:', {
                message: error.message,
                code: error.code,
                command: error.command,
                responseCode: error.responseCode,
                timestamp: new Date().toISOString()
            });

            // Send user-friendly error message
            res.status(error.responseCode === 421 ? 429 : 500).json({ 
                success: false, 
                message: process.env.NODE_ENV === 'production' 
                    ? 'Error sending email. Please try again later.'
                    : `Error: ${error.message}`
            });
        }
    } catch (error) {
        console.error('Request error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An unexpected error occurred. Please try again later.'
        });
    }
});

module.exports = router;