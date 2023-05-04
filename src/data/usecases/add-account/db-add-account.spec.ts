import { type Encrypter, DbAddAccount, type AddAccountModel, type AccountModel, type AddAccountRepository } from './db-add-account-protocols'

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  const encrypterStub = new EncrypterStub()
  return encrypterStub
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

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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
  test('Should call Encrypter with correct password.', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(makeFakeRequest())
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })
  test('Should throw if Encrypter throws.', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
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
})
