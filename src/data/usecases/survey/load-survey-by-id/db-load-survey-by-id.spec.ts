import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import MockDate from 'mockdate'
import { mockLoadSurveyByIdRepository } from '@/data/test'
import { mockSurveyModel, throwError } from '@/domain/test'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByRepositoryStub)

  return {
    sut,
    loadSurveyByRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return Survey on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.loadById('any_id')
    expect(surveys).toEqual(mockSurveyModel())
  })

  test('Should throw if LoadSurveyRepository throws', async () => {
    const { loadSurveyByRepositoryStub, sut } = makeSut()
    jest.spyOn(loadSurveyByRepositoryStub, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
