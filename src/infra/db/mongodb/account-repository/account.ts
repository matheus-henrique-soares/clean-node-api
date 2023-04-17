import { type AddAccountRepository } from '../../../../data/protocols'
import { type AccountModel } from '../../../../domain/models/account'
import { type AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const { name, email, password } = account
    const accountCollection = MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(account)
    const newAccount = { name, email, password, id: insertedId.toString() }
    return await new Promise(resolve => { resolve(newAccount) })
  }
}
