<template>
  <div class="index-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs
          ref="tabs"
          v-model="activeName"
          @setting="setting"
        >
          <el-tab-pane
            v-if="hasAuth('daycare.clazzTeach.queryBatch', 'tabs', 'activeName')"
            label="早教班级"
            name="education"
          >
            <etm-tool-bar
              v-model="formData_education"
              @search="handleSearch($event,'formData_education')"
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

import Education from './index'
import { queryEmployeeSelectByTabCode } from '@/api/base/employee'
import baseMixin from '@/layout/mixin/baseMixin'

export default {
  name: 'Class',
  components: {
    Education
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activeName: 'education',
      searchInfo: {},
      teacherList: [],
      tabComponent: {
        education: Education
      },
      formData_education: [
        {
          label: '班级',
          type: 'input',
          prop: 'clazzName',
          value: '',
          props: {
            placeholder: '请输入班级名称'
          }
        },
        // {
        //   label: '剩余学位',
        //   type: 'select',
        //   prop: 'clazzName',
        //   value: '',
        //   props: {
        //     placeholder: '请选择剩余学位',
        //     clearable: true,
        //     filterable: true
        //   },
        //   options: [
        //     {
        //       label: '大于0',
        //       value: 10
        //     }, {
        //       label: '大于5',
        //       value: 20
        //     }, {
        //       label: '大于10',
        //       value: 20
        //     }
        //   ]
        // },
        {
          label: '班主任',
          type: 'select',
          prop: 'teacherId',
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
          value: cur.id
        }
      })

      this.teacherList = result
      this.$set(this.formData_education[2], 'options', result)
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
