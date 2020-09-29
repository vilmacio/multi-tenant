import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { httpRequest, httpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  private emailValidator: EmailValidator

  constructor (emailValidator:EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: httpRequest):Promise<httpResponse> {
    const { email, password, passwordConfirmation } = httpRequest.body

    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return {
          statusCode: 400,
          body: new Error(`MissingParamError: ${field}`)
        }
      }
    }

    if (password !== passwordConfirmation) {
      return {
        statusCode: 400,
        body: new Error('InvalidParamError: password')
      }
    }

    this.emailValidator.isValid(email)

    return {
      statusCode: 200,
      body: {}
    }
  }
}
