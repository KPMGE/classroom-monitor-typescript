import { Submission } from "../../../src/domain/entities/submission"
import { makeCourseWork } from "../../domain/mocks/submission"

export const makeSubmission = (): Submission => ({
  late: false,
  courseWork: makeCourseWork()
})

