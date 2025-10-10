import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Repository } from 'typeorm';
import cron from 'node-cron';
import { Movie } from "../../entities/Movie";
import { AppDataSource } from "../../data-source";

export class EmailService {
  private sesClient: SESClient;
  private senderEmail: string;

  constructor() {
    this.sesClient = new SESClient({ 
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });

    this.senderEmail = process.env.SENDER_EMAIL || 'example@email.com';
  }

  async sendEmail(to: string, subject: string, htmlBody: string, textBody?: string) {
    const params = {
      Source: this.senderEmail,
      Destination: {
        ToAddresses: [to]
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: htmlBody },
          Text: { Data: textBody || '' }
        }
      }
    };

    const command = new SendEmailCommand(params);
    return await this.sesClient.send(command);
  }

  private generateMovieEmailHTML(movie: Movie): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .movie-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .release-date { font-size: 14px; color: #666; margin-bottom: 20px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Novo filme lançado!</h1>
          </div>
          <div class="content">
            <div class="movie-title">${movie.title}</div>
            <div class="release-date">Data de lançamento: ${new Date(movie.release_date).toLocaleDateString('en-US')}</div>
            ${movie.title ? `<p>${movie.title}</p>` : ''}
            <a href="${'http://localhost:5173'}/movies/${movie.id}" class="button">
              Ver detalhes
            </a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async checkAndSendMovieEmails(): Promise<void> {
    console.log(`[${new Date().toISOString()}] Checking movies to send emails...`);

    try {
      const movieRepository: Repository<Movie> = AppDataSource.getRepository(Movie);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const moviesToNotify = await movieRepository
        .createQueryBuilder('movie')
        .where('movie.release_date >= :today', { today })
        .andWhere('movie.release_date < :tomorrow', { tomorrow })
        .getMany();

      console.log(`Found ${moviesToNotify.length} movies to notify`);

      for (const movie of moviesToNotify) {
        try {
          const emailToReceive = movie.user.email;
          const htmlBody = this.generateMovieEmailHTML(movie);
          const textBody = `New movie available: ${movie.title}\nRelease Date: ${new Date(movie.release_date).toLocaleDateString('en-US')}`;

          await this.sendEmail(
            emailToReceive.trim(),
            `🎬 ${movie.title} - Available Now!`,
            htmlBody,
            textBody
          );        

          console.log(`✅ Emails sent successfully for movie: ${movie.title}`);

        } catch (error) {
          console.error(`❌ Error sending email for movie ${movie.title}:`, error);
        }
      }

    } catch (error) {
      console.error('Error checking movies:', error);
    }
  }

  initMovieEmailScheduler(): void {
    console.log('📧 Starting movie email scheduler...');
    console.log('⏰ Emails will be checked and sent daily at 9 AM');

    cron.schedule('0 9 * * *', async () => {
      await this.checkAndSendMovieEmails();
    }, {
      timezone: "America/Sao_Paulo"
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: running check immediately...');
      this.checkAndSendMovieEmails();
    }
  }

  async manualCheckMovieEmails(): Promise<void> {
    return await this.checkAndSendMovieEmails();
  }
}