const sgMail = require('@sendgrid/mail')
import sgCreds = require('../sendgrid_cred.json');


export class SendGridDAL {

    constructor() {
        sgMail.setApiKey(sgCreds.SENDGRID_API_KEY);
    }

    async SendEmail(subject:string, htmlString:string) {
        const msg = {
            to: 'michaelmclean08@gmail.com', // Change to your recipient
            from: 'myextraemail030@gmail.com', // Change to your verified sender
            subject: subject,
            html: htmlString,
          }
          sgMail
            .send(msg)
            .then(() => {
              //console.log('Email sent')
            })
            .catch((error) => {
              console.error(error)
            })
    }
}
  