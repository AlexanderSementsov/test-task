const request = require('supertest');
const app = require('../services/server');

describe('Server Endpoints', () => {
    it('should return a token when valid credentials are provided', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                username: 'user',
                password: 'password'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should return 401 Unauthorized when invalid credentials are provided', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                username: 'invalid',
                password: 'invalid'
            });

        expect(response.status).toBe(401);
    });
});


