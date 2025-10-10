import app from './app';
import config from './config/config';
import { AppDataSource } from './data-source';
import { EmailService } from './shared/external/emailService';

const emailService = new EmailService();

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected!');
    emailService.initMovieEmailScheduler();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => console.log(error));