import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'fernando',
    email: 'fernando@gmail.com',
    password: '123'
  })
  const { insertedId: id } = res
  const accessToken = sign({ id }, env.jwtSecret)

  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT/surveys/:surveyId/results', () => {
    test('Should return 403 on save surveys result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save surveys result with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const res = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answers 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answers 2'
        }]
      })

      const { insertedId: id } = res

      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answers 1'
        })
        .expect(200)
    })
  })

  describe('GET/surveys/:surveyId/results', () => {
    test('Should return 403 on load surveys result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    test('Should return 200 on load surveys result with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const res = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answers 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answers 2'
        }]
      })

      const { insertedId: id } = res

      await request(app)
        .get(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
