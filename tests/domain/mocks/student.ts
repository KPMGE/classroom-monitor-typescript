import { Student } from "../../../src/domain/entities/student"
import { makeSubmission } from "./course-work"

export const makeStudent = (): Student => ({
  id: 'any id',
  name: 'any name',
  email: 'any email',
  submissions: [makeSubmission()]
})
