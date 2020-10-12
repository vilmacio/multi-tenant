import { NextFunction, Request, Response } from 'express'
import { httpRequest, httpResponse } from '../../presentation/protocols/http'
import { Middleware } from '../../presentation/protocols/middleware'

export const middlewareAdapter = (middleware: Middleware) => {
  return async (req:Request, res:Response, next:NextFunction) => {
    const httpRequest:httpRequest = {
      body: req.body,
      headers: req.headers
    }
    const httpResponse:httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      req.body = httpResponse.body
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body
      })
    }
  }
}
