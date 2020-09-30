import { InvalidParamError } from '../errors/invalid-param'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { httpRequest, httpResponse } from '../protocols/http'

export class LoginController implements Controller {
    private emailValidator: EmailValidator
    constructor (emailvalidator:EmailValidator) {
      this.emailValidator = emailvalidator
    }

    async handle (httpRequest: httpRequest):Promise<httpResponse> {
      try {
        const { email } = httpRequest.body
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
      } catch (error) {
        return serverError(error)
      }
    }
}
