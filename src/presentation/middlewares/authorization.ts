import { Authorization } from '../../domain/usecases/authorize-user'
import { forbidden, ok, serverError } from '../helpers/http-helper'
import { httpRequest, httpResponse } from '../protocols/http'
import { Middleware } from '../protocols/middleware'

export class AuthorizationMiddleware implements Middleware {
  private authorization:Authorization

  constructor (authorization:Authorization) {
    this.authorization = authorization
  }

  async handle (httpRequest: httpRequest):Promise<httpResponse> {
    try {
      const accessToken:string = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const user = await this.authorization.authorize(accessToken)
        if (user) {
          return ok(user)
        }
      }
      return forbidden()
    } catch (error) {
      return serverError(error)
    }
  }
}
