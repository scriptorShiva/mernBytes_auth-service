import { Config } from './config';
import logger from './config/logger';
import app from './app';
import { AppDataSource } from './config/data-source';

const startServer = async () => {
    try {
        //initialise database
        await AppDataSource.initialize();
        logger.info('Database connected successfully');

        app.listen(Config.PORT, () =>
            logger.info(`Listening on port ${Config.PORT}`),
        );
    } catch (err) {
        if (err instanceof Error) {
            logger.error(err.message);
            setTimeout(() => {
                // as logger work asynchronously thats why we use setTimeout
                process.exit(1); // Exit the process with error code
            }, 1000);
        }
    }
};

void startServer();
