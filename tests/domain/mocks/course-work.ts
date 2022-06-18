import { CourseWork } from "../../../src/domain/entities/course-work"
import { makeSubmission } from "./submission"

export const makeCourseWork = (): CourseWork => ({
  id: 'any_course_work_id',
  title: "any title",
  submissions: [makeSubmission(), makeSubmission()]
})

