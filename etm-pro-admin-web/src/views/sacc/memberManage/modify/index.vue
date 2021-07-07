<template>
  <etm-layout-split>
    <div class="modify">
      <etm-tabs v-model="activeName" :show-toggle="false" :before-leave="handleTabClick">
        <el-tab-pane :label="$t('memberManage.addTabsLabelBasic')" name="basic">
          <basic ref="basic" :content="basicData" :modify="basicForm" />
        </el-tab-pane>
        <el-tab-pane :label="$t('memberManage.addTabsLabelStatus')" name="status">
          <status ref="status" :content="statusData" :modify="statusForm" />
        </el-tab-pane>
        <el-tab-pane :label="$t('memberManage.addTabsLabelItem')" name="item">
          <item ref="item" :modify="itemForm" />
        </el-tab-pane>
        <el-tab-pane :label="$t('memberManage.addTabsLabelFood')" name="food">
          <food ref="food" :modify="foodForm" />
        </el-tab-pane>
        <el-tab-pane :label="$t('memberManage.addTabsLabelMedicine')" name="medicine">
          <medicine ref="medicine" :modify="medicineForm" />
        </el-tab-pane>
      </etm-tabs>

      <!--<el-tabs v-model="activeName" :before-leave="handleTabClick">
        <el-tab-pane :label="$t('memberManage.addTabsLabelBasic')" name="basic">
          <basic ref="basic" :content="basicData" :modify="basicForm" />
        </el-tab-pane>
        <el-tab-pane :label="$t('memberManage.addTabsLabelStatus')" name="status">
          <status ref="status" :content="statusData" :modify="statusForm" />
        </el-tab-pane>
        <el-tab-pane :label="$t('memberManage.addTabsLabelItem')" name="item">
          <item ref="item" :modify="itemForm" />
        </el-tab-pane>
        <el-tab-pane :label="$t('memberManage.addTabsLabelFood')" name="food">
          <food ref="food" :modify="foodForm" />
        </el-tab-pane>
        <el-tab-pane :label="$t('memberManage.addTabsLabelMedicine')" name="medicine">
          <medicine ref="medicine" :modify="medicineForm" />
        </el-tab-pane>
      </el-tabs>-->
      <div class="controlBtn">
        <el-button class="cancel" @click.stop="handleCancel">{{ $t('memberManage.modifyCancelBtnText') }}</el-button>
        <el-button :class="cansave ? 'save cansave' : 'save'" :disabled="!cansave" @click.stop="handleSubmit">{{ $t('memberManage.modifySaveBtnText') }}</el-button>
      </div>
    </div>
  </etm-layout-split>

</template>
<script>
import basic from '../add/basic'
import status from '../add/status'
import item from '../add/item'
import food from '../add/food'
import medicine from '../add/medicine'
import { getGardenXq, getContactType, getProfile, editBaseInfo } from '@/api/sacc'
import { getDateObj } from '../util'

export default {
  components: {
    basic,
    status,
    item,
    food,
    medicine
  },
  data() {
    return {
      activeName: 'basic',
      basicData: [],
      statusData: [],
      basicForm: {},
      statusForm: {},
      itemForm: [],
      foodForm: [],
      medicineForm: {}
    }
  },
  computed: {
    cansave() {
      return this.$store.state.memberManage.basic && this.$store.state.memberManage.status
    },
    currentId() {
      return localStorage.getItem('memberManage_currentId')
    }
  },
  created() {
    getContactType('CONTACTS').then(res => {
      const { data } = res
      this.basicData = data
      this.statusData = data

      getGardenXq(this.currentId)
        .then(res => {
          const { data } = res
          this.basicForm = { attributes: data.attributes, contacts: data.contacts, area: data.area } || []
          this.statusForm = data.studentStatusInfo || {}
          this.itemForm = data.belongings || []
          this.foodForm = data.dietInfo || []
          this.medicineForm = data.medication || {}

          // 初始化进入表单时候的tab状态
          this.$store.commit('memberManage/SET_TAB', 'basic')
        })
      // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.$message.error(this.$t('memberManage.getGardenXqFailTip'))
          // this.$emit('jump', 'manage')
        })
    // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('memberManage.getContactTypeFailTip'))
      this.$emit('jump', 'manage')
    })
  },
  mounted() {
    this.$etmTip.init({
      type: 'warn',
      title: this.$t('memberManage.modifyTitleCancelModify'),
      content: this.$t('memberManage.modifyCancelTip'),
      confirmBtn: this.$t('memberManage.modifyConfirmBtnText'),
      cancelBtn: this.$t('memberManage.modifyCancelBtnText'),
      confirm: this.handlePopConfirm,
      cancel: this.handlePopCancel
    })
  },
  methods: {
    handleTabClick(a, o) {
      if (!this.$store.state.memberManage[o] && ['basic', 'status'].indexOf(o) !== -1) {
        this.$message({
          type: 'warning',
          message: this.$t('memberManage.requiredInfoTip')
        })
        // return false
      }
    },
    handleCancel() {
      this.$etmTip.open()
    },
    handlePopConfirm() {
      this.$etmTip.close()
      this.$emit('jump', 'manage')
    },
    handlePopCancel() {
      this.$etmTip.close()
    },
    handleSubmit() {
      const basicOriginData = this.$refs.basic.basicForm
      const basicFormItems = this.$refs.basic.formItems
      const statusOriginData = this.$refs.status.studentStatusInfo
      const itemData = this.$refs.item.belongings
      const foodData = this.$refs.food.dietInfos
      const medicineData = this.$refs.medicine.medication

      // 处理新增会员的基础信息
      const basicData = {}
      for (const k in basicOriginData) {
        if (k === 'attributes') {
          basicData.eavAttributes = []
          for (const id in basicOriginData[k]) {
            const obj = {}
            obj.attributeId = +id
            obj.value = basicOriginData[k][id]
            for (let i = 0; i < basicFormItems.length; i++) {
              if (basicFormItems[i].attributeId === +id) {
                obj.type = basicFormItems[i].attributeType
                obj.controlType = basicFormItems[i].controlType
                break
              }
            }
            basicData.eavAttributes.push(obj)
          }
        } else {
          basicData[k] = basicOriginData[k]
        }
      }
      basicData.areaCode = basicOriginData.district.area

      // 处理学籍信息
      const studentStatusInfo = {}
      statusOriginData.pickUpPeoples.forEach(v => {
        for (const item of this.statusData) {
          if (item.id === v.contactTypeId) {
            v.contactTypeName = item.value
            break
          }
        }
      })
      for (const k in statusOriginData) {
        if (k === 'certificate') {
          studentStatusInfo.cardType = statusOriginData[k].cardType
          studentStatusInfo.cardNumber = statusOriginData[k].cardNumber
        } else if (k === 'bloodGroup' || k === 'householdRegistration') {
          if (statusOriginData[k]) { // 清除未填项
            studentStatusInfo[k] = statusOriginData[k]
          }
        } else {
          studentStatusInfo[k] = statusOriginData[k]
        }
      }

      // 处理携带物品
      let belongings
      if (itemData.length === 1 && !itemData[0].name) {
        belongings = []
      } else {
        belongings = itemData
      }

      // 处理饮食忌口
      let dietInfos
      if (foodData.length === 1 && !foodData[0].foodName) {
        dietInfos = []
      } else {
        dietInfos = foodData
      }

      // 处理用药备注
      const nowDateObj = getDateObj(Date.now())
      let medication
      if (medicineData.inUse.length === 1 && !medicineData.inUse[0].disease) {
        medication = {
          inUse: []
        }
      } else {
        medicineData.inUse.forEach(v => {
          v.medicine.forEach(m => {
            m.createTime = `${nowDateObj.year}-${nowDateObj.month}-${nowDateObj.day} ${nowDateObj.hour}:${nowDateObj.minute}:${nowDateObj.second}`
          })
        })
        medication = medicineData
      }
      // 提交修改
      const id = this.currentId
      Promise.all([
        editBaseInfo(basicData, id),
        getProfile(id, {
          studentStatusInfo,
          belongings,
          dietInfos,
          medication
        })
      ]).then(res => {
        this.$message({
          type: 'success',
          message: this.$t('memberManage.modifySuccessTip')
        })
        this.$emit('jump', 'manage')
        this.$store.commit('memberManage/SET_TAB', 'basic')
      }).catch(err => {
        console.log(err)
        this.$message.error(this.$t('memberManage.modifyFailTip'))
        this.$emit('jump', 'manage')
        this.$store.commit('memberManage/SET_TAB', 'basic')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.modify {
  position: relative;
  @include bgc_white();
  /*& >>> .el-tabs .el-tabs__header {*/
  /*  padding: 0 24px;*/
  /*  margin: 0 0 24px;*/
  /*}*/
  /*& >>> .el-tabs__nav.is-top {*/
  /*  // margin-left: 94px;*/
  /*}*/
  /*& >>> .el-tabs .el-tabs__item {*/
  /*  height: 56px;*/
  /*  line-height: 56px;*/
  /*}*/
  .e-title {
    position: absolute;
    top: 0;
    left: 0;
  }
  .controlBtn {
    position: absolute;
    top: -6px;
    right: 24px;
    & >>> .el-button.cancel {
      padding: 10px 34px;
      @include bgc_white();
      @include bc_control_color();
      span {
        @include c_secondary_color();
      }
    }
    & >>> .el-button.save {
      span {
        @include c_white();
      }
      padding: 10px 34px;
      @include bgc_disabled_color();
      @include bc_disabled_color();
      &.cansave {
        @include bgc_main_color();
        @include bc_main_color();
      }
    }
  }
}
</style>
