import { Student } from "../../../src/domain/entities"
import { ListStudentsUseCase } from "../../../src/domain/protocols"
import { makeStudent } from "../../domain/mocks"

class ListStudentsServiceMock implements ListStudentsUseCase {
  callsCount = 0
  students = [makeStudent()]

  async list(): Promise<Student[]> {
    this.callsCount++
    return this.students
  }
}

type HttpResponse = {
  statusCode: number
  body: any
}

interface Controller {
  handle(): Promise<HttpResponse>
}

const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: error
})


class ListStudentsController implements Controller {
  constructor(private readonly listStudentsService: ListStudentsUseCase) { }

  async handle(): Promise<HttpResponse> {
    try {
      await this.listStudentsService.list()
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
})
