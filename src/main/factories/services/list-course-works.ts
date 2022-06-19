import { ListCourseWorksService } from "../../../application/services"
import { ListCourseWorksUseCase } from "../../../domain/protocols/list-course-works"
import { ClassroomRepository } from "../../../infrastructure/repositories"

export const makeListCourseWorksService = (): ListCourseWorksUseCase => {
  const repo = new ClassroomRepository()
  const service = new ListCourseWorksService(repo)
  return service
}
