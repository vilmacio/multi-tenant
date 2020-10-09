import yargs from 'yargs'

yargs.option('signup', {
  description: 'Signup to the application'
})

yargs.option('login', {
  description: 'Login to the application'
})

export default yargs.argv
