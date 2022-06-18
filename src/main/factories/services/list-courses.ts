import { ListCoursesRepositorySpy } from "../../../../tests/application/mocks/list-courses"
import { ListCoursesService } from "../../../application/services/list-courses"
import { ListCoursesUseCase } from "../../../domain/protocols"

export const makeListCoursesService = (): ListCoursesUseCase => {
  const repo = new ListCoursesRepositorySpy()
  const service = new ListCoursesService(repo)
  return service
}
