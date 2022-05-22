import { ListStudentsUseCase } from "../../../src/domain/protocols"
import { ok, serverError } from "../../../src/presentation/helpers"
import { Controller, HttpResponse } from "../../../src/presentation/protocols"
import { makeStudent } from "../../domain/mocks"
import { ListStudentsServiceMock } from "../mocks"

class ListStudentsController implements Controller {
  constructor(private readonly listStudentsService: ListStudentsUseCase) { }

  async handle(): Promise<HttpResponse> {
    try {
      const students = await this.listStudentsService.list()
      return ok(students)
    } catch (err) {
      return serverError(err)
    }
  }
}

type SutTypes = {
  serviceMock: ListStudentsServiceMock
  sut: ListStudentsController
}

const makeSut = (): SutTypes => {
  const serviceMock = new ListStudentsServiceMock()
  const sut = new ListStudentsController(serviceMock)
  return {
    sut,
    serviceMock
  }
}

describe('list students', () => {
  it('should call service only once', () => {
    const { sut, serviceMock } = makeSut()

    sut.handle()

    expect(serviceMock.callsCount).toBe(1)
  })

  it('should return serverError if service throws', async () => {
    const { sut, serviceMock } = makeSut()
    serviceMock.list = () => { throw new Error('service error') }

    const httpResponse = await sut.handle()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new Error('service error'))
  })

  it('should return ok on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle()

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual([makeStudent()])
  })
})
