import { StudentDTO } from "../../../src/application/DTO"
import { ListStudentsRepository } from "../../../src/application/protocols"
import { makeStudent } from "../../domain/mocks"

export class ListStudentsRepositorySpy implements ListStudentsRepository {
  callsCount = 0
  students = [makeStudent()]

  async list(): Promise<StudentDTO[]> {
    this.callsCount++
    return this.students
  }
}
