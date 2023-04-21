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
      component: () => import('../views/Home.vue'),
      children: [
        {
          path: '/home/chat',  // 项目 进行中
          name: 'Chat',
          component: () => import('../views/Chat.vue')    // 子路由
        },
        {
          path: '/home/formGenerator',  // 项目 进行中
          name: 'formGenerator',
          component: () => import('../views/FormGenerator.vue')    // 子路由
        },
        {
          path: '/home/formParser',  // 项目 进行中
          name: 'formParser',
          component: () => import('../views/FormParser.vue')    // 子路由
        },
        {
          path: '/home/bpmnDesign',  // 项目 进行中
          name: 'bpmnDesign',
          component: () => import('../views/Bpmn.vue')    // 子路由
        },
        {
          path: '/home/bpmn/processDefinition',  // 项目 进行中
          name: 'bpmnProcessDefinition',
          component: () => import('../views/bpmn/processDefinition.vue')    // 子路由
        }
      ]
    }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
