import readline from 'readline-sync'
import axios from 'axios'
import { startServer } from './server/server'
import args from './cli/prompt'
import env from '../env'

const api = axios.create({
  baseURL: `http://localhost:${env.PORT}`
})

async function signUpUser ():Promise<void> {
  const name = readline.question('Type your name: ')
  const email = readline.question('Type your email: ')
  const password = readline.question('Type your password: ', {
    hideEchoBack: true,
    mask: '*'
  })
  const passwordConfirmation = readline.question('Type your password again: ', {
    hideEchoBack: true,
    mask: '*'
  })

  const data = {
    name,
    email,
    password,
    passwordConfirmation
  }

  const response = await api.post('/signup', data)
  console.log(response.data)
}

async function signInUser ():Promise<void> {
  const email = readline.question('Type your email: ')
  const password = readline.question('Type your password: ', {
    hideEchoBack: true,
    mask: '*'
  })

  const data = {
    email,
    password
  }

  const response = await api.post('/login', data)
  console.log(response.data)
}

async function build ():Promise<void> {
  await startServer()

  if (args.login) {
    await signInUser()
  }
  if (args.signup) {
    await signUpUser()
  }
}

build()
