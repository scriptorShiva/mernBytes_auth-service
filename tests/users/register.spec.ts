import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { Roles } from '../../src/constants';

describe('POST /auth/register', () => {
    let connection: DataSource;

    // hooks provided by jest
    beforeAll(async () => {
        // runs before test
        connection = await AppDataSource.initialize();
    });

    // before every test we have to clean the database
    beforeEach(async () => {
        // Database truncate
        await connection.dropDatabase();
        await connection.synchronize();
    });

    // for close db connection
    afterAll(async () => {
        await connection.destroy();
    });

    // happy path
    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            // for any test we have one formula called AAA : Arrange(prepare input data, connection) , Act(trigger endpoint) , Asert (check the expected resutl)
            //Arrange
            const userData = {
                firstName: 'Shiva',
                lastName: 'Pal',
                email: 'shivapal108941@gmail.com',
                password: 'secret',
            };
            //Act : call endpoint using supertest library
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // asert
            expect(response.statusCode).toBe(201);
        });
        it('should return valid json object', async () => {
            //Arrange
            const userData = {
                firstName: 'Shiva',
                lastName: 'Pal',
                email: 'shivapal108941@gmail.com',
                password: 'secret',
            };
            //Act : call endpoint using supertest library
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // asert
            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });
        it('should persist the user in database', async () => {
            //Arrange
            const userData = {
                firstName: 'Shiva',
                lastName: 'Pal',
                email: 'shivapal108941@gmail.com',
                password: 'secret',
            };
            //Act : call endpoint using supertest library
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            const userRepository = connection.getRepository(User);
            // get all records in Users table
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });
        it('should return an id of the created user', async () => {
            // Arrange
            const userData = {
                firstName: 'Shiva',
                lastName: 'Pal',
                email: 'shivapal108941@gmail.com',
                password: 'secret',
            };

            // Act: Call the endpoint using supertest library
            await request(app).post('/auth/register').send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
        });
        it('should assign a customer role', async () => {
            // Arrange
            const userData = {
                firstName: 'Shiva',
                lastName: 'Pal',
                email: 'shivapal108941@gmail.com',
                password: 'secret',
            };

            // Act: Call the endpoint using supertest library
            await request(app).post('/auth/register').send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty('role');
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });
        it('should store hashed password in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Shiva',
                lastName: 'Pal',
                email: 'shivapal108941@gmail.com',
                password: 'secret',
            };

            // Act: Call the endpoint using supertest library
            await request(app).post('/auth/register').send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });
        it('should return 400 status if email already exist', async () => {
            // Arrange
            const userData = {
                firstName: 'Shiva',
                lastName: 'Pal',
                email: 'shivapal108941@gmail.com',
                password: 'secret',
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            // Act: Call the endpoint using supertest library
            const res = await request(app)
                .post('/auth/register')
                .send(userData);
            const users = await userRepository.find();
            // Assert
            expect(res.statusCode).toBe(400);
            expect(users).toHaveLength(1);
            expect;
        });
    });
    // sad path
    describe('Fields are missing', () => {});
});
