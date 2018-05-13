import Start from '@/components/Start'
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'
import Videos from '@/components/Videos'
import Watch from '@/components/Watch'

const routes = [
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Videos',
    component: Videos
  },
  {
    path: '/videos/:videoId',
    name: 'Watch',
    component: Watch
  },
  {
    path: '*',
    redirect: '/'
  }
]

export default routes
