import axios from 'axios'
import { startServer } from './server/server'
import args, { getAuthCredentials, getAddUserData } from './cli/prompt'
import env from '../env'
import chalk from 'chalk'
import { AuthCredentials } from './domain/usecases/auth-user'
import db from './cli/database'
import utils from './cli/utils'

const api = axios.create({
  baseURL: `http://127.0.0.1:${env.PORT}`
})

async function signUpUser (data: any):Promise<void> {
  await api.post('/signup', data)
  const credentials = {
    email: data.email,
    password: data.password
  }
  await logInUser(credentials)
}

async function logInUser (credentials: AuthCredentials):Promise<void> {
  try {
    const response = await api.post('/login', credentials)
    db.set('token', response.data.access_token).write()
    console.log(chalk.green(`${response.status} ${response.statusText}`) + ` FROM ${response.config.baseURL}${response.config.url}`)
  } catch (err) {
    console.log(chalk.red(`${err.response.status} ${err.response.statusText}`) + ` FROM ${err.response.config.baseURL}${err.response.config.url}`)
  }
}

async function profile () {
  try {
    const token = db.get('token').value()
    const response = await api.get('/profile', {
      headers: {
        'x-access-token': token
      }
    })
    console.log(chalk.green(`${response.status} ${response.statusText}`) + ` FROM ${response.config.baseURL}${response.config.url}\n`)
    console.log('===== MY PROFILE =====')
    console.log(`Name: ${response.data.name}`)
    console.log(`Email: ${response.data.email}`)
    console.log('')
  } catch (err) {
    console.log(chalk.red(`${err.response.status} ${err.response.statusText}`) + ` FROM ${err.response.config.baseURL}${err.response.config.url}\n`)
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
  if (args.logout) {
    utils.logout()
  }

  await profile()
  process.exit()
}

build()
