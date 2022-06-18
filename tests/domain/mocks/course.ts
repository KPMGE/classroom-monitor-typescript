import { Course } from "../../../src/domain/entities"

export const makeFakeCourse = (): Course => ({
  id: 'fake_course_id',
  title: 'fake_course_title'
})

