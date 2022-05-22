import { ListStudentsRepository } from "../../application/protocols"
import { Student } from "../../domain/entities"
import { classroomHelper } from './classroom-helper'

const getStudent = async (classroom, userId) => {
  try {
    const response = await classroom.courses.students.get({
      courseId: classroomHelper.courseId,
      userId,
    })


    const student = { name: response.data.profile.name.fullName }
    return student
  } catch (err) {
    throw new Error("Error when getting student!")
  }
}

const getStudentsSubmissions = async (classroom, courseWorkId) => {
  try {
    const response = await classroom.courses.courseWork.studentSubmissions.list(
      {
        courseId: classroomHelper.courseId,
        courseWorkId,
        late: "LATE_VALUES_UNSPECIFIED",
        states: ["TURNED_IN"],
      }
    )

    const submissionsObject = response.data.studentSubmissions
    let submissions = submissionsObject.map(async (submission) => {
      const student = await getStudent(classroom, submission.userId)

      const sub = {
        student: student.name,
        late: submission.late ? true : false,
      }

      return sub
    })

    submissions = await Promise.all(submissions)
    return submissions
  } catch (error) {
    console.error("The API returned an error: " + error)
  }
}

async function getCourseWork(classroom, courseWorkId, title) {
  try {
    const studentSubmissions = await getStudentsSubmissions(
      classroom,
      courseWorkId
    )

    const courseWorkObj = {
      title,
      submissions: studentSubmissions,
    }
    return courseWorkObj
  } catch (error) {
    throw new Error("Error when getting corse work.")
  }
}

const getAllCourseWorks = async (classroom) => {
  try {
    const response = await classroom.courses.courseWork.list({
      courseId: classroomHelper.courseId,
      courseWorkStates: ["PUBLISHED"],
      orderBy: "dueDate asc",
    })

    const courseworks = response.data.courseWork

    let courseWorksObj = courseworks?.map(
      async (courseWork) =>
        await getCourseWork(classroom, courseWork.id, courseWork.title)
    )

    courseWorksObj = await Promise.all(courseWorksObj)
    return courseWorksObj
  } catch (error) {
    throw new Error(error)
  }
}

export class ClassroomRepository implements ListStudentsRepository {
  async list(): Promise<Student[]> {
    const allCourseWorks = await getAllCourseWorks(classroomHelper.instance)
    return allCourseWorks
  }
}
