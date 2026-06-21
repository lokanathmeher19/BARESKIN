const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        let transporter;
        
        if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
            });
        } else {
            // Generate a test account on the fly if no real SMTP is provided
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });
        }

        const message = {
            from: `${process.env.FROM_NAME || 'BareSkin'} <${process.env.FROM_EMAIL || 'noreply@bareskin.com'}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(message);
        
        if (!process.env.SMTP_HOST) {
            console.log('====================================');
            console.log('✉️  REAL EMAIL SENT (VIA ETHEREAL TEST SERVER)');
            console.log(`View your email here: ${nodemailer.getTestMessageUrl(info)}`);
            console.log('====================================');
        } else {
            console.log(`Email sent: ${info.messageId}`);
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
