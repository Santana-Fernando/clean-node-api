import { LoadSurveyRepository } from './db-load-surveys-protocols'
import { DbLoadSurveys } from './db-load-surveys'
import MockDate from 'mockdate'
import { throwError } from '@/domain/test'
import { mockLoadSurveysRepository } from '@/data/test'
import { mockSurveyModels } from '@/domain/test/mock-survey'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveyRepositoryStub: LoadSurveyRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveyRepositoryStub)

  return {
    sut,
    loadSurveyRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyRepository', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return a list of LoadSurveyRepository on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockSurveyModels())
  })

  test('Should throw if LoadSurveyRepository throws', async () => {
    const { loadSurveyRepositoryStub, sut } = makeSut()
    jest.spyOn(loadSurveyRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
