import nodemailer from 'nodemailer'

export async function sendEmailToUser(to: string, subject: string, text: string) {
  // Configurer le transporteur SMTP pour Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  })

  // Définir les options de l'email
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  }

  // Envoyer l'email
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: ' + info.response)
  } catch (error) {
    console.error('Error sending email: ', error)
    throw new Error('Error sending email')
  }
}