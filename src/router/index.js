import Home from '@/views/home'
import UserInfo from '@/views/UserInfo'
import Detail from '@/views/detail'
import MyList from '@/views/MyList'
const isdev = process.env.NODE_ENV === 'development'
const routes = [{
  path: isdev ? '/' : '/welfare/page/',
  component: Home
}, {
  path: isdev ? '/userinfo/:id' : '/welfare/page/userinfo/:id',
  component: UserInfo
}, {
  path: isdev ? '/detail/:id' : '/welfare/page/detail/:id',
  component: Detail
}, {
  path: isdev ? '/mulist' : '/welfare/page/mylist',
  component: MyList
}, {
  path: isdev ? '/*' : '/welfare/page/*',
  component: Home
}
]

export default routes
