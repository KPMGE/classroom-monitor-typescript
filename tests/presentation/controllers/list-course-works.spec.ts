import { CourseWork } from "../../../src/domain/entities"
import { ListCourseWorksUseCase } from "../../../src/domain/protocols/list-course-works"
import { ListCourseWorksController } from "../../../src/presentation/controllers"
import { makeCourseWork } from "../../domain/mocks"

class ListCourseWorksServiceMock implements ListCourseWorksUseCase {
  courseWorks = [makeCourseWork(), makeCourseWork()]

  async list(): Promise<CourseWork[]> {
    return this.courseWorks
  }
}

describe('list-course-works-controller', () => {
  it('should return server error if service throws', async () => {
    const service = new ListCourseWorksServiceMock()
    const sut = new ListCourseWorksController(service)
    service.list = () => { throw new Error('service error') }

    const httpResponse = await sut.handle()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new Error('service error'))
  })
})
