import { ListCoursesController } from '../../../src/presentation/controllers'
import { ListCoursesServiceMock } from '../mocks/list-courses'

type SutTypes = {
  sut: ListCoursesController,
  service: ListCoursesServiceMock
}

const makeSut = (): SutTypes => {
  const service = new ListCoursesServiceMock()
  const sut = new ListCoursesController(service)
  return {
    service,
    sut
  }
}

describe('list-courses-controller', () => {
  it('should return right data on success', async () => {
    const { sut, service } = makeSut()

    const httpResponse = await sut.handle()

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(service.courses)
  })

  it('should return server error if service returns error', async () => {
    const { sut, service } = makeSut()
    service.list = () => { throw new Error('service error') }

    const httpResponse = await sut.handle()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new Error('service error'))
  })
})
