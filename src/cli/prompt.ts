import yargs from 'yargs'
import { AuthCredentials } from '../domain/usecases/auth-user'
import readline from 'readline-sync'

yargs.option('signup', {
  description: 'Signup to the application'
})

yargs.option('login', {
  description: 'Login to the application'
})

export async function getAuthCredentials ():Promise<AuthCredentials> {
  const email = readline.question('Type your email: ')
  const password = readline.question('Type your password: ', {
    hideEchoBack: true,
    mask: '*'
  })

  return {
    email,
    password
  }
}

export async function getAddUserData ():Promise<any> {
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

  return {
    name,
    email,
    password,
    passwordConfirmation
  }
}

export default yargs.argv
