import { app, env } from './config'

app.listen(env.PORT, () => console.log(`Listening on port ${env.PORT}`))
