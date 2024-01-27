import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { isJwt } from '../utils';
import { RefreshToken } from '../../src/entity/RefreshToken';

interface RegisterResponse {
    id: number;
}

describe('POST /auth/login', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('Valid credentials provided', () => {
        it('should return status 200', async () => {
            // Arrange
            const userData = {
                firstName: 'Shiva',
                lastName: 'Pal',
                email: 'shivapal108941@gmail.com',
                password: 'secret@1234',
            };

            // Register a user
            await request(app).post('/auth/register').send(userData);

            // Login with the registered user
            const loginResponse = await request(app).post('/auth/login').send({
                email: userData.email,
                password: userData.password,
            });

            // Assert
            expect(loginResponse.statusCode).toBe(200);
            const responseBody = loginResponse.body as RegisterResponse;
            expect(responseBody.id).toBeDefined();
            expect(typeof responseBody.id).toBe('number');
        });

        it('should set access token and refresh token in cookies', async () => {
            // Arrange
            const userData = {
                firstName: 'Shiva',
                lastName: 'Pal',
                email: 'shivapal108941@gmail.com',
                password: 'secret@1234',
            };

            // Register a user
            await request(app).post('/auth/register').send(userData);

            // Login with the registered user
            const loginResponse = await request(app).post('/auth/login').send({
                email: userData.email,
                password: userData.password,
            });

            // Assert
            const cookies =
                (loginResponse.headers as Record<string, string>)[
                    'set-cookie'
                ] || [];
            let accessToken = null;
            let refreshToken = null;
            for (const cookie of cookies) {
                if (typeof cookie === 'string') {
                    if (cookie.startsWith('accessToken=')) {
                        accessToken = cookie.split(';')[0].split('=')[1];
                    }
                    if (cookie.startsWith('refreshToken=')) {
                        refreshToken = cookie.split(';')[0].split('=')[1];
                    }
                }
            }

            expect(accessToken).not.toBe(null);
            expect(refreshToken).not.toBe(null);
            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });

        it('should store the refresh token in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Shiva',
                lastName: 'Pal',
                email: 'shivapal108941@gmail.com',
                password: 'secret@1234',
            };

            // Register a user
            await request(app).post('/auth/register').send(userData);

            // Login with the registered user
            const loginResponse = await request(app).post('/auth/login').send({
                email: userData.email,
                password: userData.password,
            });

            // Assert
            expect(loginResponse.statusCode).toBe(200);

            // define type (ts)
            const responseBody = loginResponse.body as RegisterResponse;

            // Ensure the response body contains the user ID
            const userId = responseBody.id;
            expect(userId).toBeDefined();

            // Retrieve refresh tokens from the database for the user
            const refreshTokenRepo = connection.getRepository(RefreshToken);

            const tokens = await refreshTokenRepo
                .createQueryBuilder('refreshToken')
                .where('refreshToken.userId = :userId', { userId })
                .getMany();

            // Assert
            expect(tokens).not.toBe(null);
        });
    });

    describe('Invalid credentials provided', () => {
        it('should return 401 status code for wrong password', async () => {
            // Arrange
            const userData = {
                firstName: 'Shiva',
                lastName: 'Pal',
                email: 'shivapal108941@gmail.com',
                password: 'secret@1234',
            };

            // Register a user
            await request(app).post('/auth/register').send(userData);

            // Login with the wrong password
            const response = await request(app).post('/auth/login').send({
                email: userData.email,
                password: 'wrongpassword',
            });

            // Assert
            expect(response.statusCode).toBe(400);
        });

        it('should return 401 status code for non-existent user', async () => {
            // Login with non-existent user
            const response = await request(app).post('/auth/login').send({
                email: 'nonexistentuser@example.com',
                password: 'password',
            });

            // Assert
            expect(response.statusCode).toBe(400);
        });
    });

    describe('Fields are missing', () => {
        it('should return 400 status code if email field is missing.', async () => {
            // Login with missing email field
            const response = await request(app).post('/auth/login').send({
                password: 'password',
            });

            // Assert
            expect(response.statusCode).toBe(400);
        });

        it('should return 400 status code if password field is missing.', async () => {
            // Login with missing password field
            const response = await request(app).post('/auth/login').send({
                email: 'user@example.com',
            });

            // Assert
            expect(response.statusCode).toBe(400);
        });
    });
});
