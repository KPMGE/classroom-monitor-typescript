import { ListStudentsUseCase } from "../../../src/domain/protocols"
import { ok, serverError } from "../../../src/presentation/helpers"
import { Controller, HttpResponse } from "../../../src/presentation/protocols"
import { makeStudent } from "../../domain/mocks"
import { ListStudentsServiceSpy } from "../mocks"

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
  serviceSpy: ListStudentsServiceSpy
  sut: ListStudentsController
}

const makeSut = (): SutTypes => {
  const serviceSpy = new ListStudentsServiceSpy()
  const sut = new ListStudentsController(serviceSpy)
  return {
    sut,
    serviceSpy
  }
}

describe('list students', () => {
  it('should call service only once', () => {
    const { sut, serviceSpy } = makeSut()

    sut.handle()

    expect(serviceSpy.callsCount).toBe(1)
  })

  it('should return serverError if service throws', async () => {
    const { sut, serviceSpy } = makeSut()
    serviceSpy.list = () => { throw new Error('service error') }

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
