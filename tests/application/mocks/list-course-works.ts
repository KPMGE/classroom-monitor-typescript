import { ListCourseWorksRepository } from "../../../src/application/protocols"
import { CourseWork } from "../../../src/domain/entities"
import { makeCourseWork } from "../../domain/mocks"

export class ListCourseWorksRepositorySpy implements ListCourseWorksRepository {
  courseWorks = [makeCourseWork(), makeCourseWork()]
  callsCount = 0
  courseId = ""

  async listCourseWorks(courseId: string): Promise<CourseWork[]> {
    this.courseId = courseId
    this.callsCount++
    return this.courseWorks
  }
}
