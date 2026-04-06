import nodemailer from 'nodemailer'

// Create transporter object for sending emails
const transporter = nodemailer.createTransport({

     // SMTP server host
     host:'smtp-relay.brevo.com',

     // SMTP server port
     port:587,

     // Authentication credentials for email service
     auth:{
          user:process.env.SMTP_USER,
          pass:process.env.SMTP_PASSWORD,
     }
})

// Export transporter for use in other files
export default transporter