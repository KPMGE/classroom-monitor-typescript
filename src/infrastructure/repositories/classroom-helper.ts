import { readFileSync, writeFile } from "fs"
import { OAuth2Client } from "google-auth-library"
import { classroom_v1, google } from "googleapis"
const readline = require('readline')

type Credential = {
  client_id: string
  project_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  redirect_uris: string[]
  client_secret: string
}

class Classroom {
  private async generateNewToken(oAuth2Client: OAuth2Client, tokenPath: string, scopes: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
      })

      console.log("Authorize this app by visiting this url:", authUrl)

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })


      rl.question("Enter the code from that page here: ", (code: string) => {
        rl.close()
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error("Error retrieving access token", err)
          oAuth2Client.setCredentials(token)
          // Store the token to disk for later program executions
          writeFile(tokenPath, JSON.stringify(token), (err) => {
            if (err) {
              reject(err)
            }
            console.log(`Token stored to ${tokenPath}`)
            resolve(`Token stored to ${tokenPath}`)
          })
        })
      })
    })
  }

  private async authorize(credentialsPath: string, tokenPath: string, scopes: string[]): Promise<OAuth2Client> {
    const data = readFileSync(credentialsPath, 'utf8')
    const jsonData = JSON.parse(data)
    const credentials: Credential = jsonData.installed ?? jsonData.web

    const { client_secret, client_id, redirect_uris } = credentials

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    )

    // Check if we have previously stored a token.
    try {
      const token = readFileSync(tokenPath, 'utf8')
      oAuth2Client.setCredentials(JSON.parse(token))
      console.log('Token found!')
      return oAuth2Client
    } catch (error) {
      await this.generateNewToken(oAuth2Client, tokenPath, scopes)
    }

    return oAuth2Client
  }

  public async getClassroomInstance(credentialsPath: string, tokenPath: string, scopes: string[]): Promise<classroom_v1.Classroom> {
    try {
      const oAuth2Client = await this.authorize(credentialsPath, tokenPath, scopes)
      const classroom = google.classroom({ version: 'v1', auth: oAuth2Client })
      return classroom
    } catch (err) {
      console.log(err)
    }
  }
}

const c = new Classroom()

export const classroomHelper = {
  instance: null as classroom_v1.Classroom,

  async connect(credentialsPath: string, tokenPath: string, scopes: string[]): Promise<void> {
    this.instance = await c.getClassroomInstance(credentialsPath, tokenPath, scopes)
  }
}
