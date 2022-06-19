import { ListCourseWorksController } from "../../../src/presentation/controllers"
import { HttpRequest } from "../../../src/presentation/protocols"
import { ListCourseWorksServiceMock } from "../mocks"

type SutTypes = {
  service: ListCourseWorksServiceMock
  sut: ListCourseWorksController
  fakeRequest: HttpRequest
}

const makeSut = (): SutTypes => {
  const service = new ListCourseWorksServiceMock()
  const sut = new ListCourseWorksController(service)
  const fakeRequest: HttpRequest = {
    body: null,
    params: {
      courseId: 'any_course_id'
    }
  }
  return {
    service,
    sut,
    fakeRequest
  }
}

describe('list-course-works-controller', () => {
  it('should return server error if service throws', async () => {
    const { service, sut, fakeRequest } = makeSut()
    service.list = () => { throw new Error('service error') }

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new Error('service error'))
  })

  it('should return badRequest if no courseId is given', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({ params: { courseId: null }, body: null })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual('courseId is missing!')
  })

  it('should return ok on success', async () => {
    const { service, sut, fakeRequest } = makeSut()

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(service.courseWorks)
  })
})
