import { ListStudentsRepository } from "../../../src/application/protocols"
import { Student } from "../../../src/domain/entities"
import { makeStudent } from "../../domain/mocks"

export class ListStudentsRepositorySpy implements ListStudentsRepository {
  callsCount = 0
  courseId = ""
  students = [makeStudent(), makeStudent()]

  async listStudents(courseId: string): Promise<Student[]> {
    this.courseId = courseId
    this.callsCount++
    return this.students
  }
}
