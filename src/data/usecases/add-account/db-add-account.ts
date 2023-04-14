import { type AccountModel, type AddAccountModel, type AddAccount, type Encrypter, type AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly dbAddAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, dbAddAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.dbAddAccountRepository = dbAddAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const accountInfo = { ...accountData }
    accountInfo.password = hashedPassword
    const account = await this.dbAddAccountRepository.add(accountInfo)
    return account
  }
}
