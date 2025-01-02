const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Email transporter (Hostinger SMTP)
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465, // Use 587 for TLS
  secure: true, // true for SSL
  auth: {
    user: 'benefits@returnsfinance.site', // Replace with your Hostinger email
    pass: '9&Fl1ky!d', // Replace with your email password
  },
});

// Endpoint to handle Razorpay webhook
app.post('/email_automation', async (req, res) => {
  try {
    const payload = req.body; // Razorpay sends payment info in the payload
    const { customer, event } = payload;

    // Check if the event is a payment capture
    if (event === 'payment.captured') {
      const { email, name } = customer;

      // Send email
      const mailOptions = {
        from: 'benefits@returnsfinance.site',
        to: email,
        subject: `Thank you, ${name}!`,
        html: `<p>Hello ${name},</p><p>Thank you for your payment. Please find the attached invoice.</p>`,
        attachments: [
          {
            filename: 'master_plan.pdf',
            path: 'https://your-app.onrender.com/public/master_plan.pdf', // Adjust Render URL
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${email}`);
      res.status(200).send('Webhook processed and email sent.');
    } else {
      res.status(400).send('Event type not handled.');
    }
  } catch (error) {
    console.error('Error processing webhook or sending email:', error);
    res.status(500).send('Failed to process webhook.');
  }
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Server is running.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
