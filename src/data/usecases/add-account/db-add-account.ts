import { type AccountModel, type AddAccountModel, type AddAccount, type Hasher, type AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly dbAddAccountRepository: AddAccountRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const accountInfo = { ...accountData }
    accountInfo.password = hashedPassword
    const account = await this.dbAddAccountRepository.add(accountInfo)
    return account
  }
}
