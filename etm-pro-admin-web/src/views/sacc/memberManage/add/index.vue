<template>
  <etm-layout-split>
    <div class="add">
      <etm-title>{{ this.$t('memberManage.breadCrumbTitleAdd') }}</etm-title>
      <el-steps :active="active" finish-status="success">
        <el-step :title="this.$t('memberManage.addTabsLabelBasic')" />
        <el-step :title="this.$t('memberManage.addTabsLabelStatus')" />
        <el-step :title="this.$t('memberManage.addTabsLabelItem')" />
        <el-step :title="this.$t('memberManage.addTabsLabelFood')" />
        <el-step :title="this.$t('memberManage.addTabsLabelMedicine')" />
      </el-steps>
      <div class="tableArea">
        <basic v-show="active === 0" ref="basic" :content="basicData" />
        <status v-show="active === 1" ref="status" :content="statusData" />
        <item v-show="active === 2" ref="item" />
        <food v-show="active === 3" ref="food" />
        <medicine v-show="active === 4" ref="medicine" />
      </div>
      <div class="bottomBtns">
        <el-button v-if="active !== 4" type="primary" :disabled="disabled" @click.stop="next">{{ $t('memberManage.nextBtnText') }}</el-button>
        <el-button v-else type="primary" :disabled="disabled" @click.stop="handleSubmit">{{ $t('memberManage.submitBtnText') }}</el-button>
        <el-button v-show="active !== 0" plain @click.stop="last">{{ $t('memberManage.lastBtnText') }}</el-button>
      </div>
    </div>
  </etm-layout-split>
</template>

<script>
import basic from './basic'
import status from './status'
import item from './item'
import food from './food'
import medicine from './medicine'
import { getContactType, addBaseInfo, getProfile } from '@/api/sacc'
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
      active: 0,
      basicData: [],
      statusData: [],
      canSubmit: true,
      disabled: true
    }
  },
  computed: {
    basicDone() {
      return this.$store.state.memberManage.basic
    },
    statusDone() {
      return this.$store.state.memberManage.status
    },
    itemDone() {
      return this.$store.state.memberManage.item
    },
    foodDone() {
      return this.$store.state.memberManage.food
    },
    medicineDone() {
      return this.$store.state.memberManage.medicine
    }
  },
  watch: {
    active(v) {
      switch (v) {
        case 0:
          this.disabled = !this.basicDone
          break
        case 1:
          this.disabled = !this.statusDone
          break
        case 2:
          this.disabled = !this.itemDone
          break
        case 3:
          this.disabled = !this.foodDone
          break
        case 4:
          this.disabled = !this.medicineDone
          break
        default:
          this.disabled = false
      }
    },
    basicDone(v) {
      if (this.active === 0) {
        this.disabled = !v
      }
    },
    statusDone(v) {
      if (this.active === 1) {
        this.disabled = !v
      }
    },
    itemDone(v) {
      if (this.active === 2) {
        this.disabled = !v
      }
    },
    foodDone(v) {
      if (this.active === 3) {
        this.disabled = !v
      }
    },
    medicineDone(v) {
      if (this.active === 4) {
        this.disabled = !v
      }
    }
  },
  created() {
    getContactType('CONTACTS').then(res => {
      const { data } = res
      this.basicData = data
      this.statusData = data
    // eslint-disable-next-line handle-callback-err
    }).catch(err => {
      this.$message.error(this.$t('memberManage.getContactTypeFailTip'))
    })

    // 初始化表单的必填状态
    this.$store.commit('memberManage/SET_BASIC', false)
    this.$store.commit('memberManage/SET_STATUS', false)
    this.$store.commit('memberManage/SET_ITEM', true)
    this.$store.commit('memberManage/SET_FOOD', true)
    this.$store.commit('memberManage/SET_MEDICINE', true)
  },
  methods: {
    next() {
      if (this.active < 6) this.active++
    },
    last() {
      if (this.active > 0) this.active--
    },
    handleSubmit() {
      if (!this.canSubmit) {
        return false
      }
      this.canSubmit = false
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

      // 提交新增
      addBaseInfo(basicData).then(res => {
        const { data } = res
        const id = data.id
        this.$message({
          type: 'success',
          message: this.$t('memberManage.addMemberSuccessTip')
        })
        getProfile(id, {
          studentStatusInfo,
          belongings,
          dietInfos,
          medication
        }).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('memberManage.addMemberInfoSuccessTip')
          })
          this.canSubmit = true
          this.$emit('jump', 'manage')
        }).catch(err => {
          console.log(err)
          this.$message.error(this.$t('memberManage.addMemberInfoFailTip'))
          this.canSubmit = true
          this.$emit('jump', 'manage')
        })
      }).catch(err => {
        console.log(err)
        this.$message.error(this.$t('memberManage.addMemberFailTip'))
        this.canSubmit = true
      })
    }
  }
}
</script>

<style scoped lang="scss">
.add {
  position: relative;
  //@include bgc_white();
  /*height: calc(100vh - 150px);*/
  /*padding-bottom: 68px;*/
  & >>> .el-steps {
    margin: 25px 0 32px 150px;
    width: 800px;
    .el-step__main {
      transform: translateX(-15px);
    }
    .el-step__icon {
      width: 30px;
      height: 30px;
    }
    .el-step__head.is-process {
      @include bc_main_color();
      @include c_white();
      .el-step__icon.is-text {
        @include bgc_main_color();
      }
    }
    .el-step__head.is-success {
      @include c_main_color();
      @include bc_main_color();
    }
    .el-step__title.is-success {
      @include c_main_color();
    }
    .el-step__title.is-process {
      font-weight: 400;
    }
    .el-step.is-horizontal .el-step__line {
      top: 14px;
      right: 20px;
      left: 50px;
    }
  }
  .tableArea {
    /*height: calc(100vh - 392px);*/
    /*overflow-y: auto;*/
    .basic, .status, .item, .food, .medicine {
      /*height: 100%!important;*/
    }
  }
  .bottomBtns {
    display: flex;
    align-items: center;
    /*position: absolute;*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    height: 68px;
    padding-left: 300px;
    margin: 0 -16px;
    box-shadow:0px -4px 6px 0px rgba(34,34,34,0.04);
    .el-button+.el-button {
      margin-left: 16px!important;
    }
  }
}
</style>
