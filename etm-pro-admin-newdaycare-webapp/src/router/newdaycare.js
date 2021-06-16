export default [
  {
    path: '/newdaycare_dashBoardHead',
    name: 'newdaycare_dashBoardHead',
    meta: {
      title: 'newdaycare_dashBoardHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_dashBoardHead" */ '@/views/newDaycare/dashBoardHead')
  },
  {
    path: '/newdaycare_staffDataHead',
    name: 'newdaycare_staffDataHead',
    meta: {
      title: 'newdaycare_staffDataHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_staffDataHead" */ '@/views/newDaycare/staffDataHead/index')
  },
  {
    path: '/newdaycare_callCenter',
    name: 'newdaycare_callCenter',
    meta: {
      title: 'newdaycare_callCenter'
    },
    component: () => import(/* webpackChunkName: "newdaycare_callCenter" */ '@/views/newDaycare/smsCenter/call')
  },
  {
    path: '/newdaycare_smsCenter',
    name: 'newdaycare_smsCenter',
    meta: {
      title: 'newdaycare_smsCenter'
    },
    component: () => import(/* webpackChunkName: "newdaycare_smsCenter" */ '@/views/newDaycare/smsCenter/index')
  },
  {
    path: '/newdaycare_enrollMinisite',
    name: 'newdaycare_enrollMinisite',
    meta: {
      title: 'newdaycare_enrollMinisite'
    },
    component: () => import(/* webpackChunkName: "newdaycare_enrollMinisite" */ '@/views/newDaycare/enrollMinisite/index')
  },
  {
    path: '/newdaycare_enrollEvaluation',
    name: 'newdaycare_enrollEvaluation',
    meta: {
      title: 'newdaycare_enrollEvaluation'
    },
    component: () => import(/* webpackChunkName: "newdaycare_enrollEvaluation" */ '@/views/newDaycare/enrollEvaluation/index')
  },
  {
    path: '/newdaycare_callingCard',
    name: 'newdaycare_callingCard',
    meta: {
      title: 'newdaycare_callingCard'
    },
    component: () => import(/* webpackChunkName: "newdaycare_callingCard" */ '@/views/newDaycare/digitalCard/index')
  },
  {
    path: '/newdaycare_courseManage',
    name: 'newdaycare_courseManage',
    meta: {
      title: 'newdaycare_courseManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_courseManage" */ '@/views/newDaycare/courseManage')
  },
  {
    path: '/newdaycare_earnestMoneyMangage',
    name: 'newdaycare_earnestMoneyMangage',
    meta: {
      title: 'newdaycare_earnestMoneyMangage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_earnestMoneyMangage" */ '@/views/newDaycare/contract/earnestMoney/index')
  },
  {
    path: '/newdaycare_teachContract',
    name: 'newdaycare_teachContract',
    meta: {
      title: 'newdaycare_teachContract'
    },
    component: () => import(/* webpackChunkName: "newdaycare_teachContract" */ '@/views/newDaycare/contract/teachContract/index')
  },
  {
    path: '/newdaycare_careContract',
    name: 'newdaycare_careContract',
    meta: {
      title: 'newdaycare_careContract'
    },
    component: () => import(/* webpackChunkName: "newdaycare_careContract" */ '@/views/newDaycare/contract/careContract/index')
  },
  {
    path: '/newdaycare_roomManage',
    name: 'newdaycare_roomManage',
    meta: {
      title: 'newdaycare_roomManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_roomManage" */ '@/views/newDaycare/classes')
  },
  {
    path: '/newdaycare_childPool',
    name: 'newdaycare_childPool',
    meta: {
      title: 'newdaycare_childPool'
    },
    component: () => import(/* webpackChunkName: "newdaycare_childPool" */ '@/views/newDaycare/childManage/childPool/index')
  },
  {
    path: '/newdaycare_priceTeach',
    name: 'newdaycare_priceTeach',
    meta: {
      title: 'newdaycare_priceTeach'
    },
    component: () => import(/* webpackChunkName: "newdaycare_priceTeach" */ '@/views/newDaycare/priceTeach/views/index')
  },
  {
    path: '/newdaycare_attendanceTeach',
    name: 'newdaycare_attendanceTeach',
    meta: {
      title: 'newdaycare_attendanceTeach'
    },
    component: () => import(/* webpackChunkName: "newdaycare_attendanceTeach" */ '@/views/newDaycare/attendanceTeach/index')
  },
  {
    path: '/newdaycare_attendanceCare',
    name: 'newdaycare_attendanceCare',
    meta: {
      title: 'newdaycare_attendanceCare'
    },
    component: () => import(/* webpackChunkName: "newdaycare_attendanceCare" */ '@/views/newDaycare/attendanceCare/index')
  },
  {
    path: '/newdaycare_incomeFlow',
    name: 'newdaycare_incomeFlow',
    meta: {
      title: 'newdaycare_incomeFlow'
    },
    component: () => import(/* webpackChunkName: "newdaycare_incomeFlow" */ '@/views/newDaycare/incomeFlow/index')
  },
  {
    path: '/newdaycare_cashFlow',
    name: 'newdaycare_cashFlow',
    meta: {
      title: 'newdaycare_cashFlow'
    },
    component: () => import(/* webpackChunkName: "newdaycare_cashFlow" */ '@/views/newDaycare/statistics/cashFlow/index')
  },
  {
    path: '/newdaycare_sourceOfChildAnalysis',
    name: 'newdaycare_sourceOfChildAnalysis',
    meta: {
      title: 'newdaycare_sourceOfChildAnalysis'
    },
    component: () => import(/* webpackChunkName: "newdaycare_sourceOfChildAnalysis" */ '@/views/newDaycare/statistics/sourceOfChildAnalysis/index')
  },
  {
    path: '/newdaycare_salesmanAnalysis',
    name: 'newdaycare_salesmanAnalysis',
    meta: {
      title: 'newdaycare_salesmanAnalysis'
    },
    component: () => import(/* webpackChunkName: "newdaycare_salesmanAnalysis" */ '@/views/newDaycare/statistics/salesmanAnalysis/index')
  },
  {
    path: '/newdaycare_usedCourse',
    name: 'newdaycare_usedCourse',
    meta: {
      title: 'newdaycare_usedCourse'
    },
    component: () => import(/* webpackChunkName: "newdaycare_usedCourse" */ '@/views/newDaycare/statistics/usedCourse/index')
  },
  {
    path: '/newdaycare_usedCourseTeacher',
    name: 'newdaycare_usedCourseTeacher',
    meta: {
      title: 'newdaycare_usedCourseTeacher'
    },
    component: () => import(/* webpackChunkName: "newdaycare_usedCourseTeacher" */ '@/views/newDaycare/statistics/usedCourseTeacher/index')
  },
  {
    path: '/newdaycare_teacherEffect',
    name: 'newdaycare_teacherEffect',
    meta: {
      title: 'newdaycare_teacherEffect'
    },
    component: () => import(/* webpackChunkName: "newdaycare_teacherEffect" */ '@/views/newDaycare/statistics/teacherEffect/index')
  },
  {
    path: '/newdaycare_attendanceStatistics',
    name: 'newdaycare_attendanceStatistics',
    meta: {
      title: 'newdaycare_attendanceStatistics'
    },
    component: () => import(/* webpackChunkName: "newdaycare_attendanceStatistics" */ '@/views/newDaycare/statistics/attendanceStatistics/index')
  },
  {
    path: '/newdaycare_costFlow',
    name: 'newdaycare_costFlow',
    meta: {
      title: 'newdaycare_costFlow'
    },
    component: () => import(/* webpackChunkName: "newdaycare_costFlow" */ '@/views/newDaycare/costFlow/index')
  },
  {
    path: '/newdaycare_courseTimeManageTeach',
    name: 'newdaycare_courseTimeManageTeach',
    meta: {
      title: 'newdaycare_courseTimeManageTeach'
    },
    component: () => import(/* webpackChunkName: "newdaycare_courseTimeManageTeach" */ '@/views/newDaycare/courseTimeManageTeach/index')
  },
  {
    path: '/newdaycare_bodyCheck',
    name: 'newdaycare_bodyCheck',
    meta: {
      title: 'newdaycare_bodyCheck'
    },
    component: () => import(/* webpackChunkName: "newdaycare_bodyCheck" */ '@/views/newDaycare/bodyCheck')
  },
  {
    path: '/newdaycare_mealsRecord',
    name: 'newdaycare_mealsRecord',
    meta: {
      title: 'newdaycare_mealsRecord'
    },
    component: () => import(/* webpackChunkName: "newdaycare_mealsRecord" */ '@/views/newDaycare/mealsRecord')
  },
  {
    path: '/newdaycare_dashboard',
    name: 'newdaycare_dashboard',
    meta: {
      title: 'newdaycare_dashboard'
    },
    component: () => import(/* webpackChunkName: "newdaycare_dashboard" */ '@/views/newDaycare/dashboard/index')
  },
  {
    path: '/newdaycare_courseTimeManageCare',
    name: 'newdaycare_courseTimeManageCare',
    meta: {
      title: 'newdaycare_courseTimeManageCare'
    },
    component: () => import(/* webpackChunkName: "newdaycare_courseTimeManageCare" */ '@/views/newDaycare/courseTimeMangeCare/index')
  },
  {
    path: '/newdaycare_cm',
    name: 'newdaycare_cm',
    meta: {
      title: 'newdaycare_cm'
    },
    component: () => import(/* webpackChunkName: "newdaycare_cm" */ '@/views/newDaycare/homeManage/daycare_cm')
  },
  {
    path: '/newdaycare_marketAnalysis',
    name: 'newdaycare_marketAnalysis',
    meta: {
      title: 'newdaycare_marketAnalysis'
    },
    component: () => import(/* webpackChunkName: "newdaycare_marketAnalysis" */ '@/views/newDaycare/statistics/marketAnalysis/index')
  },
  {
    path: '/newdaycare_salesAnalysis',
    name: 'newdaycare_salesAnalysis',
    meta: {
      title: 'newdaycare_salesAnalysis'
    },
    component: () => import(/* webpackChunkName: "newdaycare_salesAnalysis" */ '@/views/newDaycare/statistics/salesAnalysis/index')
  },
  {
    path: '/newdaycare_recipesManage',
    name: 'newdaycare_recipesManage',
    meta: {
      title: 'newdaycare_recipesManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_recipesManage" */ '@/views/newDaycare/recipesManage')
  },
  {
    path: '/newdaycare_videoOrder',
    name: 'newdaycare_videoOrder',
    meta: {
      title: 'newdaycare_videoOrder'
    },
    component: () => import(/* webpackChunkName: "newdaycare_videoOrder" */ '@/views/newDaycare/cloudVideoOrder/index')
  },
  {
    path: '/newdaycare_monitorEquipment',
    name: 'newdaycare_monitorEquipment',
    meta: {
      title: 'newdaycare_monitorEquipment'
    },
    component: () => import(/* webpackChunkName: "newdaycare_monitorEquipment" */ '@/views/newDaycare/listEquipment/monitorEquipment')
  },
  {
    path: '/newdaycare_cardAttendance',
    name: 'newdaycare_cardAttendance',
    meta: {
      title: 'newdaycare_cardAttendance'
    },
    component: () => import(/* webpackChunkName: "newdaycare_cardAttendance" */ '@/views/newDaycare/cardAttendance/index')
  },
  {
    path: '/newdaycare_vipCardManage',
    name: 'newdaycare_vipCardManage',
    meta: {
      title: 'newdaycare_vipCardManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_vipCardManage" */ '@/views/newDaycare/contract/card')
  },
  {
    path: '/newdaycare_cmNoticeManage',
    name: 'newdaycare_cmNoticeManage',
    meta: {
      title: 'newdaycare_cmNoticeManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_cmNoticeManage" */ '@/views/newDaycare/cmNoticeManage/index')
  },
  {
    path: '/newdaycare_clazzCircle',
    name: 'newdaycare_clazzCircle',
    meta: {
      title: 'newdaycare_clazzCircle'
    },
    component: () => import(/* webpackChunkName: "newdaycare_clazzCircle" */ '@/views/newDaycare/clazzCircle/index')
  },
  {
    path: '/newdaycare_bookManage',
    name: 'newdaycare_bookManage',
    meta: {
      title: 'newdaycare_bookManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_bookManage" */ '@/views/newDaycare/listLibrary/bookManage/index')
  },
  {
    path: '/newdaycare_lendManage',
    name: 'newdaycare_lendManage',
    meta: {
      title: 'newdaycare_lendManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_lendManage" */ '@/views/newDaycare/listLibrary/lendManage/index')
  },
  {
    path: '/newdaycare_lendApplication',
    name: 'newdaycare_lendApplication',
    meta: {
      title: 'newdaycare_lendApplication'
    },
    component: () => import(/* webpackChunkName: "newdaycare_lendApplication" */ '@/views/newDaycare/listLibrary/lendApplication/index')
  },
  {
    path: '/newdaycare_customerList',
    name: 'newdaycare_customerList',
    meta: {
      title: 'newdaycare_customerList'
    },
    component: () => import(/* webpackChunkName: "newdaycare_customerList" */ '@/views/newDaycare/customOrder/index')
  },
  {
    path: '/newdaycare_dataCenter',
    name: 'newdaycare_dataCenter',
    meta: {
      title: 'newdaycare_dataCenter'
    },
    component: () => import(/* webpackChunkName: "newdaycare_dataCenter" */ '@/views/newDaycare/dataCenter/index')
  },
  {
    path: '/newdaycare_auditionCare',
    name: 'newdaycare_auditionCare',
    meta: {
      title: 'newdaycare_auditionCare'
    },
    component: () => import(/* webpackChunkName: "newdaycare_auditionCare" */ '@/views/newDaycare/freeListen/index')
  },
  {
    path: '/newdaycare_priceCare',
    name: 'newdaycare_priceCare',
    meta: {
      title: 'newdaycare_priceCare'
    },
    component: () => import(/* webpackChunkName: "newdaycare_priceCare" */ '@/views/newDaycare/priceCare/index')
  },
  {
    path: '/newdaycare_materialManage',
    name: 'newdaycare_materialManage',
    meta: {
      title: 'newdaycare_materialManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_materialManage" */ '@/views/newDaycare/materialManage/index')
  },
  {
    path: '/newdaycare_clazzTeach',
    name: 'newdaycare_clazzTeach',
    meta: {
      title: 'newdaycare_clazzTeach'
    },
    component: () => import(/* webpackChunkName: "newdaycare_clazzTeach" */ '@/views/newDaycare/classes/education/tabbs')
  },
  {
    path: '/newdaycare_clazzCare',
    name: 'newdaycare_clazzCare',
    meta: {
      title: 'newdaycare_clazzCare'
    },
    component: () => import(/* webpackChunkName: "newdaycare_clazzCare" */ '@/views/newDaycare/clazzCare/index')
  },
  {
    path: '/newdaycare_packageCare',
    name: 'newdaycare_packageCare',
    meta: {
      title: 'newdaycare_packageCare'
    },
    component: () => import(/* webpackChunkName: "newdaycare_packageCare" */ '@/views/newDaycare/packageCare/index')
  },
  {
    path: '/newdaycare_clazzComment',
    name: 'newdaycare_clazzComment',
    meta: {
      title: 'newdaycare_clazzComment'
    },
    component: () => import(/* webpackChunkName: "newdaycare_clazzComment" */ '@/views/newDaycare/clazzComment/index')
  },
  {
    path: '/newdaycare_bodyCheckGuard',
    name: 'newdaycare_bodyCheckGuard',
    meta: {
      title: 'newdaycare_bodyCheckGuard'
    },
    component: () => import(/* webpackChunkName: "newdaycare_bodyCheckGuard" */ '@/views/newDaycare/bodyCheckGuard/index')
  },
  {
    path: '/newdaycare_matterList',
    name: 'newdaycare_matterList',
    meta: {
      title: 'newdaycare_matterList'
    },
    component: () => import(/* webpackChunkName: "newdaycare_matterList" */ '@/views/newDaycare/matterList/index')
  },
  {
    path: '/newdaycare_recipesManageGuard',
    name: 'newdaycare_recipesManageGuard',
    meta: {
      title: 'newdaycare_recipesManageGuard'
    },
    component: () => import(/* webpackChunkName: "newdaycare_recipesManageGuard" */ '@/views/newDaycare/listCareGuard/recipesManage/index')
  },
  {
    path: '/newdaycare_clazzManage',
    name: 'newdaycare_clazzManage',
    meta: {
      title: 'newdaycare_clazzManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_clazzManage" */ '@/views/newDaycare/listEduGuard/clazzManage/index')
  },
  {
    path: '/newdaycare_courseManageGuard',
    name: 'newdaycare_courseManageGuard',
    meta: {
      title: 'newdaycare_courseManageGuard'
    },
    component: () => import(/* webpackChunkName: "newdaycare_courseManageGuard" */ '@/views/newDaycare/listEduGuard/courseManage/index')
  },
  {
    path: '/newdaycare_gradeManage',
    name: 'newdaycare_gradeManage',
    meta: {
      title: 'newdaycare_gradeManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_gradeManage" */ '@/views/newDaycare/listEduGuard/gradeManage/index')
  },
  {
    path: '/newdaycare_scheduleManage',
    name: 'newdaycare_scheduleManage',
    meta: {
      title: 'newdaycare_scheduleManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_scheduleManage" */ '@/views/newDaycare/listEduGuard/scheduleManage/index')
  },
  {
    path: '/newdaycare_orderManage',
    name: 'newdaycare_orderManage',
    meta: {
      title: 'newdaycare_orderManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_orderManage" */ '@/views/newDaycare/orderManage/index')
  },
  {
    path: '/newdaycare_childManageGuard',
    name: 'newdaycare_childManageGuard',
    meta: {
      title: 'newdaycare_childManageGuard'
    },
    component: () => import(/* webpackChunkName: "newdaycare_childManageGuard" */ '@/views/newDaycare/childManageGuard/index')
  },
  {
    path: '/newdaycare_attendanceSettlement',
    name: 'newdaycare_attendanceSettlement',
    meta: {
      title: 'newdaycare_attendanceSettlement'
    },
    component: () => import(/* webpackChunkName: "newdaycare_attendanceSettlement" */ '@/views/newDaycare/attendanceSettlement/index')
  },
  {
    path: '/newdaycare_refundManage',
    name: 'newdaycare_refundManage',
    meta: {
      title: 'newdaycare_refundManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_refundManage" */ '@/views/newDaycare/refundManage/index')
  },
  {
    path: '/newdaycare_priceGuard',
    name: 'newdaycare_priceGuard',
    meta: {
      title: 'newdaycare_priceGuard'
    },
    component: () => import(/* webpackChunkName: "newdaycare_priceGuard" */ '@/views/newDaycare/priceGuard/index')
  },
  {
    path: '/newdaycare_attendanceGuard',
    name: 'newdaycare_attendanceGuard',
    meta: {
      title: 'newdaycare_attendanceGuard'
    },
    component: () => import(/* webpackChunkName: "newdaycare_attendanceGuard" */ '@/views/newDaycare/attendanceGuard/index')
  },
  {
    path: '/newdaycare_specialCourseStatisticsHead',
    name: 'newdaycare_specialCourseStatisticsHead',
    meta: {
      title: 'newdaycare_specialCourseStatisticsHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_specialCourseStatisticsHead" */ '@/views/newDaycare/statisticsHead/specialCourseStatisticsHead')
  },
  {
    path: '/newdaycare_specialCourseStatistics',
    name: 'newdaycare_specialCourseStatistics',
    meta: {
      title: 'newdaycare_specialCourseStatistics'
    },
    component: () => import(/* webpackChunkName: "newdaycare_specialCourseStatistics" */ '@/views/newDaycare/statistics/specialCourseStatistics')
  },
  {
    path: '/newdaycare_cashFlowHead',
    name: 'newdaycare_cashFlowHead',
    meta: {
      title: 'newdaycare_cashFlowHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_cashFlowHead" */ '@/views/newDaycare/statisticsHead/cashFlowHead')
  },
  {
    path: '/newdaycare_cashFlowSummaryHead',
    name: 'newdaycare_cashFlowSummaryHead',
    meta: {
      title: 'newdaycare_cashFlowSummaryHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_cashFlowSummaryHead" */ '@/views/newDaycare/statisticsHead/cashFlowSummaryHead')
  },
  {
    path: '/newdaycare_settlementStatisticsHead',
    name: 'newdaycare_settlementStatisticsHead',
    meta: {
      title: 'newdaycare_settlementStatisticsHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_settlementStatisticsHead" */ '@/views/newDaycare/statisticsHead/settlementStatisticsHead')
  },
  {
    path: '/newdaycare_settlementSummaryHead',
    name: 'newdaycare_settlementSummaryHead',
    meta: {
      title: 'newdaycare_settlementSummaryHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_settlementSummaryHead" */ '@/views/newDaycare/statisticsHead/settlementSummaryHead')
  },
  {
    path: '/newdaycare_feedBack',
    name: 'newdaycare_feedBack',
    meta: {
      title: 'newdaycare_feedBack'
    },
    component: () => import(/* webpackChunkName: "newdaycare_feedBack" */ '@/views/newDaycare/feedback')
  },
  {
    path: '/newdaycare_feedBackHead',
    name: 'newdaycare_feedBackHead',
    meta: {
      title: 'newdaycare_feedBackHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_feedBackHead" */ '@/views/newDaycare/feedBackHead')
  },
  {
    path: '/newdaycare_attendanceStatisticsGuardHead',
    name: 'newdaycare_attendanceStatisticsGuardHead',
    meta: {
      title: 'newdaycare_attendanceStatisticsGuardHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_attendanceStatisticsGuardHead" */ '@/views/newDaycare/attendanceStatisticsGuardHead')
  },
  {
    path: '/newdaycare_childDataHead',
    name: 'newdaycare_childDataHead',
    meta: {
      title: 'newdaycare_childDataHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_childDataHead" */ '@/views/newDaycare/childDataHead')
  },
  {
    path: '/newdaycare_firmDataHead',
    name: 'newdaycare_firmDataHead',
    meta: {
      title: 'newdaycare_firmDataHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_firmDataHead" */ '@/views/newDaycare/firmDataHead')
  },
  {
    path: '/newdaycare_areaSetHead',
    name: 'newdaycare_areaSetHead',
    meta: {
      title: 'newdaycare_areaSetHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_areaSetHead" */ '@/views/newDaycare/areaSetHead')
  },
  {
    path: '/newdaycare_listChannelManage',
    name: 'newdaycare_listChannelManage',
    meta: {
      title: 'newdaycare_listChannelManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_listChannelManage" */ '@/views/newDaycare/listChannelManage')
  },
  {
    path: '/newdaycare_firmFile',
    name: 'newdaycare_firmFile',
    meta: {
      title: 'newdaycare_firmFile'
    },
    component: () => import(/* webpackChunkName: "newdaycare_firmFile" */ '@/views/newDaycare/firmFileHead')
  },
  {
    path: '/newdaycare_staffFileHead',
    name: 'newdaycare_staffFileHead',
    meta: {
      title: 'newdaycare_staffFileHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_staffFileHead" */ '@/views/newDaycare/listDataManage/staffFile/index')
  },
  {
    path: '/newdaycare_staffFile',
    name: 'newdaycare_staffFile',
    meta: {
      title: 'newdaycare_staffFile'
    },
    component: () => import(/* webpackChunkName: "newdaycare_staffFile" */ '@/views/newDaycare/listDataManage/staffFile/index')
  },
  {
    path: '/newdaycare_refundSummaryHead',
    name: 'newdaycare_refundSummaryHead',
    meta: {
      title: 'newdaycare_refundSummaryHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_refundSummaryHead" */ '@/views/newDaycare/refundSummaryHead/index')
  },
  {
    path: '/newdaycare_orderSummaryHead',
    name: 'newdaycare_orderSummaryHead',
    meta: {
      title: 'newdaycare_orderSummaryHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_orderSummaryHead" */ '@/views/newDaycare/orderSummaryHead/index')
  },
  {
    path: '/newdaycare_orderStatisticsHead',
    name: 'newdaycare_orderStatisticsHead',
    meta: {
      title: 'newdaycare_orderStatisticsHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_orderStatisticsHead" */ '@/views/newDaycare/orderStatisticsHead/index')
  },
  {
    path: '/newdaycare_refundStatisticsHead',
    name: 'newdaycare_refundStatisticsHead',
    meta: {
      title: 'newdaycare_refundStatisticsHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_refundStatisticsHead" */ '@/views/newDaycare/refundStatisticsHead/index')
  },
  {
    path: '/newdaycare_orderStatistics',
    name: 'newdaycare_orderStatistics',
    meta: {
      title: 'newdaycare_orderStatistics'
    },
    component: () => import(/* webpackChunkName: "newdaycare_orderStatistics" */ '@/views/newDaycare/orderStatistics/index')
  },
  {
    path: '/newdaycare_accountStatisticsHead',
    name: 'newdaycare_accountStatisticsHead',
    meta: {
      title: 'newdaycare_accountStatisticsHead'
    },
    component: () => import(/* webpackChunkName: "newdaycare_accountStatisticsHead" */ '@/views/newDaycare/accountStatisticsHead/index')
  },
  {
    path: '/newdaycare_accountStatistics',
    name: 'newdaycare_accountStatistics',
    meta: {
      title: 'newdaycare_accountStatistics'
    },
    component: () => import(/* webpackChunkName: "newdaycare_accountStatistics" */ '@/views/newDaycare/accountStatistics/index')
  },
  {
    path: '/newdaycare_childManage',
    name: 'newdaycare_childManage',
    meta: {
      title: 'newdaycare_childManage'
    },
    component: () => import(/* webpackChunkName: "newdaycare_childManage" */ '@/views/newDaycare/childManage/myChild/index')
  },
  {
    path: '/newdaycare_faceRecognitionEquipment',
    name: 'newdaycare_faceRecognitionEquipment',
    meta: {
      title: 'newdaycare_faceRecognitionEquipment'
    },
    component: () => import(/* webpackChunkName: "newdaycare_childManage" */ '@/views/newDaycare/faceRecognitionEquipmentManage/index')
  },
  {
    path: '/newdaycare_careChild',
    name: 'newdaycare_careChild',
    meta: {
      title: 'newdaycare_careChild'
    },
    component: () => import(/* webpackChunkName: "newdaycare_careChild" */ '@/views/newDaycare/childManage/careChild')
  },
  {
    path: '/newdaycare_teachChild',
    name: 'newdaycare_teachChild',
    meta: {
      title: 'newdaycare_teachChild'
    },
    component: () => import(/* webpackChunkName: "newdaycare_teachChild" */ '@/views/newDaycare/childManage/teachChild')
  },
  {
    path: '/newdaycare_collectionRecord',
    name: 'newdaycare_collectionRecord',
    meta: {
      title: 'newdaycare_collectionRecord'
    },
    component: () => import(/* webpackChunkName: "newdaycare_collectionRecord" */ '@/views/newDaycare/collectionRecord/index')
  },
  {
    path: '/newdaycare_dietManagement',
    name: 'newdaycare_dietManagement',
    meta: {
      title: 'newdaycare_dietManagement'
    },
    component: () => import(/* webpackChunkName: "newdaycare_dietManagement" */ '@/views/newDaycare/dietManagement/index')
  },
  {
    path: '/newdaycare_cateringManagement',
    name: 'newdaycare_cateringManagement',
    meta: {
      title: 'newdaycare_cateringManagement'
    },
    component: () => import(/* webpackChunkName: "newdaycare_cateringManagement" */ '@/views/newDaycare/cateringManagement/index')
  },
  {
    path: '/newdaycare_nutritionCalculation',
    name: 'newdaycare_nutritionCalculation',
    meta: {
      title: 'newdaycare_nutritionCalculation'
    },
    component: () => import(/* webpackChunkName: "newdaycare_nutritionCalculation" */ '@/views/newDaycare/nutritionCalculation/index')
  }
]
