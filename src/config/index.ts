import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env file
config({
    path: path.join(
        __dirname,
        `../../.env.${process.env.NODE_ENV || 'development'}`,
    ),
});

// Extract necessary configurations

//log .evn environment type
// eslint-disable-next-line no-console
console.log('Current Environment:', process.env.NODE_ENV);

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    REFRESH_TOKEN_SECRET,
    JWKS_URI,
} = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    REFRESH_TOKEN_SECRET,
    JWKS_URI,
};
