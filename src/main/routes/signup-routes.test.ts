import request from "supertest";
import app from "../config/app";
import {MongoHelper} from "../../infra/db/mongodb/helpers/mongo-helper";

describe('Signup Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection('account')
        await accountCollection.deleteMany({})
    })
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
