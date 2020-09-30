import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { httpRequest, httpResponse } from '../protocols/http'

export class LoginController implements Controller {
  async handle (httpRequest: httpRequest):Promise<httpResponse> {
    const { email, password } = httpRequest.body
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!password) {
      return badRequest(new MissingParamError('password'))
    }
  }
}
