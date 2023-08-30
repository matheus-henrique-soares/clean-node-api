import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware/auth-middleware'
import { makeDbLoadAccount } from '../usecases/load-account-by-token/db-load-account-by-token-factory'

export const makeAuthMiddleware = (role?: string): AuthMiddleware => {
  return new AuthMiddleware(makeDbLoadAccount(), role)
}
