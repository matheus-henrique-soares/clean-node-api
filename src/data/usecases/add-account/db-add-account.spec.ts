import { type LoadAccountByEmailRepository, type Hasher, DbAddAccount, type AddAccountModel, type AccountModel, type AddAccountRepository } from './db-add-account-protocols'

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  const hasherStub = new HasherStub()
  return hasherStub
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  return addAccountRepositoryStub
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  return loadAccountByEmailRepositoryStub
}

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

const makeFakeAccount = (): AccountModel => {
  return {
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'hashed_password',
    id: 'valid_id'
  }
}

const makeFakeRequest = (): AddAccountModel => {
  return {
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password'
  }
}

describe('DbAddcount usecase', () => {
  test('Should call hasher with correct password.', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeRequest())
    expect(hasherSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if hasher throws.', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })
  test('Should call AddAccountRepository with correct values.', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'hashed_password'
    })
  })
  test('Should throw if AddAccountRepositoryThrows throws.', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )
    const promise = sut.add(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })
  test('Should return an account on success.', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeRequest())
    expect(account).toEqual(makeFakeAccount())
  })
  test('Should call LoadAccountByEmailRepository with correct email.', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@email.com')
  })
})
