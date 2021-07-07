<template>
  <div class="dashboard">
    <etm-main-body class="appBg">
      <slot>
        <el-row :gutter="16" class="dashMin">
          <el-col :span="10" class="bordCard">
            <div class="cards">
              <el-card class="box-card transitionCard">
                <div slot="header" class="clearfix">
                  <span class="title">待办事项</span>
                  <el-button style="float: left; padding: 3px 0;" type="text">更多</el-button>
                  <div style="float: right">
                    <el-date-picker
                      v-model="rangeTime"
                      type="daterange"
                      range-separator="至"
                      :clearable="false"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      @change="getTransaction"
                    />
                  </div>
                </div>
                <div v-for="(o, index) in list" :key="index" class="text item">
                  <div class="flex">
                    <div class="personInfo">
                      <div class="infoTop">
                        <span class="dotted" />
                        <span class="name" @click="examine(o)">{{ o.content }}</span>
                        <span v-if="judgeTime(o.lateTime)" class="overTime">逾期</span>
                      </div>
                      <div class="infoBottom">
                        <span class="phone">{{ o.lateTime|parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                      </div>
                    </div>
                    <div class="editButton">
                      <el-button type="text" size="small" icon="iconfont iconignore" @click="ignore(o.id)">忽略
                      </el-button>
                    </div>
                  </div>
                </div>
                <no-content v-if="list.length == 0" />
              </el-card>
            </div>
          </el-col>
          <el-col :span="14" class="bordCard">
            <div class="cards">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <etm-title>快捷操作</etm-title>
                </div>
                <div class="text item appBox">
                  <div class="apply" @click="floorUp">
                    <div class="dragIcon">
                      <i class="iconfont iconsolution" />
                    </div>
                    <p>跟进客户</p>
                  </div>
                  <div class="apply" @click="dashShow">
                    <div class="dragIcon">
                      <i class="iconfont iconaddteam" />
                    </div>
                    <p>添加客户</p>
                  </div>
                  <div class="apply" @click="handleAddStaffVisible">
                    <div class="dragIcon">
                      <i class="iconfont iconteam" />
                    </div>
                    <p>添加员工</p>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="15" class="bordCard bottomCard">
            <div class="cards">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <etm-title>干啥用的</etm-title>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="9" class="bordCard bottomCard">
            <div class="cards">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <etm-title>干啥用的</etm-title>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </slot>
    </etm-main-body>

    <!--添加客户抽屉-->
    <full-window
      :visible="addCustomerFormVisible"
      :title="'添加客户'"
      @confirm="submitAddCustom"
      @cancel="cancelAddCustom"
    >
      <div class="addCustomerContent">
        <el-row>
          <el-col :span="24">
            <add-customer
              v-if="addCustomerFormVisible == true"
              ref="childItem"
              :type="'add'"
              @closeCustomers="closeCustomers"
            />
          </el-col>
        </el-row>

      </div>
    </full-window>
    <!--      跟进-->
    <side-window
      :visible="editDrawer"
      :type="'tab'"
      :tab="tabData"
      :tab-model="activeName"
      @close="editDrawer=false"
      @tabClick="handleTabClick"
    >
      <template v-slot:body>

        <follow-up
          v-if="editDrawer == true && activeName == 'follow'"
          ref="followChildItem"
          @handleClose="handleClose"
        />
        <!--        <details-item-->
        <!--          v-if="editDrawer == true && activeName == 'detail'"-->
        <!--        />-->

      </template>
      <template
        v-if="editDrawer == true && activeName == 'follow'"
        v-slot:footer
      >
        <el-row :gutter="20" class="footer">
          <el-col :span="12" :offset="6">
            <el-button type="primary" @click="saveFollowUp('save')">保存</el-button>
          </el-col>
        </el-row>
      </template>
    </side-window>
    <!--添加员工-->
    <etm-pop
      ref="addStaff"
      :visible="addStaffVisible"
      pop="complex"
      title="添加员工"
      :content="content"
      @close="cancelAddStaffCustom"
      @cancel="cancelAddStaffCustom"
      @confirm="submitAddStaffCustom"
    />

    <!--      设置密码-->
    <!-- <etm-pop
      :visible="isDialog"
      pop="complex"
      title="设置账号密码"
      :content="passwordPage"
      @close="closeDialog"
      @cancel="closeDialog"
      @confirm="setPassword"
    /> -->

  </div>
</template>

<script>

import { transaction, editAction } from '@/api/customer'
import addCustomer from '../../customer/student/components/addCustomer'
import fullWindow from '../../../layout/main/fullWindow'
import sideWindow from '../../../layout/main/sideWindow'
import setPassword from './setPassword'
import staffAdd from '../player/organizationalStructure/staffAdd/staffAdd'
import followUp from '../../customer/student/components/followUp/index'
// import detailsItem from '../student/components/detailsItem/index'
import { getFirstLogin, removeToken, removefirstLogin, removePhone } from '@/utils/auth'
import { parseTime } from '@/utils'
import NoContent from '@/components/NoContent/index'
import EtmMainBody from '@/layout/main/EtmMainBody'
import EtmPop from '@/layout/main/EtmPop'
import EtmTitle from '@/layout/main/EtmTitle'

export default {

  name: 'Dashboard',

  filters: {
    parseTime: parseTime
  },

  components: {
    addCustomer,
    followUp,
    // detailsItem,
    fullWindow,
    sideWindow,
    NoContent,
    EtmMainBody,
    EtmPop,
    EtmTitle
  },

  data() {
    return {
      today: new Date(),
      tomorrow: '',
      list: [],
      activeName: 'detail', // 弹框激活状态
      tabData: [ // 侧边弹框表头tab切换文字
        {
          label: '写跟进',
          name: 'follow'
        },
        {
          label: '客户详情',
          name: 'detail'
        }
      ],
      showClose: false,
      addCustomerFormVisible: false,
      editDrawer: false,
      direction: 'rtl',
      selectStudent: undefined,
      addStaffVisible: false,
      isDialog: false,
      rangeTime: [new Date(), new Date()],
      content: staffAdd,
      passwordPage: setPassword
    }
  },

  watch: {
    isDialog(val) {
      if (getFirstLogin() === 'true' && val === false) {
        removeToken()
        removePhone()
        removefirstLogin()
        this.$router.push('/login')
      }
    }
  },

  created() {
    this.tomorrow = new Date(this.today.getTime() + 24 * 60 * 60 * 1000)
    this.transaction(parseTime(this.today, '{y}-{m}-{d}'), parseTime(this.tomorrow, '{y}-{m}-{d}'))
    if (getFirstLogin() === 'true') {
      this.isDialog = true
    }
  },

  methods: {

    transaction(val1, val2) {
      const params = {
        sourceId: 1,
        pageSize: 5,
        pageNum: 1,
        state: '2',
        startDate: val1,
        endDate: val2
      }
      transaction(params).then(res => {
        this.list = res.data.content
      })
    },

    getTransaction(val) {
      if (val) {
        const time1 = parseTime(val[0], '{y}-{m}-{d}')
        let time2 = parseTime(val[1], '{y}-{m}-{d}')
        if (time1 === time2) {
          time2 = parseTime(new Date(val[1].getTime() + 24 * 60 * 60 * 1000), '{y}-{m}-{d}')
        }
        this.transaction(time1, time2)
      } else {
        this.transaction()
      }
    },

    judgeTime(time) {
      if (new Date(time) < new Date()) {
        return true
      } else {
        return false
      }
    },

    ignore(id) {
      const params = {
        state: 3
      }
      editAction(id, params).then(res => {
        this.$message({
          message: '已忽略',
          type: 'success'
        })
        this.transaction(parseTime(this.value, '{y}-{m}-{d}'))
      })
    },

    handleTabClick(tab, e) {
      this.activeName = tab.name
      console.log(tab, e)
      console.log(this.activeName)
    },

    examine(row) {
      this.selectStudent = row
      const list = []
      list.push(row)
      this.$store.dispatch('customerCues/customerLists', list)
      this.$store.dispatch('customerCues/selectCustomer', row)
      this.$store.dispatch('customerCues/customerId', row.customerId)
      this.editDrawer = true
    },

    showAddCustomerForm(row) {
      this.selectStudent = row
      this.$store.dispatch('customerCues/selectCustomer', row)
      this.$store.dispatch('customerCues/customerId', row.customerId)
      this.addCustomerFormVisible = true
    },

    // 点击隐藏添加客户弹窗
    closeCustomers() {
      this.addCustomerFormVisible = false
    },

    handleClose() {
      this.editDrawer = false
    },

    dashShow() {
      this.addCustomerFormVisible = true
    },

    // 点击新增跟进客户
    saveFollowUp(param) {
      this.$refs.followChildItem.saveFollowUpForm(param)
    },

    // 取消添加客户
    cancelAddCustom() {
      this.addCustomerFormVisible = false
    },

    // 修改客户弹窗提交
    submitAddCustom() {
      this.$refs.childItem.submitAddCustomForm()
    },

    floorUp() {
      this.$router.push('/student')
    },

    handleAddStaffVisible() {
      this.addStaffVisible = true
    },

    addStaffSuccess() {
      this.addStaffVisible = false
    },

    cancelAddStaffCustom() {
      this.addStaffVisible = false
    },

    submitAddStaffCustom() {

    },

    closeDialog() {
      this.isDialog = false
    },

    // 设置密码
    setPassword() {
      const data = this.$store.state.login.password
      if (data.password.password === data.password.passwordTwice) {
        const p = this.$store.dispatch('user/setPassword', data)
        p.then(data => {
          this.$message({
            message: '设置密码成功',
            type: 'success'

          })
          this.isDialog = false
        })
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  @import "~@/styles/mixin.scss";

  .dashboard {
    .appBg {
      background-color: rgba(0, 0, 0, 0);
      overflow-x: hidden;

      & /deep/ .content {
        background-color: $bg-color;
      }
    }

    .bordCard {
      height: 429px;

      .cards {
        height: 100%;

        .box-card {
          height: 100%;
          @include c_colorTextRegular();
          border: 0px;
          font-size: 14px;

          & /deep/ .el-card__body {
            padding: 0;
          }

          &.transitionCard{
            & /deep/ .el-card__header {
              padding: 8px 0 7px;
              margin: 0 17px;
              border-bottom: 1px solid $divide-color;

              .title {
                position: relative;
                float: left;
                line-height: 34px;
                font-size: 16px;
                color: $title-color;

                &::before {
                  display: inline-block;
                  position: absolute;
                  top: 9px;
                  left: -17px;
                  content: '';
                  width: 3px;
                  height: 16px;
                  @include bgc_main_color();
                }
              }
            }
          }

          & /deep/ .el-card__header {
            padding:  0;
            margin: 0;
            border: none;

            .title {
              position: relative;
              float: left;
              line-height: 34px;
              font-size: 16px;
              color: $title-color;

              &::before {
                display: inline-block;
                position: absolute;
                top: 9px;
                left: -24px;
                content: '';
                width: 3px;
                height: 16px;
                @include bgc_main_color();
              }
            }

            .el-button {
              margin-left: 15px;
              line-height: 26px;
            }
          }

          & /deep/ .el-input__inner {
            width: 310px;
            height: 34px;
          }

          & /deep/ .el-range-separator {
            width: 40px;
            line-height: 26px;
          }

          & /deep/ .el-range-input {
            width: 100px;
          }

          .text {
            padding: 0 24px;

            .flex {
              height: 70px;
              display: flex;
              justify-content: space-between;
              border-bottom-width: 1px;
              border-bottom-style: solid;
              @include bc_borderColorBase();

              .personInfo {
                padding: 7px 12px;

                .infoTop {
                  position: relative;
                  line-height: 28px;

                  .dotted {
                    display: inline-block;
                    position: absolute;
                    top: 11px;
                    left: -12px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: $info-color;
                  }

                  .name {
                    cursor: pointer;

                    &:hover {
                      @include c_main_color;
                    }
                  }

                  .overTime {
                    padding: 0 4px;
                    @include c_error_color;
                    background: $error-light-color;
                  }
                }

                .infoBottom {
                  line-height: 28px;
                  @include c_secondary_color;
                }
              }

              .editButton {
                padding: 7px 0;

                .el-button {
                  line-height: 28px;
                  @include c_secondary_color;

                  &:hover {
                    @include c_main_color;
                  }
                }
              }
            }
          }

          .appBox {
            padding: 10px 24px;
            overflow: hidden;
          }

          .apply {
            padding: 12px 24px;
            float: left;
            border: 1px solid transparent;
            cursor: pointer;

            &:hover {
              @include c_main_color;
              background: rgba(251, 160, 71, .1);
              border: 1px solid $main-color;
            }

            .dragIcon {
              position: relative;
              width: 50px;
              height: 50px;
              text-align: center;

              i {
                display: inline-block;
                font-size: 36px;
                line-height: 50px;
              }
            }

            p {
              margin: 0;
            }
          }
        }
      }
    }

    .bottomCard {
      margin-top: 16px;
      height: calc(100vh - 588px);
    }
  }

  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover, .el-cascader__dropdown, .el-color-picker__panel, .el-message-box, .el-notification {
    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }

</style>
