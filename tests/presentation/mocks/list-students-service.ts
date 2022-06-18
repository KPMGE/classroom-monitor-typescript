import { Student } from "../../../src/domain/entities"
import { ListStudentsUseCase } from "../../../src/domain/protocols"
import { makeStudent } from "../../domain/mocks"

export class ListStudentsServiceSpy implements ListStudentsUseCase {
  callsCount = 0
  students = [makeStudent()]

  async list(): Promise<Student[]> {
    this.callsCount++
    return this.students
  }
}
