import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { TUICore } from '../TUIKit';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'Home' },
  },
  {
    path: '/home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    children: [
      // {
      //   path: '/home/chat',  // 项目 进行中
      //   name: 'test',
      //   component: () => import(/* webpackChunkName: "about" */ '../views/Chat.vue')    // 子路由
      // },{
      //   path: '/home/formGenerator',  // 项目 进行中
      //   name: 'formGenerator',
      //   component: () => import(/* webpackChunkName: "about" */ '../views/FormGenerator.vue')    // 子路由
      // },{
      //   path: '/home/formParser',  // 项目 进行中
      //   name: 'formParser',
      //   component: () => import(/* webpackChunkName: "about" */ '../views/FormParser.vue')    // 子路由
      // }
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
