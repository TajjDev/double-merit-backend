const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Contact route
app.post("/api/contact", async (req, res) => {
  const { firstName, email, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Enquiry from ${firstName}`,
        html: `
          <h2>New Contact Form Enquiry</h2>
      
          <p><strong>Name:</strong> ${firstName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      
          <hr/>
      
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

    res.json({ success: true });
} catch (err) {
    console.error("EMAIL ERROR:", err);
  
    res.status(500).json({
      success: false,
      message: "Email failed",
      error: err.message,
      code: err.code,
    });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });