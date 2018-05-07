import Start from '@/components/StartPage'
import SignUp from '@/components/SignUpPage'
import Login from '@/components/LoginPage'

const routes = [
  {
    path: '/',
    name: 'Start',
    component: Start
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

export default routes
