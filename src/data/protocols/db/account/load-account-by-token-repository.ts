import { AccountModel } from '@/data/usecases/add-account/db-add-account-protocols'

export interface LoadAccountByTokenRpository {
  loadByToken (token: string, role?: string): Promise<AccountModel>
}
