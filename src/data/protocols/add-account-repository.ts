import { type AccountModel } from '../../domain/models/account'
import { type AddAccountModel } from '../../domain/usecases/add-account'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
