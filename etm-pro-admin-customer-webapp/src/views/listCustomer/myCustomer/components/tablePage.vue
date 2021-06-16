<template>
  <div class="tablePage-wrap">
    <etm-table-page
      v-fixedHead
      :columns="columns"
      :data="tableData"
      selection
      @currentChange="currentChange"
      @selection-change="selection"
    >
      <etm-table-tool-bar slot="tool">
        <etm-table-digit
          v-if="currentTab === 'UNSOLD'"
          :data="tipData"
        />

        <div slot="right">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="$refs.addChild.show()"
          >
            添加客户
          </el-button>
          <el-button
            v-if="currentTab === 'UNSOLD'"
            type="primary"
            @click="importPop"
          >
            批量导入
          </el-button>
          <el-button
            :disabled="!selectionData.length"
            type="primary"
            @click="$refs.assignChild.show()"
          >
            分配客户
          </el-button>
          <el-dropdown @command="changeCommand">
            <el-button plain>
              更多<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="batchGiveUp">
                放弃客户
              </el-dropdown-item>
              <!--              <el-dropdown-item command="batchImportTable">导出表格</el-dropdown-item>-->
              <el-dropdown-item command="batchDelete">
                批量删除
              </el-dropdown-item>
              <el-dropdown-item
                v-if="currentTab === 'UNSOLD'"
                command="batch"
              >
                批次记录
              </el-dropdown-item>
              <el-dropdown-item command="showSetting">
                显示设置
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </etm-table-tool-bar>

      <el-table-column
        slot="left"
        width="120"
        align="center"
        label="客户头像"
        fixed
      >
        <template v-slot="{row}">
          <div class="logo">
            <template v-if="row.avatar !== '--'">
              <el-image
                :src="row.avatar"
                fit="cover"
                style="width:70px; height:70px"
              />
            </template>
            <div
              v-else
              class="avatar"
            >
              <i class="iconfont iconmorentouxiang" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        slot="left"
        min-width="120"
        label="客户名称"
        fixed
      >
        <template v-slot="{row}">
          <!--          showCustomer-->
          <etm-text @click="followCustomer(row, '')">
            {{ row.name }}
          </etm-text>
        </template>
      </el-table-column>

      <el-table-column
        slot="right"
        width="200"
        label="操作"
        fixed="right"
      >
        <template v-slot="{row}">
          <etm-text @click="followCustomer(row, 'follow')">
            跟进
          </etm-text>
          <etm-text @click="singUp(row)">
            签单
          </etm-text>
          <etm-text @click="showCustomer(row, true, true)">
            编辑
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <!--    签单-->
    <sing-up
      ref="singUp"
      :prop="singUpItem"
      @success="$emit('update')"
    />

    <!--    添加客户-->
    <add-child
      ref="addChild"
      :type="currentTab"
      @success="$emit('update')"
    />

    <import-tem
      ref="importTem"
      :current-tab="currentTab"
      @success="$emit('update')"
    />

    <assign-child
      ref="assignChild"
      :selected-customer-row="selectionData"
      @upate="$emit('update')"
    />

    <etm-pop
      title="显示设置"
      cancel-btn="取消"
      :visible="settingDisable"
      @cancel="settingCancel"
      @close="settingCancel"
      @confirm="settingConfirm"
    >
      <el-checkbox-group v-model="settingChoice">
        <div
          v-for="(item, index) in settingData"
          :key="index"
        >
          <el-checkbox
            :label="index"
            :disabled="['avatar', 'name'].includes(item.key)"
          >
            {{ item.name || columns_system[item.key] }}
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </etm-pop>

    <!--    客户详情-->
    <etm-drawer
      :visible.sync="childPop"
    >
      <etm-layout-split
        :styles="{height: '100vh'}"
        class="child-info-box"
      >
        <child-info
          v-if="childPop"
          ref="childInfo"
          :child-id="childId"
          :drawer-path="drawerPath"
          :category="currentTab"
          @handleEdit="drawerPath = $event"
          @prevChild="prevChild"
          @next="handleNext"
          @upate="$emit('update')"
          @handleCancel="childPop = false"
        />
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
            ref="childFollowPanel"
            :child-id="childId"
            :is-follow="isFollow"
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
            :child-id="childId"
            :category="currentTab"
            :drawer-path="drawerPath"
            @update="$emit('update')"
            @next="handleNext"
            @prevChild="prevChild"
            @handleEdit="drawerPath = $event"
            @handleCancel="followData.visible = false"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import singUp from '@/views/listCustomer/myCustomer/components/pops/singUp'
import EtmTableDigit from '@/components/EtmTableDigit'
import addChild from '@/views/listCustomer/myCustomer/components/pops/addChild'
import childFollowPanel from '@/views/listCustomer/myCustomer/components/pops/childFollowPanel'
import childInfo from '@/views/listCustomer/myCustomer/components/pops/childInfo'
import importTem from '@/views/listCustomer/myCustomer/components/pops/importTem'
import assignChild from '@/views/listCustomer/myCustomer/components/pops/assignChild'

import {
  queryDisableSetting,
  createFieldSetting,
  giveUpCustomer,
  removeCustomer,
  createFollowTotal
} from '@/api/customer'
// import { deleteOrder } from '@/api/sacc/enrollmentManage'

export default {
  name: 'TablePage',
  components: {
    EtmTableDigit,
    addChild,
    singUp,
    childFollowPanel,
    childInfo,
    importTem,
    assignChild
  },
  props: {
    currentTab: {
      type: String,
      default: 'UNSOLD'
    },
    params: {
      type: Object,
      default () {
        return {}
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    tableData: {
      type: Object,
      default () {
        return {
          content: []
        }
      }
    }
  },
  data () {
    return {
      drawerPath: false,
      isFollow: false,
      singUpItem: {},
      selectionData: [],
      settingData: {},
      settingChoice: [],
      settingDisable: false,
      followData: {
        visible: false
      },
      columns_system: {
        avatar: '客户头像',
        name: '客户名称',
        contactTelephone: '联系人电话',
        gender: '性别',
        telephone: '客户电话',
        contactName: '联系人姓名',
        importantLevel: '重要程度',
        abandoner: '放弃人',
        source: '来源',
        lastFollowTime: '最后跟进时间',
        marketer: '市场人员',
        counselor: '跟进人员',
        nextFollowTime: '下次跟进时间',
        sales_stage: '销售阶段',
        age: '年龄'
      },
      childDetail: {
        visible: false,
        activeTab: 'follow',
        childId: '',
        childName: ''
      },
      childPop: false,
      childId: 0,
      // bookDefaultCover: require('@/assets/images/daycare/book-cover.png'),
      tipData: [
        {
          digit: 0,
          text: '今天待跟进'
        },
        {
          digit: 0,
          text: '今天已跟进'
        }, {
          digit: 0,
          text: '无跟进计划'
        }
      ]
    }
  },
  watch: {
    settingDisable: {
      handler (n) {
        if (n) {
          queryDisableSetting(false).then(res => {
            this.settingData = res.data.map((cur, index) => {
              if (cur.display) {
                this.settingChoice.push(index)
              }
              return cur
            })
          })

          console.log(this.settingChoice)
        }
      }
    }
  },
  created () {
    createFollowTotal({
      op: null,
      deal: null,
      paged: null,
      quickFindType: null,
      pool: null,
      pageSize: null,
      minFollowTime: null,
      items: null,
      pageNum: null,
      maxFollowTime: null
    }).then(res => {
      this.tipData[0].digit = res.data.needFollowTodayTotal
      this.tipData[1].digit = res.data.followUpTodayTotal
      this.tipData[2].digit = res.data.neverFollowUpPlanTotal
    })
  },
  methods: {
    currentChange (pageNumber, pageSize) {
      this.$emit('currentChange', { pageNumber, pageSize })
    },
    selection (e) {
      this.selectionData = e
    },
    // getSelected() {
    // return this.selectionList
    // },
    settingCancel () {
      this.settingDisable = false
    },
    settingConfirm () {
      const result = this.settingData.map((cur, index) => {
        if (this.settingChoice.includes(index)) {
          cur.display = true
        } else {
          cur.display = false
        }
        return cur
      })

      createFieldSetting(result).then(res => {
        this.$message.success('设置成功')
        this.settingDisable = false
        this.$emit('update')
      })
    },
    importPop () {
      this.$refs.importTem.show()
    },
    followCustomer (row, key) {
      this.drawerPath = false
      this.childDetail.childId = row.id
      this.childId = row.id
      this.childDetail.childName = row.name
      this.followData.visible = true
      this.$nextTick(() => {
        this.isFollow = key === 'follow' ? new Date().getTime() : false
      })
      // console.log(this.isFollow)
    },
    prevChild (childId) {
      let index = this.tableData.content.findIndex(item => item.id === childId)
      if (index > 0) {
        this.childId = this.tableData.content[--index].id
      } else {
        this.$message.info('该学员是当前页的第一位')
      }
    },
    handleNext (childId) {
      let index = this.tableData.content.findIndex(item => item.id === childId)
      if (index >= 0 && index !== this.tableData.content.length - 1) {
        this.childId = this.tableData.content[++index].id
      } else {
        this.$message.info('该学员是当前页的最后一位')
      }
    },
    childLogUpdate () {
      this.$refs.childInfo.updateStep()
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

    showCustomer (row, edit = false, drawerPath = false) {
      this.drawerPath = drawerPath
      this.childId = row.id
      this.childPop = true
      if (edit) {
        setTimeout(() => {
          this.$refs.childInfo.isEdit = true
        }, 0)
      }
    },
    singUp (item) {
      this.singUpItem = item
      this.$refs.singUp.show()
    },
    changeCommand (e) {
      const ids = this.selectionData.map(cur => {
        return cur.id
      })

      switch (e) {
        case 'batch':
          this.$router.push({ path: '/customer_batch' })
          break
        case 'showSetting':
          this.settingDisable = true
          break
        case 'batchGiveUp': // 放弃客户
          if (!this.selectionData.length) {
            this.$message.warning('请选择客户')
          } else {
            this.$etmTip.init({
              type: 'error',
              title: '提示',
              content: '确认放弃已选中客户？',
              confirmBtn: '确定',
              cancelBtn: '取消',
              cancel: () => {
                this.$etmTip.close()
              },
              confirm: () => {
                giveUpCustomer(ids).then(res => {
                  this.$message.success(res.data.returnContent)
                  this.$emit('update')
                  this.$etmTip.close()
                })
              }
            })
            this.$etmTip.open()
          }
          break
        case 'batchImportTable': // 导出表格
          break
        case 'batchDelete': // 批量删除
          if (!this.selectionData.length) {
            this.$message.warning('请选择客户')
          } else {
            this.$etmTip.init({
              type: 'error',
              title: '提示',
              content: '确认删除已选中客户？',
              confirmBtn: '删除',
              cancelBtn: '取消',
              cancel: () => {
                this.$etmTip.close()
              },
              confirm: () => {
                removeCustomer(ids).then(res => {
                  this.$message.success('客户删除成功')
                  this.$emit('update')
                  this.$etmTip.close()
                })
              }
            })
            this.$etmTip.open()
          }
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.tablePage-wrap{
 ::v-deep{
   .avatar{
     width: 70px;
     margin: 0 auto;
     height: 70px;
     i{
       font-size: 50px;
       color: #C1C4CC;
       position: relative;
       display: flex;
       justify-content: center;
       align-items: center;
       width: 70px;
       height: 70px;

       &::before{

         display: block;
       }
     }
   }
 }
}
</style>
