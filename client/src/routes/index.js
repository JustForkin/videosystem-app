import Start from '@/components/Start'
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'

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
