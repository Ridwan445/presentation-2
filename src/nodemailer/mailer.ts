import nodemailer from 'nodemailer';

class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "sanniridwan070@gmail.com",
        pass: "mgqe dldr rtjs whxf"
      },
    });
  }

  public async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
    const info = await this.transporter.sendMail({
      from: '"From TZ 👻" <sanniridwan070@gmail.com>',
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
  
    console.log("Message sent: %s", info.messageId);
  
  }
}

export default new MailService();
