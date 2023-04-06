import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }

  return new HashComparerStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  HashComparerStub: HashComparer
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const HashComparerStub = makeHashComparerStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, HashComparerStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    HashComparerStub
  }
}

describe('DbAddAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const acessToken = await sut.auth(makeFakeAuthentication())
    expect(acessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { HashComparerStub, sut } = makeSut()
    const compareSpy = jest.spyOn(HashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throw', async () => {
    const { HashComparerStub, sut } = makeSut()
    jest.spyOn(HashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { HashComparerStub, sut } = makeSut()
    jest.spyOn(HashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const acessToken = await sut.auth(makeFakeAuthentication())
    expect(acessToken).toBeNull()
  })
})
