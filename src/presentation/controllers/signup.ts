import { InvalidParamError } from '../errors/invalid-param'
import { MissingParamError } from '../errors/missing-param-error'
import { ServerError } from '../errors/server-error'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { httpRequest, httpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  private emailValidator: EmailValidator

  constructor (emailValidator:EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: httpRequest):Promise<httpResponse> {
    try {
      const { email, password, passwordConfirmation } = httpRequest.body

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return {
            statusCode: 400,
            body: new MissingParamError(field)
          }
        }
      }

      if (password !== passwordConfirmation) {
        return {
          statusCode: 400,
          body: new InvalidParamError('password')
        }
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return {
          statusCode: 400,
          body: new InvalidParamError('email')
        }
      }

      return {
        statusCode: 200,
        body: {}
      }
    } catch (error) {
      const httpResponse: httpResponse = {
        statusCode: 500,
        body: new ServerError(error.stack)
      }
      return httpResponse
    }
  }
}
