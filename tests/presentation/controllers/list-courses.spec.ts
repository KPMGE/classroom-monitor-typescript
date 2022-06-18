import { Course } from '../../../src/domain/entities'
import { ListCoursesUseCase } from '../../../src/domain/protocols'
import { ok } from '../../../src/presentation/helpers'
import { Controller, HttpResponse } from '../../../src/presentation/protocols'
import { makeFakeCourse } from '../../domain/mocks'

class ListCoursesServiceMock implements ListCoursesUseCase {
  courses = [makeFakeCourse(), makeFakeCourse()]
  async list(): Promise<Course[]> {
    return this.courses
  }
}

class ListCoursesController implements Controller {
  constructor(private readonly listCoursesUseCase: ListCoursesUseCase) { }

  async handle(): Promise<HttpResponse> {
    const courses = await this.listCoursesUseCase.list()
    return ok(courses)
  }
}

describe('list-courses-controller', () => {
  it('should return right data on success', async () => {
    const service = new ListCoursesServiceMock()
    const sut = new ListCoursesController(service)

    const httpResponse = await sut.handle()

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(service.courses)
  })
})
