import axios from 'axios'
import { startServer } from './server/server'
import args, { getAuthCredentials, getAddUserData } from './cli/prompt'
import env from '../env'
import chalk from 'chalk'
import { AuthCredentials } from './domain/usecases/auth-user'

const api = axios.create({
  baseURL: `http://localhost:${env.PORT}`
})

async function signUpUser (data: any):Promise<void> {
  const response = await api.post('/signup', data)
  console.log(response.data)
}

async function logInUser (credentials: AuthCredentials):Promise<void> {
  try {
    const response = await api.post('/login', credentials)
    console.log(chalk.green(`${response.status} ${response.statusText}`) + ` FROM http://127.0.0.1:${env.PORT}`)
  } catch (err) {
    console.log(chalk.red(`${err.response.status} ${err.response.statusText}`) + ` FROM http://127.0.0.1:${env.PORT}`)
  }
}

async function build ():Promise<void> {
  await startServer()

  if (args.login) {
    const credentials = await getAuthCredentials()
    await logInUser(credentials)
  }
  if (args.signup) {
    const addUserData = await getAddUserData()
    await signUpUser(addUserData)
  }
}

build()
