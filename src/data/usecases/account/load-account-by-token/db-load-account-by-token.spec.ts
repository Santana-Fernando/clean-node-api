import { Decrypter, LoadAccountByTokenRpository, AccountModel } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { throwError, mockAccountModel } from '@/domain/test'
import { mockDecrypter, mockLoadAccountByTokenRpository } from '@/data/test'

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRpositoryStub: LoadAccountByTokenRpository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByTokenRpositoryStub = mockLoadAccountByTokenRpository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRpositoryStub)

  return {
    sut,
    decrypterStub,
    loadAccountByTokenRpositoryStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null as any))
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRpositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRpositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRpositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRpositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null as any))
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should return a account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(mockAccountModel())
  })

  test('Should throw if Decrypter throws', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { loadAccountByTokenRpositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByTokenRpositoryStub, 'loadByToken').mockImplementationOnce(throwError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
