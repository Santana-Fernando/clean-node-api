import { AccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'

export interface LoadAccountByTokenRpository {
  loadByToken (token: string, role?: string): Promise<AccountModel>
}
