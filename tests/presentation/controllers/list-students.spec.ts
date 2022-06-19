import { ListStudentsController } from "../../../src/presentation/controllers"
import { HttpRequest } from "../../../src/presentation/protocols"
import { ListStudentsServiceSpy } from "../mocks"

type SutTypes = {
  serviceSpy: ListStudentsServiceSpy
  sut: ListStudentsController
  fakeRequest: HttpRequest
}

const makeSut = (): SutTypes => {
  const serviceSpy = new ListStudentsServiceSpy()
  const sut = new ListStudentsController(serviceSpy)
  const fakeRequest: HttpRequest = {
    params: {
      courseId: 'any_course_id'
    },
    body: 'anything'
  }

  return {
    sut,
    serviceSpy,
    fakeRequest
  }
}

describe('list students', () => {
  it('should call service only once', () => {
    const { sut, serviceSpy, fakeRequest } = makeSut()

    sut.handle(fakeRequest)

    expect(serviceSpy.callsCount).toBe(1)
  })

  it('should call service with right courseId', () => {
    const { sut, serviceSpy, fakeRequest } = makeSut()

    sut.handle(fakeRequest)

    expect(serviceSpy.courseId).toEqual(fakeRequest.params.courseId)
  })

  it('should return badRequest if no courseId is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({ params: { courseId: null }, body: 'anything' })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual('missing courseId!')
  })


  it('should return serverError if service throws', async () => {
    const { sut, serviceSpy, fakeRequest } = makeSut()
    serviceSpy.list = () => { throw new Error('service error') }

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new Error('service error'))
  })

  it('should return ok on success', async () => {
    const { sut, serviceSpy, fakeRequest } = makeSut()

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(serviceSpy.students)
  })
})
