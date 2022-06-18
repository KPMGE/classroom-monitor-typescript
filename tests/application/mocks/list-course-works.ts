import { ListCourseWorksRepository } from "../../../src/application/protocols"
import { CourseWork } from "../../../src/domain/entities"
import { makeCourseWork } from "../../domain/mocks"

export class ListCourseWorksRepositorySpy implements ListCourseWorksRepository {
  courseWorks = [makeCourseWork(), makeCourseWork()]
  callsCount = 0

  async list(): Promise<CourseWork[]> {
    this.callsCount++
    return this.courseWorks
  }
}
