const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =========================
// TEST ROUTE
// =========================
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// =========================
// API TEST ROUTE
// =========================
app.get("/api/test", (req, res) => {
  console.log("TEST ROUTE WAS HIT");

  res.json({
    message: "API is working",
  });
});

// =========================
// CONTACT ROUTE
// =========================
app.post("/api/contact", async (req, res) => {
  const { firstName, email, phone, message } = req.body;

  console.log("=================================");
  console.log("CONTACT REQUEST RECEIVED");
  console.log("=================================");

  console.log("First Name:", firstName);
  console.log("Email:", email);
  console.log("Phone:", phone);
  console.log("Message:", message);

  console.log(
    "EMAIL_USER exists:",
    !!process.env.EMAIL_USER
  );

  console.log(
    "EMAIL_PASS exists:",
    !!process.env.EMAIL_PASS
  );

  try {
    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Trying to send email...");

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Enquiry from ${firstName}`,
      html: `
        <h2>New Contact Form Enquiry</h2>

        <p>
          <strong>Name:</strong> ${firstName}
        </p>

        <p>
          <strong>Email:</strong> ${email}
        </p>

        <p>
          <strong>Phone:</strong> ${phone || "Not provided"}
        </p>

        <hr />

        <p>
          <strong>Message:</strong>
        </p>

        <p>
          ${message}
        </p>
      `,
    });

    console.log("=================================");
    console.log("EMAIL SENT SUCCESSFULLY");
    console.log("=================================");

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });

  } catch (err) {
    console.error("=================================");
    console.error("EMAIL ERROR");
    console.error("=================================");

    console.error("Error message:", err.message);
    console.error("Error code:", err.code);
    console.error("Full error:", err);

    res.status(500).json({
      success: false,
      message: "Email failed",
      error: err.message,
      code: err.code,
    });
  }
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});