import { Student } from "../../../src/domain/entities"
import { ListStudentsUseCase } from "../../../src/domain/protocols"

class ListStudentsServiceMock implements ListStudentsUseCase {
  callsCount = 0
  async list(): Promise<Student[]> {
    this.callsCount++
    return null
  }
}

type HttpResponse = {
  statusCode: number
  body: any
}

interface Controller {
  handle(): Promise<HttpResponse>
}

class ListStudentsController implements Controller {
  constructor(private readonly listStudentsService: ListStudentsUseCase) { }

  async handle(): Promise<HttpResponse> {
    this.listStudentsService.list()
    return null
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
})
