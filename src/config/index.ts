import * as dotenv from 'dotenv';
dotenv.config(); // This loads the variables from the .env file into process.env

export const Config = {
    PORT: process.env.PORT || 5000, // Default to 5000 if PORT is not defined in the .env file
    NODE_ENV: process.env.NODE_ENV || 'development', // Default to 'development' if NODE_ENV is not defined
};
