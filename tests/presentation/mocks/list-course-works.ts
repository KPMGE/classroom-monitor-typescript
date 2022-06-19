import { CourseWork } from "../../../src/domain/entities"
import { ListCourseWorksUseCase } from "../../../src/domain/protocols/list-course-works"
import { makeCourseWork } from "../../domain/mocks"

export class ListCourseWorksServiceMock implements ListCourseWorksUseCase {
  courseWorks = [makeCourseWork(), makeCourseWork()]
  courseId = ""

  async list(courseId: string): Promise<CourseWork[]> {
    this.courseId = courseId
    return this.courseWorks
  }
}
