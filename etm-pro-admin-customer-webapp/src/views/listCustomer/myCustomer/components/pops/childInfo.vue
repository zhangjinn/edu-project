<template>
  <div class="child-info-wrap">
    <div
      v-if="!isEdit"
      class="detail"
    >
      <div class="child-info-panel">
        <el-button
          plain
          size="mini"
          class="edit-btn"
          @click="handleEdit"
        >
          编辑
        </el-button>

        <div class="child-info-box">
          <div class="img-box">
            <img
              v-if="childDetail.data.avatar"
              :src="childDetail.data.avatar"
              :alt="childDetail.data.avatar"
            >
            <i
              v-else
              class="iconfont iconmorentouxiang"
            />
          </div>
          <div class="info">
            <div class="name-box">
              <span class="username">{{ childDetail.data.name }}</span>

              <img
                v-if="childDetail.data.gender === 'MALE'"
                src="../../../../../assets/images/man.png"
                alt=""
              >
              <img
                v-if="childDetail.data.gender === 'FEMALE'"
                src="../../../../../assets/images/woman.png"
                alt=""
              >
            </div>
            <div class="parents">
              <p>{{ userParent }}</p>
            </div>
          </div>
        </div>
        <div
          class="leftIcon"
          @click="prevChild"
        >
          <i class="iconleft-circle-fill iconfont" />
        </div>
        <div
          class="rightIcon"
          @click="nextChild"
        >
          <i class="iconright-circle-fill iconfont" />
        </div>
        <div class="steps">
          <el-steps
            :active="_step"
            align-center
          >
            <el-step title="新客户" />
            <el-step
              title="已邀约"
              :description="step(stepData.newCustomerTime, stepData.invitedTime)"
            />
            <!--            <el-step title="已到店" :description="step(stepData.newCustomerTime, stepData.arrivedTime)" />-->
            <el-step
              title="成交"
              :description="step(stepData.newCustomerTime, stepData.dealTime)"
            />
          </el-steps>
        </div>
      </div>

      <etm-title
        :border="false"
        title="标签"
      />
      <div
        v-if="childDetail.data.mark.length"
        class="tag-box"
      >
        <!--
        :style="{
            color: tag.colorCode,
            background: `${tag.colorCode.replace(')', ',.1)')}`
          }"
          -->
        <span
          v-for="(tag) of childDetail.data.mark"
          :key="tag"
          class="tag-item"
          :style="{
            color: '#999',
            background: `rgba(200,200,200,.1)`
          }"
        >
          {{ tag }}
        </span>
        <div
          v-if="childDetail.data.tagNameList && !childDetail.data.tagNameList.length"
          class="noTag"
        >
          暂无标签
        </div>
      </div>
      <etm-title
        :border="false"
        title="基础信息"
      />

      <div class="basic-info">
        <etm-field-label
          type="left"
          label="手机号码"
        >
          {{ childDetail.data.telephone }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="客户性别"
        >
          {{ gender[childDetail.data.gender] }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="出生日期"
        >
          {{ childDetail.data.birthday }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="详细地址"
        >
          {{ address }}{{ childDetail.data.address }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="录入时间"
        >
          {{ childDetail.data.createTime }}
        </etm-field-label>
      </div>

      <etm-title
        :border="false"
        title="附加信息"
      />

      <etm-field-label
        type="left"
        label="微信号码"
      >
        {{ childDetail.data.wechat }}
      </etm-field-label>
      <etm-field-label
        type="left"
        label="QQ号码"
      >
        {{ childDetail.data.qq }}
      </etm-field-label>

      <etm-field-label
        type="left"
        label="联系人"
      >
        <p
          v-for="parent of childDetail.data.contacts"
          :key="parent.id"
        >
          {{ parent.contactRelationship }} {{ parent.contactName }} - {{ parent.contactTelephone }}
        </p>
      </etm-field-label>

      <etm-title
        :border="false"
        title="跟进信息"
      />

      <div class="basic-info">
        <etm-field-label
          type="left"
          label="跟进人员"
        >
          {{ childDetail.data.counselor }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="市场人员"
        >
          {{ childDetail.data.marketer }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="客户状态"
        >
          {{ childDetail.data.state }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="重要程度"
        >
          {{ childDetail.data.importantLevel }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="客户来源"
        >
          {{ childDetail.data.source }}
        </etm-field-label>

        <etm-field-label
          v-for="(item) in childDetail.data.customFields"
          :key="item.dictValueId"
          type="left"
          :label="item.name"
        >
          {{ item.value }}
        </etm-field-label>
      </div>
    </div>

    <div
      v-if="isEdit"
      class="edit"
    >
      <etm-title
        title="编辑学员"
        border
      >
        <template slot="tool">
          <el-button
            plain
            size="mini"
            @click="handleCancel"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleSave"
          >
            保存
          </el-button>
        </template>
      </etm-title>
      <add-child-form
        v-if="isEdit"
        ref="addChildForm"
        :child-type="category"
        :edit="isEdit"
        :child-id="childId"
      />
    </div>
  </div>
</template>

<script>
import AddChildForm from '@/views/listCustomer/myCustomer/components/pops/addChildForm'
import baseMixin from '@/layout/mixin/baseMixin'
import {
  queryCustomerDetail, queryCustomerFields
} from '@/api/customer'
import { queryAreaInfoByAreaId } from '@/api/base/base'
import { parseTime } from '@/utils'

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
    },
    drawerPath: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      address: '',
      isEdit: false,
      gender: {
        MALE: '男',
        FEMALE: '女'
      },
      stepData: {},
      stepStatus: {
        NEW_CUSTOMER: '新客户',
        INVITED: '已邀约',
        ARRIVED: '已到店',
        DEAL: '成交'
      },
      // TODO 学员详情
      childDetail: {
        visible: false,
        activeTab: 'follow',
        data: {
          address: '',
          avatar: '',
          birthday: '',
          city: '',
          contacts: [],
          counselor: '',
          customFields: [],
          gender: '',
          importantLevel: '',
          mark: '',
          marketer: '',
          marketerId: '',
          name: '',
          province: '',
          qq: '',
          region: '',
          source: '',
          state: '',
          telephone: '',
          wechat: ''
        }
      },
      userParent: ''
    }
  },
  computed: {
    _step () {
      return Object.keys(this.stepStatus).indexOf(this.stepData.followPhaseType)
    }
  },
  watch: {
    childId: {
      handler (n) {
        if (n) {
          this.isEdit = false
          this.$nextTick(() => {
            this.init()
          })
        }
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
    // this.init()
  },
  methods: {
    step (prev, next) {
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
    init () {
      if (!this.childId) {
        return false
      }

      queryCustomerDetail(this.childId).then(res => {
        queryCustomerFields().then(r => {
          const custom = {}
          res.data.customFields.forEach(cur => {
            custom[cur.key] = cur
          })

          const customFields = r.data.map(cur => {
            cur.dictValueId = custom[cur.key].dictValueId
            cur.value = custom[cur.key].value
            cur.dictTypeId = cur.id

            return cur
          })

          const result = res.data
          result.mark = (result.mark || '').split(',')
          result.customFields = customFields
          result.createTime = result.createTime ? parseTime(result.createTime, '{y}-{m}-{d}') : ''
          result.birthday = result.birthday ? parseTime(result.birthday, '{y}-{m}-{d}') : ''

          if (result.region) {
            queryAreaInfoByAreaId({ areaId: result.region }).then(res => {
              const { provinceName, cityName, countyName } = res.data
              this.address = `${provinceName}${cityName}${countyName}`
            })
          }

          this.childDetail.data = result
        })
      })

      // queryChildInfoForDisplay({ childId: this.childId }).then(res => {
      //   this.childDetail.data = res.data
      //   const item = this.childDetail.data
      //   for (const itemKey in item) {
      //     if (item[itemKey] && itemKey.includes('Time')) {
      //       item[itemKey] = parseTime(item[itemKey], '{y}-{m}-{d}')
      //     }
      //   }
      //   const parent = this.childDetail.data.relationshipList[0]
      //   this.userParent = `${parent.parentName || ''} ( ${parent.relationshipName || ''} ) - ${parent.telephone}`
      //
      //   this.childDetail.data.areaCode && queryAreaInfoByAreaId({ areaId: this.childDetail.data.areaCode }).then(res => {
      //     const { provinceName, cityName, countyName } = res.data
      //     const address = this.childDetail.data.address || ''
      //     this.childDetail.data.areaName = provinceName + cityName + countyName + address
      //     this.$forceUpdate()
      //   })
      // })
    },
    updateStep () {
      // queryFollowPhase(this.childId).then(res => {
      //   this.stepData = res.data
      // })
    },
    handleEdit () {
      this.isEdit = true
      this.$emit('handleEdit', false)
    },
    handleSave () {
      this.$refs.addChildForm.submit().then(childForm => {
        this.isEdit = false
        this.$message.success('操作成功')
        this.init()
        this.$emit('update')
      })
    },
    handleCancel () {
      this.isEdit = false
      if (this.drawerPath) {
        this.$emit('handleCancel')
      }
    },
    prevChild () {
      console.log(1)
      this.$emit('prevChild', this.childId)
      this.$emit('update', {})
    },
    nextChild () {
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
    background: url("../../../../../assets/images/card.png") no-repeat;
    background-size: 100%;
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
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
      }

      > ::v-deep i.iconmorentouxiang {
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
    position: absolute;
    right: 8px;
    top: 85px;
    color: white;
    display: none;
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
