import request from "supertest";
import app from "../config/app";

describe('Signup Routes', () => {
    test('should return an account on success', async () => {
        await request(app)
            .post("/api/signup")
            .send({
                name: 'Lucas',
                email: 'lucas@email.com',
                password: 'lucas123',
                passwordConfirmation: 'lucas123'
            })
            .expect(200)
    })
})
