import { classroomHelper } from '../infrastructure/repositories/classroom-helper'
import { app, env } from './config'

const SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses.readonly\
   https://www.googleapis.com/auth/classroom.coursework.me\
   https://www.googleapis.com/auth/classroom.coursework.me.readonly\
   https://www.googleapis.com/auth/classroom.coursework.students\
   https://www.googleapis.com/auth/classroom.coursework.students.readonly\
   https://www.googleapis.com/auth/classroom.student-submissions.me.readonly\
   https://www.googleapis.com/auth/classroom.student-submissions.students.readonly\
   https://www.googleapis.com/auth/classroom.rosters",
]

const TOKEN_PATH = `${__dirname}/./config/google/token.json`
const OAUTH_CREDENTIALS_PATH = `${__dirname}/./config/google/credentials.json`

classroomHelper.connect(OAUTH_CREDENTIALS_PATH, TOKEN_PATH, SCOPES, process.env.COURSE_ID)
  .then(() => {
    app.listen(env.PORT, () => console.log(`Listening on port ${env.PORT}`))
  })
  .catch(err => console.log(err))


