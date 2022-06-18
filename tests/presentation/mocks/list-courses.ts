import { Course } from "../../../src/domain/entities"
import { ListCoursesUseCase } from "../../../src/domain/protocols"
import { makeFakeCourse } from "../../domain/mocks"

export class ListCoursesServiceMock implements ListCoursesUseCase {
  courses = [makeFakeCourse(), makeFakeCourse()]
  async list(): Promise<Course[]> {
    return this.courses
  }
}
