import request from 'supertest';
import app from '../src/app'; // Import your Express application instance
import { calculateDiscount } from './utils';

// unit testing example
describe('calculateDiscount', () => {
    it('should calculate the discount', () => {
        const result = calculateDiscount(100, 10);
        expect(result).toBe(10);
    });
});

// integration testing example
describe('API Endpoint Testing', () => {
    it('should return 200 status for a GET request to the root path', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });
});
