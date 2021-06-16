export default [
  {
    name: 'standardcare_clazzManage',
    path: '/standardcare_clazzManage',
    component: () => import(/* webpackChunkName: "standardcare_clazzManage" */ '@/views/standardcare/listFeatures/clazzManage'),
    meta: {
      title: 'standardcare_clazzManage'
    }
  },
  {
    name: 'standardcare_scheduleManage',
    path: '/standardcare_scheduleManage',
    component: () => import(/* webpackChunkName: "standardcare_scheduleManage" */ '@/views/standardcare/listFeatures/scheduleManage'),
    meta: {
      title: 'standardcare_scheduleManage'
    }
  },
  {
    name: 'standardcare_recipesManage',
    path: '/standardcare_recipesManage',
    component: () => import(/* webpackChunkName: "standardcare_recipesManage" */ '@/views/standardcare/listFeatures/recipesManage'),
    meta: {
      title: 'standardcare_recipesManage'
    }
  },
  {
    name: 'standardcare_clazzCare',
    path: '/standardcare_clazzCare',
    component: () => import(/* webpackChunkName: "standardcare_clazzCare" */ '@/views/standardcare/listEdu/clazzCare'),
    meta: {
      title: 'standardcare_clazzCare'
    }
  },
  {
    name: 'standardcare_clazzRecipesCare',
    path: '/standardcare_clazzRecipesCare',
    component: () => import(/* webpackChunkName: "standardcare_clazzRecipesCare" */ '@/views/standardcare/listEdu/clazzRecipesCare'),
    meta: {
      title: 'standardcare_clazzRecipesCare'
    }
  },
  {
    name: 'standardcare_clazzScheduleCare',
    path: '/standardcare_clazzScheduleCare',
    component: () => import(/* webpackChunkName: "standardcare_clazzScheduleCare" */ '@/views/standardcare/listEdu/clazzScheduleCare'),
    meta: {
      title: 'standardcare_clazzScheduleCare'
    }
  }
]
