<template>
  <div class="index-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs
          ref="tabs"
          v-model="activeName"
          :setting="hasAuthOfBool('daycare.course.setting')"
          @setting="toSetting"
        >
          <el-tab-pane
            v-if="hasAuth('daycare.clazzCare.queryBatch', 'tabs', 'activeName')"
            label="托育班级"
            name="nurseries"
          >
            <etm-tool-bar
              v-model="formData_nurseries"
              @search="handleSearch($event,'formData_nurseries')"
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

import Nurseries from './nurseries/index'
import { queryEmployeeSelectByTabCode } from '@/api/base/employee'
import baseMixin from '@/layout/mixin/baseMixin'
// import { queryClassroomList } from '@/api/daycare/classes'
// import { queryDaycareGenerationList } from '@/api/daycare/recipesManage'

export default {
  name: 'Class',
  components: {
    // Classes,
    // Education,
    // Nurseries
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activeName: 'nurseries',
      searchInfo: {},
      teacherList: [],
      clazzLists: [],
      daycareGenerationList: [],
      tabComponent: {
        // class: Classes,
        // education: Education,
        nurseries: Nurseries
      },
      formData_nurseries: [
        {
          label: '班级',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        }, {
          label: '班主任',
          type: 'select',
          prop: 'teacher',
          props: {
            placeholder: '请选择班主任',
            clearable: true,
            filterable: true
          },
          value: '',
          options: []
        }
      ]

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
          value: cur.name
        }
      })
      this.teacherList = result
      this.$set(this.formData_nurseries[1], 'options', result)
    })
  },
  mounted () {
  },
  methods: {

    toSetting () {
      this.$router.push({ name: 'standardcare_listEduSetting' })
    },
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
//.index-wrap {
//  margin-top: 16px;
//}
</style>
