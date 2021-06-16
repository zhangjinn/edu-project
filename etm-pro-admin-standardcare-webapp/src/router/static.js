export const staticRoutes = [
  {
    path: '/standardcare_scheduleDetail',
    name: 'standardcare_scheduleDetail',
    component: () => import('@/views/standardcare/listFeatures/scheduleManage/detail'),
    meta: { title: '日程详情' }
  },
  {
    path: '/standardcare_scheduleManageSetting',
    name: 'standardcare_scheduleManageSetting',
    component: () => import('@/views/standardcare/settings/scheduleManageSetting'),
    meta: { title: '日程设置' }
  },
  {
    path: '/standardcare_recipeDetail',
    name: 'standardcare_recipeDetail',
    component: () => import('@/views/standardcare/listFeatures/recipesManage/firstTable/detail'),
    meta: { title: '食谱详情' }
  },
  {
    path: '/standardcare_recipesManageSetting',
    name: 'standardcare_recipesManageSetting',
    component: () => import('@/views/standardcare/settings/recipesManageSetting'),
    meta: { title: '食谱设置' }
  },
  {
    path: '/standardcare_clazzRecipesDetail',
    name: 'standardcare_clazzRecipesDetail',
    component: () => import('@/views/standardcare/listEdu/clazzRecipesCare/recipesDetail'),
    meta: { title: '班级食谱详情' }
  },
  {
    path: '/standardcare_clazzScheduleDetail',
    name: 'standardcare_clazzScheduleDetail',
    component: () => import('@/views/standardcare/listEdu/clazzScheduleCare/scheduleDetail'),
    meta: { title: '班级日程详情' }
  },
  // {
  //   path: 'roomManageSetting',
  //   name: 'roomManageSetting',
  //   component: () => import('@/views/guardcare/settings/roomManageSetting/index'),
  //   meta: { title: '场所/教室设置' }
  // }
  {
    path: '/standardcare_clazzManageSetting',
    name: 'standardcare_clazzManageSetting',
    component: () => import('@/views/standardcare/listFeatures/clazzManage/settings/index'),
    meta: { title: '班级设置' }

  },
  {
    path: '/standardcare_listEduSetting',
    name: 'standardcare_listEduSetting',
    component: () => import('@/views/standardcare/listEdu/clazzCare/settings'),
    meta: { title: '班级设置' }

  }
]
