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

describe('list students', () => {
  it('should call service only once', () => {
    const service = new ListStudentsServiceMock()
    const sut = new ListStudentsController(service)

    sut.handle()

    expect(service.callsCount).toBe(1)
  })
})
