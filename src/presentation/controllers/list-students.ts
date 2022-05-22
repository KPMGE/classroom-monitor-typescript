import { ListStudentsUseCase } from "../../domain/protocols"
import { ok, serverError } from "../helpers"
import { Controller, HttpResponse } from "../protocols"

export class ListStudentsController implements Controller {
  constructor(private readonly listStudentsService: ListStudentsUseCase) { }

  async handle(): Promise<HttpResponse> {
    try {
      const students = await this.listStudentsService.list()
      return ok(students)
    } catch (err) {
      return serverError(err)
    }
  }
}
