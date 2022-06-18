import { ListCoursesService } from "../../../application/services/list-courses"
import { ListCoursesUseCase } from "../../../domain/protocols"
import { ClassroomRepository } from "../../../infrastructure/repositories"

export const makeListCoursesService = (): ListCoursesUseCase => {
  const repo = new ClassroomRepository()
  const service = new ListCoursesService(repo)
  return service
}
