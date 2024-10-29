import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import applyFacultyStudentParking from '@/views/applyFacultyStudentParking.vue'
import applyStaffParking from '@/views/applyStaffParking.vue'
import applyEvent from '@/views/applyEvent.vue'
import applyEventCoupon from '@/views/applyEventCoupon.vue'
import preorderCoupon from '@/views/preorderCoupon.vue'
import queryLinks from '@/views/queryLinks.vue'
import queryFacultyStudentParking from '@/views/queryFacultyStudentParking.vue'
import queryStaffParking from '@/views/queryStaffParking.vue'
import queryEvent from '@/views/queryEvent.vue'
import queryCoupon from '@/views/queryCoupon.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/applyFacultyStudentParking',
      name: 'applyFacultyStudentParking',
      component: applyFacultyStudentParking,
    },
    {
      path: '/applyStaffParking',
      name: 'applyStaffParking',
      component: applyStaffParking,
    },
    {
      path: '/applyEvent',
      name: 'applyEvent',
      component: applyEvent,
    },
    {
      path: '/applyEventCoupon',
      name: 'applyEventCoupon',
      component: applyEventCoupon,
    },
    {
      path: '/preorderCoupon',
      name: 'preorderCoupon',
      component: preorderCoupon,
    },
    {
      path: '/queryLinks',
      name: 'queryLinks',
      component: queryLinks,
    },
    {
      path: '/queryFacultyStudentParking',
      name: 'queryFacultyStudentParking',
      component: queryFacultyStudentParking,
    },
    {
      path: '/queryStaffParking',
      name: 'queryStaffParking',
      component: queryStaffParking,
    },
    {
      path: '/queryEvent',
      name: 'queryEvent',
      component: queryEvent,
    },
    {
      path: '/queryCoupon',
      name: 'queryCoupon',
      component: queryCoupon,
    },
  ],
})

export default router
