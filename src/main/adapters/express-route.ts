import { Request, Response } from 'express'
import { Controller, HttpRequest } from "../../presentation/protocols"

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request: HttpRequest = {
      body: req.body,
      params: req.params
    }
    const response = await controller.handle(request)
    return res.status(response.statusCode).json(response.body)
  }
}
