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
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/apply-faculty-student-parking',
      name: 'ApplyFacultyStudentParking',
      component: applyFacultyStudentParking,
      children: [
        {
          path: 'verify-fail',
          name: 'ApplyFacultyStudentParking_VerifyFail',
          component: () =>
            import('@/views/applyFacultyStudentParking/VerifyFail.vue'),
        },
        {
          path: 'step1',
          name: 'ApplyFacultyStudentParking_step1',
          component: () =>
            import('@/views/applyFacultyStudentParking/Step1BasicInfo.vue'),
        },
        {
          path: 'step2',
          name: 'ApplyFacultyStudentParking_step2',
          component: () =>
            import(
              '@/views/applyFacultyStudentParking/Step2VehicleRegistration.vue'
            ),
        },
        {
          path: 'step3',
          name: 'ApplyFacultyStudentParking_step3',
          component: () =>
            import(
              '@/views/applyFacultyStudentParking/Step3UploadDocuments.vue'
            ),
        },
      ],
    },
    {
      path: '/apply-staff-parking',
      name: 'ApplyStaffParking',
      component: applyStaffParking,
      redirect: '/apply-staff-parking/steps',
      children: [
        {
          path: 'steps',
          name: 'ApplyStaffParking_steps',
          component: () => import('@/views/applyStaffParking/StepsView.vue'),
        },
        {
          path: 'step1',
          name: 'ApplyStaffParking_step1',
          component: () =>
            import('@/views/applyStaffParking/Step1BasicInfo.vue'),
        },
        {
          path: 'step2',
          name: 'ApplyStaffParking_step2',
          component: () =>
            import('@/views/applyStaffParking/Step2VehicleRegistration.vue'),
        },
        {
          path: 'step3_1',
          name: 'ApplyStaffParking_step3_1',
          component: () =>
            import('@/views/applyStaffParking/Step3_1LoginAndUpload.vue'),
        },
        {
          path: 'step3_2',
          name: 'ApplyStaffParking_step3_2',
          component: () =>
            import('@/views/applyStaffParking/Step3_2UploadDocuments.vue'),
        },
      ],
    },
    {
      path: '/apply-event',
      name: 'ApplyEvent',
      component: applyEvent,
    },
    {
      path: '/apply-event-coupon',
      name: 'ApplyEventCoupon',
      component: applyEventCoupon,
    },
    {
      path: '/preorder-coupon',
      name: 'PreorderCoupon',
      component: preorderCoupon,
    },
    {
      path: '/query-links',
      name: 'QueryLinks',
      component: queryLinks,
    },
    {
      path: '/query-faculty-student-parking',
      name: 'QueryFacultyStudentParking',
      component: queryFacultyStudentParking,
    },
    {
      path: '/query-staff-parking',
      name: 'QueryStaffParking',
      component: queryStaffParking,
    },
    {
      path: '/query-event',
      name: 'QueryEvent',
      component: queryEvent,
    },
    {
      path: '/query-coupon',
      name: 'QueryCoupon',
      component: queryCoupon,
    },
  ],
})

export default router
