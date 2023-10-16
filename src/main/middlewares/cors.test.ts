import app from "../config/app";
import request from "supertest";

describe('CORS Middleware', () => {
    test('should enable CORS', async () => {
        app.post('/test_body_parser', (req, res) => {
            res.send()
        })

        await request(app)
            .get('/test_body_parser')
            .expect('access-control-allow-origin', '*')
            .expect('access-control-allow-methods', '*')
            .expect('access-control-allow-headers', '*')
    })
})
