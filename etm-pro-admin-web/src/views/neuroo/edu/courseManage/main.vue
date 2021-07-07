<template>
  <div class="index-wrap">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="currentTab" setting @toggle="toggle" @setting="setting">
          <el-tab-pane label="学位表" name="first">
            <etm-tool-bar v-show="show" v-model="formData1" @search="handleSearch(formData1)" />
          </el-tab-pane>
          <el-tab-pane label="排课表" name="second">
            <etm-tool-bar v-show="show" v-model="formData2" @search="handleSearch(formData2)" />
          </el-tab-pane>
          <el-tab-pane label="学位统计" name="third">
            <etm-tool-bar v-show="show" v-model="formData3" @search="handleSearch2(formData3)" />
          </el-tab-pane>
        </etm-tabs>
      </div>
      <div slot="body">
        <!--学位表-->
        <template v-if="currentTab === 'first'">
          <EduDegreeList :query="queryObj" @change="change($event, formData1)" />
        </template>

        <!--排课表-->
        <template v-if="currentTab === 'second'">
          <eduSchedule :query="queryObj" @change="change($event, formData2)" />
        </template>

        <!--学位统计-->
        <template v-if="currentTab === 'third'">
          <EduTotal :query="queryObj" @change="change($event, formData3)" />
        </template>
      </div>
    </etm-layout-split>

  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import EduDegreeList from '@/views/neuroo/edu/courseManage/eduDegreeList'
import EduSchedule from '@/views/neuroo/edu/courseManage/eduSchedule'
import EduTotal from '@/views/neuroo/edu/courseManage/eduTotal'
import { querySubOrganizationList } from '@/api/base/base'
import { queryClazzForSelect } from '@/api/neuroo/edu/clazzManage'
import { parseTime } from '@/utils'

/**
 *  2020/4/17 9:26
 *  haijinsha
 */
export default {
  name: 'Index',
  components: { EduTotal, EduSchedule, EduDegreeList },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      currentTab: 'first',
      show: true,
      formData1: [
        {
          label: '课程时间',
          type: 'date',
          prop: 'date',
          value: '',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'month',
            placeholder: '请选择课程时间'
          }
        },
        {
          label: '所属园区',
          type: 'select',
          prop: 'schoolId',
          value: '',
          default: '',
          options: [],
          props: {
            placeholder: '请选择所属园区',
            clearable: true,
            filterable: true
          },
          events: {
            change: (e) => {
              this.getObjectByProp('clazzId', this.formData1).value = ''
              e && queryClazzForSelect({ schoolId: e }).then(res => {
                this.getObjectByProp('clazzId', this.formData1).options = this.convertDataToOptions(res.data, 'clazzName', 'clazzId')
              })
            }
          }
        },
        {
          label: '上课教室',
          type: 'select',
          prop: 'clazzId',
          value: '',
          default: '',
          options: [],
          props: {
            placeholder: '请选择上课教室',
            clearable: true,
            filterable: true
          }
        }
      ],
      formData2: [
        {
          label: '课程时间',
          type: 'date',
          prop: 'date',
          value: '',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'month',
            placeholder: '请选择课程时间'
          }
        },
        {
          label: '所属园区',
          type: 'select',
          prop: 'schoolId',
          value: '',
          default: '',
          options: [],
          props: {
            placeholder: '请选择所属园区',
            clearable: true,
            filterable: true
          },
          events: {
            change: (e) => {
              e && queryClazzForSelect({ schoolId: e }).then(res => {
                this.getObjectByProp('clazzId', this.formData2).value = ''
                this.getObjectByProp('clazzId', this.formData2).options = this.convertDataToOptions(res.data, 'clazzName', 'clazzId')
              })
            }
          }
        },
        {
          label: '上课教室',
          type: 'select',
          prop: 'clazzId',
          value: '',
          default: '',
          options: [],
          props: {
            placeholder: '请选择上课教室',
            clearable: true,
            filterable: true
          }
        }
      ],
      formData3: [
        {
          label: '课程时间',
          type: 'date',
          prop: 'date',
          value: '',
          default: parseTime(new Date(), '{y}-{m}-{d}'),
          props: {
            type: 'month',
            placeholder: '请选择课程时间'
          }
        },
        {
          label: '所属园区',
          type: 'select',
          prop: 'schoolId',
          value: '',
          default: '',
          options: [],
          props: {
            placeholder: '请选择所属园区',
            clearable: true,
            filterable: true
          }
        }
      ],
      queryObj: {}
    }
  },
  computed: {},
  watch: {
    currentTab: {
      handler(name) {
        this.queryObj = {}
        this.$nextTick(() => {
          if (name === 'first') {
            this.handleSearch(this.formData1)
          }
          if (name === 'second') {
            this.handleSearch(this.formData2)
          }
          if (name === 'third') {
            this.handleSearch2(this.formData3)
          }
        })
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    toggle(val) {
      this.show = val
    },
    init() {
      querySubOrganizationList({ tagCode: 'SCHOOL' }).then(res => {
        // const result = res.data.map(item => {
        //   return {
        //     label: item.name,
        //     value: item.id
        //   }
        // })
        const result = this.convertDataToOptions(res.data, 'name', 'id')
        this.getObjectByProp('schoolId', this.formData1).options = result
        this.getObjectByProp('schoolId', this.formData2).options = result
        this.getObjectByProp('schoolId', this.formData3).options = result

        const formData1School = this.getObjectByProp('schoolId', this.formData1)
        formData1School.options = result
        formData1School.value = formData1School.options[0].value
        formData1School.value && queryClazzForSelect({ schoolId: formData1School.value }).then(res => {
          // this.getObjectByProp('clazzId', this.formData1).options = this.convertDataToOptions(res.data, 'clazzName', 'clazzId')
          const objectByPropClazz = this.getObjectByProp('clazzId', this.formData1)
          objectByPropClazz.options = this.convertDataToOptions(res.data, 'clazzName', 'clazzId')
          objectByPropClazz.value = objectByPropClazz.options[0].value
          objectByPropClazz.value && this.handleSearch(this.formData1)
        })

        const formData2School = this.getObjectByProp('schoolId', this.formData2)
        formData2School.options = result
        formData2School.value = formData2School.options[0].value
        formData2School.value && queryClazzForSelect({ schoolId: formData2School.value }).then(res => {
          // this.getObjectByProp('clazzId', this.formData1).options = this.convertDataToOptions(res.data, 'clazzName', 'clazzId')
          const objectByPropClazz = this.getObjectByProp('clazzId', this.formData2)
          objectByPropClazz.options = this.convertDataToOptions(res.data, 'clazzName', 'clazzId')
          objectByPropClazz.value = objectByPropClazz.options[0].value
          objectByPropClazz.value && this.handleSearch(this.formData2)
        })

        const formData3School = this.getObjectByProp('schoolId', this.formData3)
        formData3School.options = [{ label: '全部园区', prop: '' }, ...result]
        formData3School.value = formData3School.options[0].value
        formData3School.value && this.handleSearch2(this.formData3)
      })
    },
    handleSearch(formData) {
      const date = this.getValueByProp('date', formData)
      const schoolId = this.getValueByProp('schoolId', formData)
      const clazzId = this.getValueByProp('clazzId', formData)
      if (!date) {
        return this.$message.warning('请选择日期')
      }
      if (!schoolId) {
        return this.$message.warning('请选择园区')
      }
      if (!clazzId) {
        return this.$message.warning('请选择教室')
      }
      const schoolName = this.getObjectByProp('schoolId', formData).options.find(item => schoolId === item.value).label
      const clazzName = this.getObjectByProp('clazzId', formData).options.find(item => item.value === clazzId).label
      this.queryObj = { date, schoolId, clazzId, schoolName, clazzName }
    },
    handleSearch2(formData) {
      const date = this.getValueByProp('date', formData)
      const schoolId = this.getValueByProp('schoolId', formData)
      if (!date) {
        return this.$message.warning('请选择日期')
      }
      // if (!schoolId) {
      //   return this.$message.warning('请选择园区')
      // }
      const schoolName = this.getObjectByProp('schoolId', formData).options.find(item => item.value === schoolId)
      this.queryObj = { date, schoolId, schoolName: schoolName && schoolName.label || '全部园区' }
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.init()
    },
    addClazz() {
      this.$store.commit('clazz/set_clazz_id', '')
      this.$emit('switch', { target: 'addClass', index: 0 })
    },
    edit(row) {
      console.log(row)
      this.$store.commit('clazz/set_clazz_id', row.clazzId)
      this.$emit('switch', { target: 'editClass', index: 1 })
    },
    setting() {
      this.$emit('switch', { target: 'setting', index: 2 })
    },
    // 日期联动
    change(date, formData) {
      this.getObjectByProp('date', formData).value = date
    }

  }
}
</script>

<style lang="scss" scoped>
  .index-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /*& /deep/ .EtmTablePage-wrap {*/
    /*  padding-bottom: 0;*/
    /*}*/

  }
</style>
