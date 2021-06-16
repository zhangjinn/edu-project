<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <div>
            <etm-tabs
              ref="tabs"
              v-model="activeName"
            >
              <template v-for="(item, index) in tabsData">
                <el-tab-pane
                  :key="index"
                  :label="item.label"
                  :name="item.name"
                >
                  <etm-tool-bar
                    v-model="item.searchData"
                    @search="handleSearch"
                    @reset="reset"
                  >
                    <el-form-item
                      v-if="item.name === 'enter'"
                      label="班级:"
                      prop="clazzId"
                    >
                      <etm-clazz-cascader
                        :clear="clear"
                        @change="getClazz"
                      />
                    </el-form-item>
                  </etm-tool-bar>
                </el-tab-pane>
              </template>
            </etm-tabs>
          </div>
        </div>
        <div slot="body">
          <not-enter-table
            v-if="activeName === 'notEnter'"
            :search-info="notEnterInfo"
          />
          <preparatory-table
            v-if="activeName === 'preparatory'"
            :search-info="preparatoryInfo"
          />
          <enter-table
            v-if="activeName === 'enter'"
            ref="enter"
            :search-info="enterInfo"
          />
          <leave-table
            v-if="activeName === 'leave'"
            :search-info="leaveInfo"
          />
          <all-table
            v-if="activeName === 'all'"
            :search-info="allInfo"
          />
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
import notEnterTable from './table/notEnter'
import enterTable from './table/enter'
import leaveTable from './table/leave'
import preparatoryTable from './table/preparatory'
import allTable from './table/all'
import EtmClazzCascader from '@/views/newDaycare/childManageGuard/EtmClazzCascader'
export default {
  name: 'Index',
  components: {
    notEnterTable,
    enterTable,
    leaveTable,
    preparatoryTable,
    allTable,
    EtmClazzCascader
  },
  filters: {},
  mixins: [],
  props: {},
  data () {
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
          name: 'preparatory',
          label: '预备生',
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
        },
        {
          name: 'all',
          label: '全部',
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
              label: '状态',
              type: 'select',
              prop: 'status',
              value: '',
              options: [
                {
                  label: '全部',
                  value: 'ALL'
                },
                {
                  label: '预备生',
                  value: 'PREPARATORY_STUDENT'
                },
                {
                  label: '在园',
                  value: 'IN'
                },
                {
                  label: '退园',
                  value: 'OUT'
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
      preparatoryInfo: {},
      enterInfo: {},
      leaveInfo: {},
      allInfo: {},
      clear: false
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
  },
  methods: {
    getClazz (value) {
      this.clazzValue = value
    },
    handleSearch (value) { // 搜索
      const searchInfo = {}
      value.forEach(item => {
        if (item.prop === 'date') {
          searchInfo.startDate = item.value[0]
          searchInfo.endDate = item.value[1]
        } else if (item.prop === 'status' && item.value === 'ALL') {
          searchInfo.status = null
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
      } else if (this.activeName === 'leave') {
        this.leaveInfo = JSON.parse(JSON.stringify(searchInfo))
      } else if (this.activeName === 'preparatory') {
        this.preparatoryInfo = JSON.parse(JSON.stringify(searchInfo))
      } else if (this.activeName === 'all') {
        this.allInfo = JSON.parse(JSON.stringify(searchInfo))
      }
    },
    reset () { // 重置
      if (this.activeName === 'notEnter') {
        this.notEnterInfo = {}
      } else if (this.activeName === 'enter') {
        this.clazzValue = []
        this.clear = !this.clear
        this.enterInfo = {}
      } else if (this.activeName === 'leave') {
        this.leaveInfo = {}
      } else if (this.activeName === 'preparatory') {
        this.preparatoryInfo = {}
      } else if (this.activeName === 'all') {
        this.allInfo = {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
