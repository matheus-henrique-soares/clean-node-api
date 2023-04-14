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
    const account = { ...accountData }
    account.password = hashedPassword
    await this.dbAddAccountRepository.add(account)
    return await new Promise(resolve => { resolve(null) })
  }
}
