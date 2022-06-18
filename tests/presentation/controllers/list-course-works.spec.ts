import { ListCourseWorksController } from "../../../src/presentation/controllers"
import { ListCourseWorksServiceMock } from "../mocks"

type SutTypes = {
  service: ListCourseWorksServiceMock
  sut: ListCourseWorksController
}

const makeSut = (): SutTypes => {
  const service = new ListCourseWorksServiceMock()
  const sut = new ListCourseWorksController(service)
  return {
    service,
    sut
  }
}

describe('list-course-works-controller', () => {
  it('should return server error if service throws', async () => {
    const { service, sut } = makeSut()
    service.list = () => { throw new Error('service error') }

    const httpResponse = await sut.handle()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new Error('service error'))
  })

  it('should return ok on success', async () => {
    const { service, sut } = makeSut()

    const httpResponse = await sut.handle()

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(service.courseWorks)
  })
})
