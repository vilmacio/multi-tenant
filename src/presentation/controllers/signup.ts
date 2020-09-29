import { Controller } from '../protocols/controller'
import { httpRequest, httpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  async handle (httpRequest: httpRequest):Promise<httpResponse> {
    const { password, passwordConfirmation } = httpRequest.body
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

    return {
      statusCode: 200,
      body: {}
    }
  }
}
