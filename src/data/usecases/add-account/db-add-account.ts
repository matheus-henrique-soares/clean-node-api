import { type AccountModel, type AddAccountModel, type AddAccount, type Hasher, type AddAccountRepository, type LoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher,
    private readonly dbAddAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (account === null) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      const accountInfo = { ...accountData }
      accountInfo.password = hashedPassword
      const newAccount = await this.dbAddAccountRepository.add(accountInfo)
      return newAccount
    }
    return null
  }
}
