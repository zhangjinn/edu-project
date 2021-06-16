<template>
  <div class="index-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs
          ref="tabs"
          v-model="activeName"
          @setting="setting"
        >
          <!--          <el-tab-pane v-if="hasAuth('daycare.clazzTeach.queryBatch', 'tabs', 'activeName')" label="早教班" name="education">-->
          <!--            <etm-tool-bar-->
          <!--              v-model="formData_education"-->
          <!--              @search="handleSearch($event,'formData_education')"-->
          <!--              @reset="reset"-->
          <!--            />-->
          <!--          </el-tab-pane>-->
          <!--          <el-tab-pane v-if="hasAuth('daycare.clazzCare.queryBatch', 'tabs', 'activeName')" label="托育班" name="nurseries">-->
          <!--            <etm-tool-bar-->
          <!--              v-model="formData_nurseries"-->
          <!--              @search="handleSearch($event,'formData_nurseries')"-->
          <!--              @reset="reset"-->
          <!--            />-->
          <!--          </el-tab-pane>-->
          <el-tab-pane
            v-if="hasAuth('daycare.room.queryBatch', 'tabs', 'activeName')"
            label="教室"
            name="class"
          >
            <etm-tool-bar
              v-model="formData_class"
              @search="handleSearch($event, 'formData_class')"
              @reset="reset"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <keep-alive>
          <component
            :is="tabComponent[activeName]"
            :search="searchInfo"
            :teacher="teacherList"
          />
        </keep-alive>
      </template>
    </etm-layout-split>
  </div>
</template>

<script>

/**
 * class create by Administrator
 * createTime 2020/8/31 9:27
 */

import Classes from './class/index'
// import Education from './education/index'
// import Nurseries from './nurseries/index'
import { queryEmployeeSelectByTabCode } from '@/api/base/employee'
import baseMixin from '@/layout/mixin/baseMixin'
// import { tabsConfig } from './common'

export default {
  name: 'Class',
  components: {
    Classes
    // Education,
    // Nurseries
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activeName: 'class',
      searchInfo: {},
      teacherList: [],
      tabComponent: {
        class: Classes
        // education: Education,
        // nurseries: Nurseries
      },
      formData_class: [
        {
          label: '教室名称',
          type: 'input',
          value: '',
          prop: 'roomName',
          props: {
            placeholder: '请输入教室名称'
          }
        }
        // , {
        //   label: '使用班级',
        //   type: 'input',
        //   prop: 'rt',
        //   value: '',
        //   props: {
        //     placeholder: '请输入班级名称'
        //   }
        // }, {
        //   label: '教师容量',
        //   type: 'select',
        //   value: 10,
        //   prop: 'rt',
        //   props: {
        //     placeholder: '请选择批次状态',
        //     clearable: true,
        //     filterable: true
        //   },
        //   options: [
        //     {
        //       label: '10',
        //       value: 10
        //     }, {
        //       label: '20',
        //       value: 20
        //     }
        //   ]
        // }
      ]
      // formData_education: [
      //   {
      //     label: '班级',
      //     type: 'input',
      //     prop: 'clazzName',
      //     value: '',
      //     props: {
      //       placeholder: '请输入班级名称'
      //     }
      //   }, {
      //     label: '班主任',
      //     type: 'select',
      //     prop: 'teacherId',
      //     props: {
      //       placeholder: '请选择班主任',
      //       clearable: true,
      //       filterable: true
      //     },
      //     value: '',
      //     options: []
      //   }
      // ],
      // formData_nurseries: [
      //   {
      //     label: '班级',
      //     type: 'input',
      //     prop: 'clazzName',
      //     value: '',
      //     props: {
      //       placeholder: '请输入班级名称'
      //     }
      //   }, {
      //     label: '班主任',
      //     type: 'select',
      //     prop: 'teacherId',
      //     props: {
      //       placeholder: '请选择班主任',
      //       clearable: true,
      //       filterable: true
      //     },
      //     value: '',
      //     options: []
      //   }
      // ]

    }
  },
  computed: {},
  watch: {},
  created () {
    // 获取班主任列表
    queryEmployeeSelectByTabCode({
      tagCode: ''
    }).then(res => {
      const result = res.data.map((cur) => {
        return {
          label: cur.name,
          value: cur.id
        }
      })

      this.teacherList = result
      // this.$set(this.formData_education[1], 'options', result)
      // this.$set(this.formData_nurseries[1], 'options', result)
    })
  },
  mounted () {
  },
  methods: {
    handleSearch (e, key) {
      const obj = {}

      this[key].forEach(cur => {
        obj[cur.prop] = cur.value || ''
      })

      this.$set(this, 'searchInfo', obj)
    },
    reset () {
      this.$set(this, 'searchInfo', {})
    },
    setting () {

    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  margin-top: 16px;
}
</style>
