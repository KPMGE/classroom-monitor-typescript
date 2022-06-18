import { ListStudentsController } from "../../../presentation/controllers"
import { Controller } from "../../../presentation/protocols"
import { makeListStudentsService } from "../services"

export const makeListStudentsController = (): Controller => {
  return new ListStudentsController(makeListStudentsService())
}
