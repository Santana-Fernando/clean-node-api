import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    },{
      answer: 'other_answer'
    }],
    date: new Date()
  })

  const { insertedId: id } = res
  const surveyInserted: any = await surveyCollection.findOne({ _id: id })

  return MongoHelper.map(surveyInserted as SurveyModel)
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  const { insertedId: id } = res
  const surveyInserted: any = await accountCollection.findOne({ _id: id })

  return MongoHelper.map(surveyInserted as AccountModel)
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      const sut = makeSut()
      const surveyResults = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      expect(surveyResults).toBeTruthy()
      expect(surveyResults.surveyId).toEqual(new ObjectId(survey.id))
      expect(surveyResults.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResults.answers[0].count).toBe(1)
      expect(surveyResults.answers[0].percent).toBe(100)
    })

    test('Should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveyResults = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })

      expect(surveyResults).toBeTruthy()
      expect(surveyResults.surveyId).toEqual(new ObjectId(survey.id))
      expect(surveyResults.answers[0].answer).toBe(survey.answers[1].answer)
      expect(surveyResults.answers[0].count).toBe(1)
      expect(surveyResults.answers[0].percent).toBe(100)
    })
  })
})
