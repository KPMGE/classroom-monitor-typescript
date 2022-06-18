import { ListCourseWorksRepositorySpy } from "../../../../tests/application/mocks/list-course-works"
import { ListCourseWorksService } from "../../../application/services"
import { ListCourseWorksUseCase } from "../../../domain/protocols/list-course-works"

export const makeListCourseWorksService = (): ListCourseWorksUseCase => {
  const repo = new ListCourseWorksRepositorySpy()
  const service = new ListCourseWorksService(repo)
  return service
}
