import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'fernando',
        email: 'fernando@gmail.com',
        password: 'banana',
        passwordConfirmation: 'banana'
      })
      .expect(200)
  })
})
