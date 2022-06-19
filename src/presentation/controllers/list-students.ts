import { ListStudentsUseCase } from "../../domain/protocols";
import { badRequest, ok, serverError } from "../helpers";
import { Controller, HttpRequest, HttpResponse } from "../protocols"

export class ListStudentsController implements Controller {
  constructor(private readonly listStudentsService: ListStudentsUseCase) { }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const courseId = request.params.courseId
      if (!courseId) return badRequest('missing courseId!')
      const courses = await this.listStudentsService.list(courseId)
      return ok(courses)
    } catch (error) {
      return serverError(error)
    }
  }
}
