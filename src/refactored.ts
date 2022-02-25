import { readFile, writeFile } from "fs";
import readline from "readline";
import { google } from "googleapis";
import { Console } from "console";

type CredentialType = {
  client_id: string;
  project_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  redirect_uris: string[];
  client_secret: string;
};

type StudentType = {
  name: string;
};

type SubmissionType = {
  student: StudentType;
  late: boolean;
};

type CourseWorkType = {
  title: string;
  submissions: SubmissionType[];
};

const SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.student-submissions.me.readonly https://www.googleapis.com/auth/classroom.student-submissions.students.readonly https://www.googleapis.com/auth/classroom.rosters",
];

const TOKEN_PATH = "token.json";
const COURSE_ID = "372627642770";
const OAUTH_CREDENTIALS_PATH = "credentials.json";

async function getStudent(classroom, userId: string): Promise<StudentType> {
  try {
    const response = await classroom.courses.students.get({
      courseId: COURSE_ID,
      userId,
    });

    const student: StudentType = { name: response.data.profile.name.fullName };
    return student;
  } catch (err) {
    throw new Error("Error when getting student!");
  }
}

const getStudentsSubmissions = async (classroom, courseWorkId: string) => {
  try {
    const response = await classroom.courses.courseWork.studentSubmissions.list(
      {
        courseId: COURSE_ID,
        courseWorkId,
        late: "LATE_VALUES_UNSPECIFIED",
        pageSize: 30,
        states: ["TURNED_IN"],
      }
    );

    const submissionsObject = response.data.studentSubmissions;
    let submissions = submissionsObject.map(async (submission) => {
      const student = await getStudent(classroom, submission.userId);
      const sub: SubmissionType = {
        student: student.name,
        late: submission.late ? true : false,
      };

      return sub;
    });

    submissions = await Promise.all(submissions);
    return submissions;
  } catch (error) {
    console.error("The API returned an error: " + error);
  }
};

async function getCourseWork(
  classroom,
  courseWorkId: string,
  title: string
): Promise<CourseWorkType> {
  try {
    const studentSubmissions = await getStudentsSubmissions(
      classroom,
      courseWorkId
    );

    const courseWorkObj: CourseWorkType = {
      title,
      submissions: studentSubmissions,
    };
    return courseWorkObj;
  } catch (error) {
    console.error("Error when getting corse work.");
  }
}

const getAllCourseWorks = async (classroom): Promise<CourseWorkType[]> => {
  try {
    const response = await classroom.courses.courseWork.list({
      courseId: COURSE_ID,
      courseWorkStates: ["PUBLISHED"],
      orderBy: "dueDate asc",
    });

    const couseWorks = response.data.courseWork;

    let courseWorksObj = couseWorks.map(
      async (courseWork) =>
        await getCourseWork(classroom, courseWork.id, courseWork.title)
    );

    courseWorksObj = await Promise.all(courseWorksObj);
    return courseWorksObj;
  } catch (error) {
    console.error("Error: " + error);
  }
};

// Load client secrets from a local file.
readFile(OAUTH_CREDENTIALS_PATH, (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content as unknown as string), listCourses);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token as unknown as string));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

async function listCourses(auth) {
  const classroom = google.classroom({ version: "v1", auth });
  // getting all courseworks
  const allCourseWorks = await getAllCourseWorks(classroom);

  // display each coursework
  for (const c of allCourseWorks) {
    console.log(c);
  }
}
