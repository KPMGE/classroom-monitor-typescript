import { Student } from "../../../src/domain/entities"

export const makeStudent = (): Student => ({
  name: 'any_student_name',
  email: 'any_valid_email@gmail.com'
})
