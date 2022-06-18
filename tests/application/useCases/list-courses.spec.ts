type Course = {
  id: string
  title: string
}

interface ListCoursesUseCase {
  list(): Promise<Course>
}

interface ListCoursesRepository {
  list(): Promise<Course>
}

class ListCoursesRepositoryMock implements ListCoursesRepository {
  callsCount = 0
  async list(): Promise<Course> {
    this.callsCount++
    return null
  }
}

class ListCoursesService implements ListCoursesUseCase {
  constructor(private readonly listCoursesRepository: ListCoursesRepository) { }

  async list(): Promise<Course> {
    this.listCoursesRepository.list()
    return null
  }
}

describe('list-courses', () => {
  it('should call repository only once', () => {
    const repo = new ListCoursesRepositoryMock()
    const sut = new ListCoursesService(repo)

    sut.list()

    expect(repo.callsCount).toBe(1)
  })

  it('should throw if repository throws', async () => {
    const repo = new ListCoursesRepositoryMock()
    repo.list = () => { throw new Error('repo error') }
    const sut = new ListCoursesService(repo)

    const promise = sut.list()

    expect(promise).rejects.toThrowError(new Error('repo error'))
  })
})
