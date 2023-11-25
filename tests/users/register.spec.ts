import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/register', () => {
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
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            );
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
        });
    });
    // sad path
    describe('Fields are missing', () => {});
});
