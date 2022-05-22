import { StudentDTO } from "../../../src/application/DTO"
import { ListStudentsUseCase } from "../../../src/domain/protocols"
import { makeStudent } from "../../domain/mocks"

export class ListStudentsServiceMock implements ListStudentsUseCase {
  callsCount = 0
  students = [makeStudent()]

  async list(): Promise<StudentDTO[]> {
    this.callsCount++
    return this.students
  }
}
