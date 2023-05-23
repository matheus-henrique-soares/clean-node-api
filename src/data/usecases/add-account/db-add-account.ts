import { type AccountModel, type AddAccountModel, type AddAccount, type Hasher, type AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly dbAddAccountRepository: AddAccountRepository

  constructor (hasher: Hasher, dbAddAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.dbAddAccountRepository = dbAddAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const accountInfo = { ...accountData }
    accountInfo.password = hashedPassword
    const account = await this.dbAddAccountRepository.add(accountInfo)
    return account
  }
}
