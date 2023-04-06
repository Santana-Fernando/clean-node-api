import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly HashComparer: HashComparer;

  constructor (loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository, HashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepositoryStub
    this.HashComparer = HashComparer
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      await this.HashComparer.compare(authentication.password, account.password)
    }
    return null
  }
}
