import { LoadSurveyRepository } from '../../protocols/db/survey/load-survey-repository'
import { SurveyModel } from '../../../domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'

const makeFakeSurveys = (): SurveyModel[] => (
  [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }, {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }]
)

describe('DbLoadSurveys', () => {
  test('Should call LoadSurveyRepository', async () => {
    class LoadSurveyRepositoryStub implements LoadSurveyRepository {
      async loadAll (): Promise<SurveyModel[]> {
        return new Promise(resolve => resolve(makeFakeSurveys()))
      }
    }
    const loadSurveyRepositoryStub = new LoadSurveyRepositoryStub()
    const loadAllSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
    const sut = new DbLoadSurveys(loadSurveyRepositoryStub)
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
})
