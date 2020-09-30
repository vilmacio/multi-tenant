import { InvalidParamError } from '../errors/invalid-param'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, ok, serverError } from '../helpers/http-helper'
import { Authentication } from '../protocols/authentication'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { httpRequest, httpResponse } from '../protocols/http'

export class LoginController implements Controller {
    private emailValidator: EmailValidator
    private authentication: Authentication
    constructor (emailvalidator:EmailValidator, authentication: Authentication) {
      this.emailValidator = emailvalidator
      this.authentication = authentication
    }

    async handle (httpRequest: httpRequest):Promise<httpResponse> {
      try {
        const { email, password } = httpRequest.body
        const requiredFields = ['email', 'password']
        for (const field of requiredFields) {
          if (!httpRequest.body[field]) {
            return badRequest(new MissingParamError(field))
          }
        }

        const isValid = this.emailValidator.isValid(email)
        if (!isValid) {
          return badRequest(new InvalidParamError('email'))
        }

        const token = await this.authentication.auth(email, password)
        return ok({ access_token: token })
      } catch (error) {
        return serverError(error)
      }
    }
}
