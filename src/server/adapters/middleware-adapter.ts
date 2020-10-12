import { NextFunction, Request, Response } from 'express'
import { httpRequest, httpResponse } from '../../presentation/protocols/http'
import { Middleware } from '../../presentation/protocols/middleware'

export const middlewareAdapter = (middleware: Middleware) => {
  return async (req:Request, res:Response, next:NextFunction) => {
    const httpRequest:httpRequest = {
      body: req.body,
      headers: req.headers
    }

    const httResponse:httpResponse = await middleware.handle(httpRequest)
    if (httResponse.statusCode === 200) {
      next()
    } else {
      res.status(httResponse.statusCode).json({
        error: httResponse.body
      })
    }
  }
}
