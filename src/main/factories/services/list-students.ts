import { ListStudentsRepositorySpy } from "../../../../tests/application/mocks"
import { ListStudentsService } from "../../../application/services"
import { ListStudentsUseCase } from "../../../domain/protocols"

export const makeListStudentsService = (): ListStudentsUseCase => {
  const repo = new ListStudentsRepositorySpy()
  const service = new ListStudentsService(repo)
  return service
}
