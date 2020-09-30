import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { httpRequest, httpResponse } from '../protocols/http'

export class LoginController implements Controller {
    private emailValidator: EmailValidator
    constructor (emailvalidator:EmailValidator) {
      this.emailValidator = emailvalidator
    }

    async handle (httpRequest: httpRequest):Promise<httpResponse> {
      const { email } = httpRequest.body
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      this.emailValidator.isValid(email)
    }
}
