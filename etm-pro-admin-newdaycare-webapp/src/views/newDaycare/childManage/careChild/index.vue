<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            ref="tabs"
            v-model="currentTab"
          >
            <el-tab-pane
              v-if="hasAuth('daycare.childSettled.queryBatch', 'tabs', 'activeTab')"
              label="已成交学员"
              name="DEAL_CARE"
            >
              <search-field
                category="DEAL_CARE"
                @query="query"
                @change="fieldChange"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="hasAuth('daycare.childLeave.queryBatch', 'tabs', 'activeTab')"
              label="历史学员"
              name="HISTORY_CARE"
            >
              <search-field
                category="HISTORY_CARE"
                @query="query"
                @change="fieldChange"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>

        <div slot="body">
          <template v-if="currentTab === 'DEAL_CARE'">
            <etm-table-page
              v-fixedHead
              :data="tableData2"
              index-type="index"
              selection
              border
              @currentChange="currentChange"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                slot="left"
                label="学员姓名"
                fixed="left"
                width="150"
              >
                <template v-slot="{row}">
                  <etm-text
                    type="primary"
                    @click="handleRowClick(row)"
                  >
                    {{ row.name }}
                  </etm-text>
                </template>
              </el-table-column>
              <el-table-column
                slot="left"
                label="联系人姓名"
                fixed="left"
                width="100"
              >
                <template v-slot="{row}">
                  {{ row.parentName && row.parentName.split(',')[0] }}
                </template>
              </el-table-column>
              <el-table-column
                slot="left"
                label="联系人电话"
                fixed="left"
                width="150"
              >
                <template v-slot="{row}">
                  {{ row.parentPhone && row.parentPhone.split(',')[0] }}
                </template>
              </el-table-column>
              <el-table-column
                slot="left"
                label="性别"
                width="120"
              >
                <template v-slot="{row}">
                  <span>{{ row.gender }}</span>
                </template>
              </el-table-column>

              <el-table-column
                slot="left"
                label="年龄"
                width="220"
              >
                <template v-slot="{row}">
                  <span>{{ row.age }}</span>
                </template>
              </el-table-column>
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="早教剩余课时"-->
              <!--                width="180"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <div-->
              <!--                    v-for="(le, i) of row.tcLesson"-->
              <!--                    :key="i"-->
              <!--                  >-->
              <!--                    <etm-field-label-->
              <!--                      v-if="!!le.courseName"-->
              <!--                      :label="le.courseName"-->
              <!--                    >-->
              <!--                      {{-->
              <!--                        le.lesson-->
              <!--                      }}课时-->
              <!--                    </etm-field-label>-->
              <!--                  </div>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column
                slot="left"
                label="所在班级"
                min-width="120"
              >
                <template v-slot="{row}">
                  <span>{{ row.caClazzName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                slot="left"
                label="入托日期"
                min-width="120"
              >
                <template v-slot="{row}">
                  <span>{{ row.dateOfAdmission }}</span>
                </template>
              </el-table-column>
              <el-table-column
                slot="left"
                min-width="180"
              >
                <div slot="header">
                  托育剩余天数
                  <el-tooltip
                    popper-class="stepTips"
                    placement="bottom"
                  >
                    <div slot="content">
                      根据合同有效期计算得到，其中<br>不包含园区休息日和已请假天数
                    </div>
                    <i class="iconfont iconquestion-circle" />
                  </el-tooltip>
                </div>
                <template v-slot="{row}">
                  <span>{{ row.caSurplusDay }}天</span>
                </template>
              </el-table-column>
              <el-table-column
                slot="left"
                label="家长端激活"
                min-width="120"
              >
                <template v-slot="{row}">
                  <span>{{ row.activationStatus }}</span>
                </template>
              </el-table-column>
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="学员类型"-->
              <!--                min-width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.typeList }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="学员状态"-->
              <!--                width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.statusName }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="学员来源"-->
              <!--                width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.sourceName }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="重要程度"-->
              <!--                width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.importanceName }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="下次跟进时间"-->
              <!--                min-width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.nextFollowTime }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="最后跟进时间"-->
              <!--                min-width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.followTime }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="跟进人员"-->
              <!--                width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.followerName }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->

              <el-table-column
                slot="right"
                fixed="right"
                width="280"
                label="操作"
              >
                <template v-slot="{row}">
                  <etm-text
                    type="primary"
                    @click="handleCall(row,$event)"
                  >
                    打电话
                  </etm-text>
                  <etm-text
                    type="primary"
                    @click="handleSms(row)"
                  >
                    发短信
                  </etm-text>
                  <etm-text
                    type="primary"
                    @click="handleSignUp({...row, signUpType : 'EARNEST', new : 'n'})"
                  >
                    托育续约
                  </etm-text>
                </template>
              </el-table-column>
            </etm-table-page>
          </template>
          <template v-if="currentTab === 'HISTORY_CARE'">
            <etm-table-page
              v-fixedHead
              :data="tableData3"
              index-type="index"
              selection
              border
              @currentChange="currentChange"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                slot="left"
                label="学员姓名"
                fixed="left"
                width="150"
              >
                <template v-slot="{row}">
                  <etm-text
                    type="primary"
                    @click="handleRowClick(row)"
                  >
                    {{ row.name }}
                  </etm-text>
                </template>
              </el-table-column>
              <el-table-column
                slot="left"
                label="联系人姓名"
                fixed="left"
                width="100"
              >
                <template v-slot="{row}">
                  {{ row.parentName && row.parentName.split(',')[0] }}
                </template>
              </el-table-column>
              <el-table-column
                slot="left"
                label="联系人电话"
                fixed="left"
                width="150"
              >
                <template v-slot="{row}">
                  {{ row.parentPhone && row.parentPhone.split(',')[0] }}
                </template>
              </el-table-column>
              <el-table-column
                slot="left"
                label="性别"
                width="120"
              >
                <template v-slot="{row}">
                  <span>{{ row.gender }}</span>
                </template>
              </el-table-column>

              <el-table-column
                slot="left"
                label="年龄"
                width="100"
              >
                <template v-slot="{row}">
                  <span>{{ row.age }}</span>
                </template>
              </el-table-column>
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="早教剩余课时"-->
              <!--                width="180"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <div-->
              <!--                    v-for="(le, i) of row.tcLesson"-->
              <!--                    :key="i"-->
              <!--                  >-->
              <!--                    <etm-field-label-->
              <!--                      v-if="!!le.courseName"-->
              <!--                      :label="le.courseName"-->
              <!--                    >-->
              <!--                      {{-->
              <!--                        le.lesson-->
              <!--                      }}课时-->
              <!--                    </etm-field-label>-->
              <!--                  </div>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column
                slot="left"
                label="所在班级"
                min-width="120"
              >
                <template v-slot="{row}">
                  <span>{{ row.caClazzName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                slot="left"
                label="入托日期"
                min-width="120"
              >
                <template v-slot="{row}">
                  <span>{{ row.dateOfAdmission }}</span>
                </template>
              </el-table-column>
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="家长端激活"-->
              <!--                min-width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.activationStatus }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="学员类型"-->
              <!--                min-width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.typeList }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column
                slot="left"
                label="学员状态"
                width="120"
              >
                <template v-slot="{row}">
                  <span>{{ row.statusName }}</span>
                </template>
              </el-table-column>
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="学员来源"-->
              <!--                width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.sourceName }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="重要程度"-->
              <!--                width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.importanceName }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="下次跟进时间"-->
              <!--                min-width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.nextFollowTime }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="最后跟进时间"-->
              <!--                min-width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.followTime }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <!--              <el-table-column-->
              <!--                slot="left"-->
              <!--                label="跟进人员"-->
              <!--                width="120"-->
              <!--              >-->
              <!--                <template v-slot="{row}">-->
              <!--                  <span>{{ row.followerName }}</span>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column
                slot="right"
                fixed="right"
                width="300"
                label="操作"
              >
                <template v-slot="{row}">
                  <etm-text
                    type="primary"
                    @click="handleCall(row,$event)"
                  >
                    打电话
                  </etm-text>
                  <etm-text
                    type="primary"
                    @click="handleSms(row)"
                  >
                    发短信
                  </etm-text>
                  <etm-text
                    type="primary"
                    @click="handleSignUp({...row, signUpType : 'EARNEST'})"
                  >
                    托育续约
                  </etm-text>
                </template>
              </el-table-column>
            </etm-table-page>
          </template>
        </div>
        <!--学员详情-->
        <etm-drawer
          :visible.sync="childDetail.visible"
          type="big"
        >
          <etm-layout-split
            v-if="childDetail.visible"
            :left-styles="{minWidth: '560px', maxWidth: '560px'}"
            :styles="{height: '100vh'}"
            class="child-info-box"
          >
            <div
              slot="left"
              class="left"
            >
              <child-logs
                :child-id="childDetail.childId"
                log-type="CARE"
              />
            </div>
            <div
              slot="right"
              class="right"
            >
              <child-info
                :child-id="childDetail.childId"
                :category="currentTab"
                @update="update"
                @next="handleNext"
                @prevChild="prevChild"
              />
            </div>
          </etm-layout-split>
        </etm-drawer>

        <!--跟进-->
        <etm-drawer
          :visible.sync="followData.visible"
          type="big"
        >
          <etm-layout-split
            v-if="followData.visible"
            :left-styles="{minWidth: '560px', maxWidth: '560px'}"
            :styles="{height: '100vh'}"
            class="follow-box"
          >
            <div
              slot="left"
              class="left"
            >
              <child-follow-panel
                :child-id="childDetail.childId"
                :child-name="childDetail.childName"
                @next="handleNext"
                @update="childLogUpdate"
              />
            </div>
            <div
              slot="right"
              class="left"
            >
              <child-info
                ref="childInfo"
                :child-id="childDetail.childId"
                :category="currentTab"
                @update="update"
                @next="handleNext"
                @prevChild="prevChild"
              />
            </div>
          </etm-layout-split>
        </etm-drawer>
        <!--打电话-->
        <etm-pop
          pop="simple"
          :visible.sync="showCall"
          title="选择联系人"
          @close="showCall = false"
          @cancel="showCall = false"
          @confirm="showCall = false"
        >
          <ul>
            <li
              v-for="(item, index) of currentRow.parentName"
              :key="index"
              class="callLi"
            >
              <div>{{ item }} <span>{{ currentRow.parentPhone[index] }}</span></div>
              <etm-text
                type="primary"
                @click="callPhone(currentRow.parentPhone[index], item)"
              >
                <i
                  class="iconfont iconphone"
                />拨打
              </etm-text>
            </li>
          </ul>
        </etm-pop>

        <!--发短信-->
        <etm-pop
          pop="simple"
          :visible.sync="showMessage"
          title="发短信"
          @close="showMessage = false"
          @cancel="showMessage = false"
          @confirm="showMessage = false"
        >
          <ul>
            <li
              v-for="(item, index) of currentRow.parentName"
              :key="index"
            >
              <etm-field-label :label="`${item}`">
                <template style="cursor: pointer;">
                  {{ currentRow.parentPhone[index] }}
                  <etm-text
                    type="primary"
                    @click="handleSendMessage(currentRow.parentPhone[index])"
                  >
                    发短信
                  </etm-text>
                </template>
              </etm-field-label>
            </li>
          </ul>
        </etm-pop>
        <!--        签约组件-->
        <sign-up
          ref="signup"
          :prop="signUpProp"
        />

        <kindergarten
          ref="kindergarten"
          :prop="kindergartenParams"
          @success="update"
        />

        <send-message
          ref="sendMessage"
          :send-message="sendMessageData"
        />
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
import baseMixin from '@/layout/mixin/baseMixin'
import kindergarten from '@/views/newDaycare/childManage/myChild/components/kindergarten'
import { uploadFile } from '@/api/base'
// import { Loading } from 'element-ui-etm'
import {
  queryChildList,
  removeChildOnBatch,
  updateChildResourceStatus
  // uploadFileBatchImport
} from '@/api/newDaycare/childManage'
import { createCall } from '@/api/newDaycare/yunCall'
import { parseTime } from '@/utils'
import SearchField from '@/views/newDaycare/childManage/myChild/components/searchField'
import ChildInfo from '@/views/newDaycare/childManage/myChild/components/childInfo'
import ChildLogs from '@/views/newDaycare/childManage/careChild/childLogs'
import ChildFollowPanel from '@/views/newDaycare/childManage/myChild/components/childFollowPanel'
import signUp from '@/views/newDaycare/contract/components/singUp'
import SendMessage from '@/views/newDaycare/childManage/myChild/components/sendMessage'

/**
 * index create by haijinsha
 * createTime 2020/8/25 10:11
 */
export default {
  name: 'Index',
  components: {
    kindergarten,
    SendMessage,
    ChildFollowPanel,
    ChildLogs,
    ChildInfo,
    SearchField,
    signUp
  },
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      kindergartenParams: {},
      signUpProp: {},
      currentTab: 'DEAL_CARE',
      uploadFile: uploadFile,
      aboutCourseProp: {},
      auditionCourseProp: {},
      searchItems: [],
      // 快捷筛选
      quickScreening: null,
      fieldList: [],
      formData: [],
      typeEnum: {
        CARE: '托育',
        TEACH: '早教',
        GUARD: '幼儿园'
      },
      tableData: { content: [] },
      // 跟进人员
      followers: [],
      // 已选中的学员
      selected: [],
      childDetail: {
        visible: false,
        activeTab: 'follow',
        childId: '',
        childName: ''
      },
      // 市场人员
      markers: [],
      followData: {
        visible: false
      },
      flag: false,
      currentRow: {},
      target: null,
      showCall: false,
      tableData2: {
        content: []
      },
      tableData3: {
        content: []
      },
      showMessage: false,
      sendMessageData: {
        phone: '',
        childId: ''
      }
    }
  },
  computed: {},
  watch: {
    currentTab () {
      this.fieldList = []
      this.init()
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    kindergarten (row) {
      this.kindergartenParams = row
      this.$refs.kindergarten.show()
    },
    init () {
      // 已成交
      // const fieldList = this.fieldList.concat({ field: 'TYPE_LIST', operation: 'LIKE', value: 'CARE' })
      if (this.currentTab === 'DEAL_CARE') {
        queryChildList({
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize,
          // quickScreening: this.quickScreening,
          category: 'DEAL_CARE',
          fieldList: this.fieldList
        }).then(res => {
          this.tableData2 = res.data
          this.tableData2.content.forEach(item => {
            item.createTime = parseTime(item.createTime, '')
            item.followTime = item.followTime ? parseTime(item.followTime, '') : ''
            item.nextFollowTime = item.nextFollowTime ? parseTime(item.nextFollowTime, '') : ''
            item.activationStatus = item.activationStatus ? '已激活' : '未激活'
            item.caSurplusDay = item.caSurplusDay ? item.caSurplusDay : 0
            item.dateOfAdmission = item.dateOfAdmission ? parseTime(item.dateOfAdmission, '{y}-{m}-{d}') : ''
            item.typeList = (item.typeList || '').split(',').map(cur => this.typeEnum[cur]).join('、')
          })
        })
      }

      if (this.currentTab === 'HISTORY_CARE') {
        queryChildList({
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize,
          // quickScreening: this.quickScreening,
          category: 'HISTORY_CARE',
          fieldList: this.fieldList
        }).then(res => {
          this.tableData3 = res.data
          this.tableData3.content.forEach(item => {
            item.createTime = parseTime(item.createTime, '')
            item.followTime = item.followTime ? parseTime(item.followTime, '') : ''
            item.nextFollowTime = item.nextFollowTime ? parseTime(item.nextFollowTime, '') : ''
            item.activationStatus = item.activationStatus ? '已激活' : '未激活'
            item.dateOfAdmission = item.dateOfAdmission ? parseTime(item.dateOfAdmission, '{y}-{m}-{d}') : ''
            item.typeList = (item.typeList || '').split(',').map(cur => this.typeEnum[cur]).join('、')
          })
        })
      }
    },
    childLogUpdate () {
      this.$refs.childInfo.updateStep()
    },
    // 搜索条件
    handleSearch () {

    },
    showCourse (row, classType, type) {
      this.aboutCourseProp = {
        childId: row.id,
        childName: row.name,
        classType,
        type
      }

      this.$nextTick(() => {
        this.$refs.aboutCourse.show()
      })
    },
    showCourseCase (row, classType, type) {
      this.auditionCourseProp = {
        childId: row.id,
        childName: row.name,
        classType,
        type
      }

      this.$nextTick(() => {
        this.$refs.auditionCourse.show()
      })
    },
    // 快捷筛选
    searchChange (item) {
      this.quickScreening = item
      this.init()
    },

    // 快捷条件
    query (data) {
      console.log(data)
      this.fieldList = data
      this.pageInfo.pageNum = 1
      this.init()
    },
    fieldChange (data) {
      this.searchItems = data.map(item => {
        return {
          name: item.value,
          value: item.key
        }
      })
      this.searchItems.unshift({
        name: '全部',
        value: null
      })
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init(this.currenrQuery)
    },
    showAddChildVisible () {
      this.addChildVisible = true
    },
    changeCommand (command) {
      this[command]()
    },
    handleGiveUp () {
      this.$etmTip.init({
        type: 'error',
        title: '确认放弃学员？',
        content: '放弃后将无法撤销，是否继续操作？',
        confirmBtn: '确定',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          updateChildResourceStatus({ childIdList: this.selected.map(item => item.id) }).then(res => {
            this.$message.success('操作成功')
            this.$etmTip.close()
            this.init()
          })
        }
      })
      this.$etmTip.open()
    },
    handleNext (childId) {
      if (this.currentTab === 'DEAL_CARE') {
        let index = this.tableData2.content.findIndex(item => item.id === childId)
        if (index >= 0 && index !== this.tableData2.content.length - 1) {
          this.childDetail.childId = this.tableData2.content[++index].id
        } else {
          this.$message.info('该学员是当前页的最后一位')
        }
      } else if (this.currentTab === 'HISTORY_CARE') {
        let index = this.tableData3.content.findIndex(item => item.id === childId)
        if (index >= 0 && index !== this.tableData3.content.length - 1) {
          this.childDetail.childId = this.tableData3.content[++index].id
        } else {
          this.$message.info('该学员是当前页的最后一位')
        }
      }
    },
    prevChild (childId) {
      if (this.currentTab === 'DEAL_CARE') {
        let index = this.tableData2.content.findIndex(item => item.id === childId)
        if (index > 0) {
          this.childDetail.childId = this.tableData2.content[--index].id
        } else {
          this.$message.info('该学员是当前页的第一位')
        }
      } else if (this.currentTab === 'HISTORY_CARE') {
        let index = this.tableData3.content.findIndex(item => item.id === childId)
        if (index > 0) {
          this.childDetail.childId = this.tableData3.content[--index].id
        } else {
          this.$message.info('该学员是当前页的第一位')
        }
      }
    },
    batchAssignManage () {
      this.$router.push({ name: 'newdaycare_assignBatch' })
    },
    batchImportManage () {
      this.$router.push({ name: 'newdaycare_importBatch' })
    },
    // 批量删除学员
    batchRemove () {
      if (!this.selected.length) {
        this.$message.info('请先选择学员')
        return false
      }
      this.$etmTip.init({
        type: 'error',
        title: '确认删除学员？',
        content: '删除后将无法撤销，是否继续操作？',
        confirmBtn: '确定',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          removeChildOnBatch({ childIdList: this.selected.map(item => item.id) }).then(res => {
            this.$message.success('操作成功')
            this.$etmTip.close()
            this.init()
          })
        }
      })
      this.$etmTip.open()
    },

    // 表格多选
    handleSelectionChange (e) {
      this.selected = e
    },
    // 学员详情
    handleRowClick (row) {
      this.childDetail.visible = true
      this.childDetail.childId = row.id
      this.childDetail.childName = row.childName
    },
    // 分配学员
    submitAssignChild () {
      this.$refs.assignChild.submitAssignChild()
    },
    handleFollow (row) {
      this.followData.visible = true
      this.childDetail.childId = row.id
      // this.childDetail.childName = row.name
    },
    update () {
      this.pageInfo = {
        pageSize: 10,
        pageNum: 1
      }
      this.init()
      const childId = this.childDetail.childId
      // const childName = this.childDetail.childName
      this.childDetail.childId = ''
      // this.childDetail.childName = ''
      setTimeout(() => {
        this.childDetail.childId = childId
      }, 16)
    },
    handleCall (row, event) {
      console.log(row)
      this.currentRow = { ...row }
      this.currentRow.parentPhone = this.currentRow.parentPhone.split(',')
      this.currentRow.parentName = this.currentRow.parentName.split(',')
      if (Array.isArray(this.currentRow.parentName) && this.currentRow.parentName.length > 1) {
        this.target = event
        this.showCall = true
      } else {
        this.callPhone(this.currentRow.parentPhone.join(), this.currentRow.parentName.join())
      }
    },
    callPhone (telephone, name) {
      this.showCall = false

      this.$etmTip.init({
        type: 'warn',
        title: `确定要拨打给 ${name} ${telephone} 吗？`,
        content: '系统将在您确认拨打电话后自动为您拨号，请留意接听您的手机。',
        confirmBtn: '拨打',
        cancelBtn: '取消',
        confirm: () => {
          createCall({ childId: this.currentRow.id, telephone }).then(res => {
            this.$message.success('操作成功')
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    handleSms (row, event) {
      // this.currentRow = { ...row }
      // this.currentRow.parentPhone = this.currentRow.parentPhone.split(',')
      // this.currentRow.parentName = this.currentRow.parentName.split(',')
      // this.showMessage = true
      // console.log(row)

      this.sendMessageData.phone = row.parentPhone.split(',')
      this.sendMessageData.parentName = row.parentName.split(',')
      this.sendMessageData.childId = this.currentRow.id
      this.$refs.sendMessage.handleVisible(true)
    },
    handleSendMessage (phone) {
      this.sendMessageData.phone = phone
      this.sendMessageData.childId = this.currentRow.id
      this.$refs.sendMessage.handleVisible(true)
    },
    handleTry () {
    },
    handleBooking (row) {
      this.deposit.visible = true
      this.currentRow = row
    },
    handleSignUp (row) {
      this.signUpProp = { id: row.id, name: row.name, type: this.currentTab, signUpType: row.signUpType, new: row.new }

      this.$nextTick(() => {
        this.$refs.signup.show()
      })
      // console.log(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.addChildren {
  ::v-deep {
    .el-dialog__body {
      margin-top: 16px;
    }
  }
}

.callLi {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  i {
    font-size: 12px;
  }

  div {
    span {
      color: #999;
    }
  }
}

::v-deep .EtmDrawer-wrap {
  .EtmLayoutSplit-wrap {
    .layout-left {
      margin-right: 8px;
    }
  }
}

</style>
