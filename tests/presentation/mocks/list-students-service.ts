import { Student } from "../../../src/domain/entities"
import { ListStudentsUseCase } from "../../../src/domain/protocols"
import { makeStudent } from "../../domain/mocks"

export class ListStudentsServiceSpy implements ListStudentsUseCase {
  callsCount = 0
  courseId = ""
  students = [makeStudent()]

  async list(courseId: string): Promise<Student[]> {
    this.courseId = courseId
    this.callsCount++
    return this.students
  }
}
