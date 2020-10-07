import { Request, Response } from 'express'
import { Controller } from '../../presentation/protocols/controller'
import { httpRequest, httpResponse } from '../../presentation/protocols/http'

export const expressAdapter = (controller:Controller) => {
  return async (req:Request, res:Response) => {
    const httpRequest:httpRequest = {
      body: req.body
    }

    const httpResponse:httpResponse = await controller.handle(httpRequest)

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
