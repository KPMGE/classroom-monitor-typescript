import { readFile } from "fs";
import readline from "readline";
import { google } from "googleapis";

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.student-submissions.me.readonly https://www.googleapis.com/auth/classroom.student-submissions.students.readonly https://www.googleapis.com/auth/classroom.rosters",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";
const OAUTH_CREDENTIALS_PATH = "credentials.json";

// const getClientSecrets = (file) => {
//   return new Promise((resolve, reject) => {
//     readFile(file, (err, content) => {
//       if (err) reject(err);
//       resolve(JSON.parse(content));
//     });
//   });
// };

// Load client secrets from a local file.
readFile(OAUTH_CREDENTIALS_PATH, (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), listCourses);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
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
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
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

/**
 * Lists the first 10 courses the user has access to.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

const getStudentsSubmissionsIds = async (classroom, courseWorkId) => {
  try {
    const response = await classroom.courses.courseWork.studentSubmissions.list(
      {
        courseId: "372627642770",
        courseWorkId, //"430905527578",
        late: "LATE_VALUES_UNSPECIFIED",
        pageSize: 30,
        states: ["TURNED_IN"],
      }
    );

    const submissions = response.data.studentSubmissions;

    let submissionIds = submissions.map((submission) => submission.userId);
    return submissionIds;
  } catch (error) {
    console.error("The API returned an error: " + error);
  }
};

const getAllCourseWorkIds = async (classroom) => {
  try {
    const response = await classroom.courses.courseWork.list({
      courseId: "372627642770",
      courseWorkStates: ["PUBLISHED"],
      orderBy: "dueDate asc",
    });

    console.log("workds: \n");
    const couseWorks = response.data.courseWork;
    const courseWorksObj = couseWorks.map((couseWork) => ({
      courseWorkId: couseWork.id,
      title: couseWork.title,
    }));

    // console.log(courseWorksObj);
    return courseWorksObj;
  } catch (error) {
    console.error("Error: " + error);
  }
};

async function listCourses(auth) {
  const classroom = google.classroom({ version: "v1", auth });
  // array with objects for courseWorks
  const allCoursesObj = await getAllCourseWorkIds(classroom);

  console.log(
    "All students who submitted the assignment for each couseWork:\n"
  );

  // for each courseWork
  for (const courseObj of allCoursesObj) {
    console.log(courseObj.title);

    // get submissions for that courseWor
    const submissionIds = await getStudentsSubmissionsIds(
      classroom,
      courseObj.courseWorkId
    );

    // displays names of the students who submitted the assignment
    for (const id of submissionIds) {
      const response = await classroom.courses.students.get({
        courseId: "372627642770",
        userId: id,
      });

      const student = response.data;
      console.log(student.profile.name.fullName);
    }

    console.log("\n");
  }
}
