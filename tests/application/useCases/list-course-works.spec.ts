import { ListCourseWorksRepository } from "../../../src/application/protocols"
import { ListCourseWorksService } from "../../../src/application/services"
import { CourseWork } from "../../../src/domain/entities"
import { makeCourseWork } from "../../domain/mocks"

class ListCourseWorksRepositorySpy implements ListCourseWorksRepository {
  courseWorks = [makeCourseWork(), makeCourseWork()]
  callsCount = 0

  async list(): Promise<CourseWork[]> {
    this.callsCount++
    return this.courseWorks
  }
}

type SutTypes = {
  sut: ListCourseWorksService,
  repo: ListCourseWorksRepositorySpy
}

const makeSut = (): SutTypes => {
  const repo = new ListCourseWorksRepositorySpy()
  const sut = new ListCourseWorksService(repo)
  return {
    repo,
    sut
  }
}

describe('list-course-works-service', () => {
  it('should call repository only once', () => {
    const { sut, repo } = makeSut()

    sut.list()

    expect(repo.callsCount).toBe(1)
  })

  it('should throw if repository throws', async () => {
    const { sut, repo } = makeSut()
    repo.list = () => { throw new Error('repo error') }

    const promise = sut.list()

    await expect(promise).rejects.toThrow()
  })
})
