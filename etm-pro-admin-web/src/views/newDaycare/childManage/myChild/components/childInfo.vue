<template>
  <div class="child-info-wrap">

    <div v-if="!isEdit" class="detail">
      <!--<etm-title title="学员详情" border>-->
      <!--  <span slot="tool">-->
      <!--    <el-button size="mini" @click="handleEdit">编辑</el-button>-->
      <!--  </span>-->
      <!--</etm-title>-->
      <div class="child-info-panel">
        <el-button v-has="{authId: 'daycare.child.update'}" plain size="mini" class="edit-btn" @click="handleEdit">编辑</el-button>

        <div class="child-info-box">
          <div class="img-box">
            <img v-if="childDetail.data.avatar" :src="childDetail.data.avatar" :alt="childDetail.data.avatar">
            <i v-else class="iconfont iconmorentouxiang" />
          </div>
          <div class="info">
            <div class="name-box">
              <span class="username">{{ childDetail.data.childName }}</span>
              <img v-if="childDetail.data.gender === 'MALE'" src="../../../../../assets/images/daycare/man.png" alt="">
              <img
                v-if="childDetail.data.gender === 'FEMALE'"
                src="../../../../../assets/images/daycare/woman.png"
                alt=""
              >
            </div>
            <div class="parents">
              <p>{{ userParent }}</p>
            </div>
          </div>
        </div>
        <div class="leftIcon" @click="prevChild">
          <i class="iconleft-circle-fill iconfont" />
        </div>
        <div class="rightIcon" @click="nextChild">
          <i class="iconright-circle-fill iconfont" />
        </div>
        <div class="steps">
          <el-steps :active="_step" align-center>
            <el-step title="新客户" />
            <el-step title="已邀约" :description="step(stepData.newCustomerTime, stepData.invitedTime)" />
            <el-step title="已到店" :description="step(stepData.newCustomerTime, stepData.arrivedTime)" />
            <el-step title="成交" :description="step(stepData.newCustomerTime, stepData.dealTime)" />
          </el-steps>
        </div>
      </div>

      <etm-title :border="false" title="标签" />
      <div class="tag-box">
        <span
          v-for="(tag) of childDetail.data.tagNameList"
          :key="tag.tagName"
          class="tag-item"
          :style="{
            color: tag.colorCode,
            background: `${tag.colorCode.replace(')', ',.1)')}`
          }"
        >
          {{ tag.tagName }}
        </span>
        <div v-if="childDetail.data.tagNameList && !childDetail.data.tagNameList.length" class="noTag">暂无标签</div>
      </div>

      <etm-title :border="false" title="基础信息" />
      <div class="basic-info">
        <etm-field-label type="left" label="性别">
          {{ gender[childDetail.data.gender] }}
        </etm-field-label>
        <etm-field-label type="left" label="阳历生日">
          {{ childDetail.data.birthday | parseTime }}
        </etm-field-label>
        <etm-field-label type="left" label="阴历生日">
          {{ childDetail.data.lunarBirthday }}
        </etm-field-label>
        <etm-field-label type="left" label="家庭住址">
          {{ childDetail.data.areaName }}
        </etm-field-label>

        <etm-title :border="false" title="联系信息" />

        <etm-field-label type="left" label="联系人">
          <p v-for="parent of childDetail.data.relationshipList" :key="parent.id">
            {{ parent.parentName }} {{ parent.relationshipName }} - {{ parent.telephone }}
          </p>
        </etm-field-label>
        <etm-field-label type="left" label="QQ">
          {{ childDetail.data.qqNumber }}
        </etm-field-label>
        <etm-field-label type="left" label="微信">
          {{ childDetail.data.wechatNumber }}
        </etm-field-label>

        <etm-title :border="false" title="其他信息" />

        <etm-field-label type="left" label="学员状态">
          {{ childDetail.data.statusName }}
        </etm-field-label>
        <etm-field-label type="left" label="重要程度">
          {{ childDetail.data.importanceAttrName }}
        </etm-field-label>
        <etm-field-label type="left" label="学员来源">
          {{ childDetail.data.sourceName }}
        </etm-field-label>
        <etm-field-label type="left" label="会员卡">
          <p v-for="(item, index) in childDetail.data.membershipCards" :key="index">
            {{ item.cardNumber }}-{{ item.cardTypeName }}-{{ item.personName }} ({{ item.personCall }})
          </p>
        </etm-field-label>
        <etm-field-label type="left" label="跟进人员">
          {{ childDetail.data.followerName }}
        </etm-field-label>
        <etm-field-label type="left" label="市场人员">
          {{ childDetail.data.marketerName }}
        </etm-field-label>

        <etm-field-label type="left" label="分配时间">
          {{ childDetail.data.createTime | parseTime }}
        </etm-field-label>
        <etm-field-label type="left" label="录入时间">
          {{ childDetail.data.createTime | parseTime }}
        </etm-field-label>
        <etm-field-label type="left" label="备注">
          {{ childDetail.data.remark }}
        </etm-field-label>

        <!--<etm-field-label type="left" label="跟进阶段">-->
        <!--  没有-->
        <!--</etm-field-label>-->

        <!--<etm-field-label type="left" label="分配时间">-->
        <!--  {{ childDetail.data.assignTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}-->
        <!--</etm-field-label>-->

      </div>
    </div>

    <div v-if="isEdit" class="edit">
      <etm-title title="编辑学员" border>
        <template slot="tool">
          <el-button plain size="mini" @click="handleCancel">取消</el-button>
          <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
        </template>
      </etm-title>
      <add-child-form v-if="isEdit" ref="addChildForm" :edit="isEdit" :child-id="childId" />
    </div>
  </div>

</template>

<script>
import { queryChildInfoForDisplay, queryFollowPhase, updateChild } from '@/api/newDaycare/childManage'
import AddChildForm from '@/views/newDaycare/childManage/myChild/components/addChildForm'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'
import { queryAreaInfoByAreaId } from '@/api/base/base'

/**
 * child-info create by haijinsha
 * createTime 2020/8/28 13:51
 */
export default {
  name: 'ChildInfo',
  components: { AddChildForm },
  mixins: [baseMixin],
  props: {
    childId: {
      type: [String, Number],
      default: '',
      required: true
    },
    category: {
      type: String,
      default: '',
      required: true
    }
  },

  data() {
    return {
      gender: {
        MALE: '男',
        FEMALE: '女'
      },
      isEdit: false,
      stepData: {},
      stepStatus: {
        'NEW_CUSTOMER': '新客户',
        'INVITED': '已邀约',
        'ARRIVED': '已到店',
        'DEAL': '成交'
      },
      // TODO 学员详情
      childDetail: {
        visible: false,
        activeTab: 'follow',
        data: {
          areaName: '',
          childName: '',
          avatar: '',
          gender: '',
          birthday: '',
          lunarBirthday: '',
          areaCode: '',
          address: '',
          createTime: '',
          sourceName: '',
          followerName: '',
          marketerName: '',
          assignTime: '',
          tagNameList: [],
          relationshipList: [],
          membershipCards: [],
          statusName: '',
          category: '',
          childId: '',
          importanceAttrName: '',
          qqNumber: '',
          wechatNumber: ''
        }
      },
      userParent: ''
    }
  },
  computed: {
    _step() {
      return Object.keys(this.stepStatus).indexOf(this.stepData.followPhaseType)
    }
  },
  watch: {
    childId: {
      handler() {
        this.isEdit = false
        this.init()
      },
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    step(prev, next) {
      if (!prev || !next) {
        return ''
      }

      const oneday = 3600 * 24
      // 60057

      const step = Math.floor((next - prev) / 1000)
      const day = Math.floor(step / oneday)
      const house = Math.floor((step - day * oneday) / 3600)
      const minute = Math.floor((step - (day * oneday) - (house * 3600)) / 60)

      return day ? `${day}天${house}小时` : `${house}小时${minute}分`
    },
    init() {
      if (!this.childId) {
        return false
      }

      this.updateStep()

      queryChildInfoForDisplay({ childId: this.childId }).then(res => {
        this.childDetail.data = res.data
        const item = this.childDetail.data
        for (const itemKey in item) {
          if (item[itemKey] && itemKey.includes('Time')) {
            item[itemKey] = parseTime(item[itemKey], '{y}-{m}-{d}')
          }
        }
        const parent = this.childDetail.data.relationshipList[0]
        this.userParent = `${parent.parentName || ''} ( ${parent.relationshipName || ''} ) - ${parent.telephone}`

        this.childDetail.data.areaCode && queryAreaInfoByAreaId({ areaId: this.childDetail.data.areaCode }).then(res => {
          const { provinceName, cityName, countyName } = res.data
          const address = this.childDetail.data.address || ''
          this.childDetail.data.areaName = provinceName + cityName + countyName + address
          this.$forceUpdate()
        })
      })
    },
    updateStep() {
      queryFollowPhase(this.childId).then(res => {
        this.stepData = res.data
      })
    },
    handleEdit() {
      this.isEdit = true
    },
    handleSave() {
      // const childForm =

      this.$refs.addChildForm.submit().then(childForm => {
        childForm && updateChild(childForm).then(res => {
          this.isEdit = false
          this.$message.success('操作成功')
          this.$emit('update')
        })
      })
    },
    handleCancel() {
      this.isEdit = false
    },
    prevChild() {
      this.$emit('prevChild', this.childId)
      this.$emit('update', {})
    },
    nextChild() {
      this.$emit('next', this.childId)
      this.$emit('update', {})
    }
  }
}
</script>
<style lang="scss" scoped>
.child-info-wrap {

  .steps {
    margin-bottom: 16px;
    padding-top: 38px;
    margin-left: -16px;
    margin-right: -16px;

    ::v-deep {
      .el-step__title {
        font-size: 14px;
      }

      .el-step__title.is-wait {
        color: rgba(255, 255, 255, .6);
      }

      .el-step {
        position: relative;

        .el-step__description {
          position: absolute;
          top: -12px;
          left: 0;
          transform: translate(-50%, 0);
          width: calc(100% - 8px);
          padding-left: 0;
          background: rgba(255, 255, 255, .6);
          border-radius: 20px;
          padding-right: 0;
          color: #fff;

          //&::after {
          //  content: '';
          //  display: block;
          //  border: 4px solid transparent;
          //  border-top-color: rgba(255,255,255,.6);
          //  position: absolute;
          //  left: 50%;
          //  bottom: 0;
          //  transform: translate(-50%, 100%);
          //}
        }
      }

      .el-step__line {
        height: 2px;
        background: rgba(255, 255, 255, .6);
      }

      .el-step__line-inner {
        border-width: 0px !important;
      }

      .el-step__head.is-finish {
        .el-step__line {
          background: #fff;
        }
      }

      .el-step__head.is-finish,
      .el-step__head.is-process {

        .el-step__icon {
          border-color: #fff;
          background: #fff;
        }
      }

      .el-step__title.is-process,
      .el-step__title.is-finish {
        color: #fff;
        font-weight: 500;
      }

      .el-step__icon {
        width: 8px;
        border-width: 1px;
        height: 8px;
        transform: translate(0, 1px);
        border-color: #ccc;
        background: #ccc;

        div {
          display: none;
        }
      }
    }
  }

  .child-info-panel {
    //display: flex;
    //align-items: flex-start;
    padding: 16px;
    height: 190px;
    background: url("../../../../../assets/images/daycare/card.png") no-repeat;
    position: relative;
    margin-bottom: 16px;
    border-radius: 4px;

    &:hover{
      .leftIcon,
      .rightIcon{
        display: block;
      }
    }

    .child-info-box {
      display: flex;
      align-items: flex-start;
    }

    & ::v-deep .edit-btn {
      position: absolute;
      right: 0;
      top: 16px;
      border-radius: 20px 0 0 20px;
    }

    .img-box {
      border-radius: 50%;
      overflow: hidden;
      width: 48px;
      height: 48px;
      display: flex;
      padding: 0 0 0 0 !important;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
      }

      > /deep/ i.iconmorentouxiang {
        width: 100%;
        font-size: 48px;
        color: #FFFFFF;
      }
    }

    .info {
      flex: 1;
      padding-left: 16px;
      color: $white;

      .name-box {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .username {
          font-size: 16px;

        }

        img {
          margin-left: 4px;
        }
      }

      .parents {
        p {
          color: rgba(255, 255, 255, .8);
        }
      }
    }
  }

  .tag-box {
    padding-bottom: 16px;

    .tag-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 8px;
      height: 22px;
      line-height: 22px;
      border-radius: 2px;
      margin-right: 8px;
      font-size: 12px;
      margin-bottom: 8px;
    }

    .noTag {
      font-size: 14px;
      @include c_secondary_color();
      text-align: center;
    }
  }

  .leftIcon {
    width: 14px;
    height: 14px;
    opacity: 0.3;
    position: absolute;
    left: 8px;
    top: 85px;
    color: white;
    display: none;
    i{
      display: block;
      width: 14px;
      height: 14px;
    }
  }

  .leftIcon:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  .rightIcon {
    opacity: 0.3;
    width: 14px;
    height: 14px;
    display: none;
    position: absolute;
    right: 8px;
    top: 85px;
    color: white;
    i{
      display: block;
      width: 14px;
      height: 14px;
    }
  }

  .rightIcon:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
</style>
