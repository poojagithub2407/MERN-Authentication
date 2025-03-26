import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
     host: 'smtp-relay.brevo.com',
     port: 587,
     auth: {
          user: "88bc77003@smtp-brevo.com",
          pass: "ybnIFOZGqxMrD5B1",
     },

})

export default transporter