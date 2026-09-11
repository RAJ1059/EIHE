import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private triedInit = false;

  constructor(private readonly configService: ConfigService) {}

  private getTransporter(): nodemailer.Transporter | null {
    if (this.triedInit) return this.transporter;
    this.triedInit = true;

    const host = this.configService.get<string>("SMTP_HOST");
    const port = this.configService.get<string>("SMTP_PORT");
    const user = this.configService.get<string>("SMTP_USER");
    const pass = this.configService.get<string>("SMTP_PASS");

    if (!host || !port || !user || !pass) {
      this.logger.warn(
        "SMTP is not configured (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS in server/.env) — emails will be logged instead of sent.",
      );
      return null;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });
    return this.transporter;
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    const transporter = this.getTransporter();
    const from = this.configService.get<string>("SMTP_FROM") ?? "EIHE <no-reply@europeanihe.com>";

    if (!transporter) {
      // Never let a missing SMTP config block the request or leak into the
      // response — that would both confirm the account exists to whoever
      // asked and expose server config to a stranger. Log it so it's
      // visible to whoever is running the server.
      this.logger.warn(`Password reset requested for ${to}. Reset URL (SMTP not configured, not emailed): ${resetUrl}`);
      return;
    }

    await transporter.sendMail({
      from,
      to,
      subject: "Reset your EIHE password",
      html: `
        <p>We received a request to reset your EIHE account password.</p>
        <p><a href="${resetUrl}">Click here to set a new password</a>. This link expires in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
      `,
    });
  }
}
