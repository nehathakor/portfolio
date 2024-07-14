const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './views')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('portfolio');  
});

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;
  
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USERNAME,
      subject: `Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('An error occurred while sending the email.');
      } else {
        console.log('Email sent: ' + info.response);
        res.redirect('/');
      }
    });
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
