import { ListCoursesRepository } from "../../../src/application/protocols"
import { Course } from "../../../src/domain/entities"
import { makeFakeCourse } from "../../domain/mocks"

export class ListCoursesRepositorySpy implements ListCoursesRepository {
  callsCount = 0
  courses = [makeFakeCourse(), makeFakeCourse()]

  async list(): Promise<Course[]> {
    this.callsCount++
    return this.courses
  }
}
