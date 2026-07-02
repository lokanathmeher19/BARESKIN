const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Create a transporter. In a real app, use SendGrid, Mailgun, or real SMTP credentials.
        // Here we use Ethereal for testing, or simply log to console if no env vars.
        
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
            // Mock transporter if no SMTP configured
            transporter = {
                sendMail: async (mailOptions) => {
                    console.log('====================================');
                    console.log(`MOCK EMAIL SENT TO: ${mailOptions.to}`);
                    console.log(`SUBJECT: ${mailOptions.subject}`);
                    console.log('====================================');
                    return { messageId: 'mock-id' };
                }
            };
        }

        const message = {
            from: `${process.env.FROM_NAME || 'BareSkin'} <${process.env.FROM_EMAIL || 'noreply@bareskin.com'}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(message);
        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
