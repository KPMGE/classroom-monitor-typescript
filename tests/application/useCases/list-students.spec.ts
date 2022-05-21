type CourseWork = {
  title: string
  description: string
};

type Submission = {
  late: boolean
  courseWork: CourseWork
};

type Student = {
  id: string
  name: string
  email: string
  submissions: Submission[]
};

interface ListStudentsRepository {
  list(): Promise<Student[]>
}

interface ListStudentsUseCase {
  list(): Promise<Student[]>
}

class ListStudentsRepositoryMock implements ListStudentsRepository {
  callsCount = 0
  async list(): Promise<Student[]> {
    this.callsCount++
    return null
  }
}

class ListStudentsService implements ListStudentsUseCase {
  constructor(private readonly listStudentsRepo: ListStudentsRepository) { }

  async list(): Promise<Student[]> {
    this.listStudentsRepo.list()
    return null
  }
}

describe('list students', () => {
  it('should call repository only once', () => {
    const repo = new ListStudentsRepositoryMock()
    const sut = new ListStudentsService(repo)

    sut.list()

    expect(repo.callsCount).toBe(1)
  })

  it('should throw if repository throws', () => {
    const repo = new ListStudentsRepositoryMock()
    const sut = new ListStudentsService(repo)
    repo.list = () => { throw new Error() }

    const promise = sut.list()

    expect(promise).rejects.toThrow()
  })
})
