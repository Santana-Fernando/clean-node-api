import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyRepository } from '@/data/protocols/db/survey/load-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys: any = await surveyCollection.find().toArray()
    return surveys as SurveyModel[]
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey: any = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey as SurveyModel
  }
}
