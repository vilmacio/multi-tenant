import { ServerError } from '../errors/server-error'
import { UnauthorizedError } from '../errors/unauthorized'
import { httpResponse } from '../protocols/http'

export const badRequest = (error: Error):httpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const unauthorized = ():httpResponse => {
  return {
    statusCode: 401,
    body: new UnauthorizedError()
  }
}

export const serverError = (error: Error):httpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error.stack)
  }
}

export const ok = (data: any):httpResponse => {
  return {
    statusCode: 200,
    body: data
  }
}
