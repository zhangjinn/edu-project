<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <div>
            <etm-tabs ref="tabs" v-model="activeName">
              <template v-for="(item, index) in tabsData">
                <el-tab-pane
                  :key="index"
                  :label="item.label"
                  :name="item.name"
                >
                  <etm-tool-bar v-model="item.searchData" @search="handleSearch" @reset="reset">
                    <el-form-item v-if="item.name === 'enter'" label="班级:" prop="clazzId">
                      <etm-clazz-cascader :clear="clear" @change="getClazz" />
                    </el-form-item>
                  </etm-tool-bar>
                </el-tab-pane>
              </template>
            </etm-tabs>
          </div>
        </div>
        <div slot="body">
          <not-enter v-if="activeName === 'notEnter'" :search-info="notEnterInfo" />
          <enter v-if="activeName === 'enter'" ref="enter" :search-info="enterInfo" />
          <leave v-if="activeName === 'leave'" :search-info="leaveInfo" />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by Administrator
 * createTime 2021/1/15 10:27
 */
import notEnter from './table/notEnter'
import enter from './table/enter'
import leave from './table/leave'
import EtmClazzCascader from '@/views/newDaycare/childManageGuard/EtmClazzCascader'
export default {
  name: 'Index',
  components: {
    notEnter,
    enter,
    leave,
    EtmClazzCascader
  },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      activeName: 'notEnter',
      tabsData: [
        {
          name: 'notEnter',
          label: '待入园',
          searchData: [
            {
              label: '幼儿姓名',
              type: 'input',
              prop: 'childName',
              value: '',
              props: {
                placeholder: '请输入幼儿姓名'
              }
            },
            {
              label: '联系人姓名',
              type: 'input',
              prop: 'parentName',
              value: '',
              props: {
                placeholder: '请输入联系人姓名'
              }
            },
            {
              label: '联系电话',
              type: 'input',
              prop: 'telephone',
              value: '',
              props: {
                placeholder: '请输入联系电话'
              }
            },
            {
              label: '登记日期',
              type: 'date',
              prop: 'date',
              value: '',
              props: {
                type: 'daterange',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
              }
            }
          ]
        },
        {
          name: 'enter',
          label: '在园',
          searchData: [
            {
              label: '幼儿姓名',
              type: 'input',
              prop: 'childName',
              value: '',
              props: {
                placeholder: '请输入幼儿姓名'
              }
            },
            {
              label: '家长姓名',
              type: 'input',
              prop: 'parentName',
              value: '',
              props: {
                placeholder: '请输入家长姓名'
              }
            },
            {
              label: '联系电话',
              type: 'input',
              prop: 'telephone',
              value: '',
              props: {
                placeholder: '请输入联系电话'
              }
            },
            {
              label: '入托时间',
              type: 'date',
              prop: 'date',
              value: '',
              props: {
                type: 'daterange',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
              }
            }
          ]
        },
        {
          name: 'leave',
          label: '退园',
          searchData: [
            {
              label: '幼儿姓名',
              type: 'input',
              prop: 'childName',
              value: '',
              props: {
                placeholder: '请输入幼儿姓名'
              }
            },
            {
              label: '家长姓名',
              type: 'input',
              prop: 'parentName',
              value: '',
              props: {
                placeholder: '请输入家长姓名'
              }
            },
            {
              label: '联系电话',
              type: 'input',
              prop: 'telephone',
              value: '',
              props: {
                placeholder: '请输入联系电话'
              }
            },
            {
              label: '退园日期',
              type: 'date',
              prop: 'date',
              value: '',
              props: {
                type: 'daterange',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期'
              }
            },
            {
              label: '退园原因',
              type: 'select',
              prop: 'outReason',
              value: '',
              options: [
                {
                  label: '毕业退园',
                  value: 'GRADUATION'
                },
                {
                  label: '转校退园',
                  value: 'TRANSFER'
                },
                {
                  label: '其他原因',
                  value: 'OTHER'
                }
              ],
              props: {
                placeholder: '请选择'
              }
            }
          ]
        }
      ],
      clazzValue: [],
      notEnterInfo: {},
      enterInfo: {},
      leaveInfo: {},
      clear: false
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    getClazz(value) {
      this.clazzValue = value
    },
    handleSearch(value) { // 搜索
      const searchInfo = {}
      value.forEach(item => {
        if (item.prop === 'date') {
          searchInfo.startDate = item.value[0]
          searchInfo.endDate = item.value[1]
        } else {
          searchInfo[item.prop] = item.value
        }
      })
      if (this.activeName === 'notEnter') {
        this.notEnterInfo = JSON.parse(JSON.stringify(searchInfo))
      } else if (this.activeName === 'enter') {
        if (this.clazzValue.length) {
          searchInfo.clazzId = this.clazzValue[1]
        }
        this.enterInfo = JSON.parse(JSON.stringify(searchInfo))
      } else {
        this.leaveInfo = JSON.parse(JSON.stringify(searchInfo))
      }
    },
    reset() { // 重置
      if (this.activeName === 'notEnter') {
        this.notEnterInfo = {}
      } else if (this.activeName === 'enter') {
        this.clazzValue = []
        this.clear = !this.clear
        this.enterInfo = {}
      } else {
        this.leaveInfo = {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {

}
</style>
