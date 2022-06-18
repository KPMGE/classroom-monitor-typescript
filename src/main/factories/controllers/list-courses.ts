import { ListCoursesController } from "../../../presentation/controllers"
import { Controller } from "../../../presentation/protocols"
import { makeListCoursesService } from "../services"

export const makeListCoursesController = (): Controller => {
  return new ListCoursesController(makeListCoursesService())
}
