<template>
  <div class="index-wrap">
    <etm-layout-split>
      <template slot="header">
        <etm-tabs v-model="activeName" setting @setting="setting">
          <el-tab-pane
            v-for="(item, index) in tabPane"
            :key="index"
            :label="item.label"
            :name="item.value"
          >
            <etm-tool-bar
              v-if="item['tools']"
              v-model="item.tools"
              @search="handleSearch($event, item.value)"
              @reset="reset"
            />
          </el-tab-pane>
        </etm-tabs>
      </template>
      <template slot="body">
        <component :is="components[activeName]" :props="props" />
      </template>
    </etm-layout-split>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2020/9/16 16:24
 */
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      components: {
        course: () => import('./course'),
        degree: () => import('./degree'),
        schedule: () => import('./schedule')
      },
      activeName: 'schedule',
      props: {},
      tabPane: [
        {
          value: 'course',
          label: '托育排课表',
          tools: [{
            label: '课程',
            type: 'input',
            value: '',
            prop: '123',
            props: {
              placeholder: '请输入课程名称'
            }
          }, {
            label: '教室',
            type: 'input',
            value: '',
            prop: '123',
            props: {
              placeholder: '请输入教室名称'
            }
          }, {
            label: '老师',
            type: 'input',
            value: '',
            prop: '123',
            props: {
              placeholder: '请输入老师名称'
            }
          }]
        },
        {
          value: 'degree',
          label: '托育学位',
          tools: []
        },
        {
          value: 'schedule',
          label: '班级一周日程',
          tools: [{
            label: '班级',
            props: {
              placeholder: '请选择班级',
              clearable: true,
              filterable: true
            },
            type: 'select',
            value: '',
            prop: '',
            options: [
              {
                label: '深林班',
                value: ''
              }
            ]
          }]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    setting() {
      this.$router.push('/newdaycare_setting/courseTimeMange_setting')
    },
    handleSearch(event) {

    },
    reset() {

    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  margin-top: 16px;
}
</style>
