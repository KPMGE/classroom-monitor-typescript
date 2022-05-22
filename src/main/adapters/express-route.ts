import { Request, Response } from 'express'
import { Controller } from "../../presentation/protocols"

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const response = await controller.handle()
    return res.status(response.statusCode).json(response.body)
  }
}
