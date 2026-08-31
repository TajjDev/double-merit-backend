const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();
const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { fullName, email, phone, message } = req.body;
  
    try {
      const data = await resend.emails.send({
        from: "Double Merit <onboarding@resend.dev>",
        to: ["doublemeritreceivemails@gmail.com"],
        replyTo: email,
        subject: `New Enquiry from ${fullName}`,
        html: `
          <h2>New Contact Form Enquiry</h2>
  
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
  
          <hr />
  
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
  
      console.log("EMAIL SENT:", data);
  
      res.status(200).json({
        success: true,
        message: "Your message has been sent successfully!",
      });
    } catch (error) {
      console.error("RESEND ERROR:", error);
  
      res.status(500).json({
        success: false,
        message: "Email failed",
        error: error.message,
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