import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import applyFacultyStudentParking from '@/views/applyFacultyStudentParking.vue'
import applyStaffParking from '@/views/applyStaffParking.vue'
import applyEvent from '@/views/applyEvent.vue'
import applyEventCoupon from '@/views/applyEventCoupon.vue'
import preorderCoupon from '@/views/preorderCoupon.vue'
import applicationSuccess from '@/views/applicationSuccess.vue'
import queryLinks from '@/views/queryLinks.vue'
import queryFacultyStudentParking from '@/views/queryFacultyStudentParking/TheIndex.vue'
import queryStaffParking from '@/views/queryStaffParking/TheIndex.vue'
import queryEvent from '@/views/queryEvent/TheIndex.vue'
import queryCoupon from '@/views/queryCoupon/TheIndex.vue'
import cancelApplicationSuccess from '@/views/cancelApplicationSuccess.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      redirect: '/apply-event/steps',
      children: [
        {
          path: 'steps',
          name: 'ApplyEvent_steps',
          component: () => import('@/views/applyEvent/StepsView.vue'),
        },
        {
          path: 'step1',
          name: 'ApplyEvent_step1',
          component: () => import('@/views/applyEvent/Step1Form.vue'),
        },
        {
          path: 'step2_1',
          name: 'ApplyEvent_step2_1',
          component: () => import('@/views/applyEvent/Step2_1Login.vue'),
        },
        {
          path: 'step2_2',
          name: 'ApplyEvent_step2_2',
          component: () => import('@/views/applyEvent/Step2_2Upload.vue'),
        },
      ],
    },
    {
      path: '/apply-event-coupon',
      name: 'ApplyEventCoupon',
      component: applyEventCoupon,
      redirect: '/apply-event-coupon/steps',
      children: [
        {
          path: 'steps',
          name: 'applyEventCoupon_steps',
          component: () => import('@/views/applyEventCoupon/StepsView.vue'),
        },
        {
          path: 'step1',
          name: 'applyEventCoupon_step1',
          component: () => import('@/views/applyEventCoupon/Step1Form.vue'),
        },
        {
          path: 'step2_1',
          name: 'applyEventCoupon_step2_1',
          component: () => import('@/views/applyEventCoupon/Step2_1Login.vue'),
        },
        {
          path: 'step2_2',
          name: 'applyEventCoupon_step2_2',
          component: () => import('@/views/applyEventCoupon/Step2_2Upload.vue'),
        },
        {
          path: 'step3',
          name: 'applyEventCoupon_step3',
          component: () =>
            import('@/views/applyEventCoupon/Step3ApplyCoupon.vue'),
        },
      ],
    },
    {
      path: '/preorder-coupon',
      name: 'PreorderCoupon',
      component: preorderCoupon,
      redirect: '/preorder-coupon/step1',
      children: [
        {
          path: 'step1',
          name: 'PreorderCoupon_step1',
          component: () => import('@/views/preorderCoupon/Step1Form.vue'),
        },
      ],
    },
    {
      path: '/application-success',
      name: 'applicationSuccess',
      component: applicationSuccess,
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
      path: '/query-faculty-student-parking/:id',
      name: 'QueryFacultyStudentParkingDetail',
      component: () =>
        import('@/views/queryFacultyStudentParking/TheDetail.vue'),
    },
    {
      path: '/query-staff-parking',
      name: 'QueryStaffParking',
      component: queryStaffParking,
    },
    {
      path: '/query-staff-parking/:id',
      name: 'QueryStaffParkingDetail',
      component: () => import('@/views/queryStaffParking/TheDetail.vue'),
    },
    {
      path: '/query-event',
      name: 'QueryEvent',
      component: queryEvent,
    },
    {
      path: '/query-event/:id',
      name: 'QueryEventDetail',
      component: () => import('@/views/queryEvent/TheDetail.vue'),
    },
    {
      path: '/query-coupon',
      name: 'QueryCoupon',
      component: queryCoupon,
    },
    {
      path: '/query-coupon/:id',
      name: 'QueryCouponDetail',
      component: () => import('@/views/queryCoupon/TheDetail.vue'),
    },
    {
      path: '/cancel-application-success',
      name: 'cancelApplicationSuccess',
      component: cancelApplicationSuccess,
    },
  ],
})

export default router
