<template>
  <div class="child-info-wrap">
    <div
      v-if="!isEdit"
      class="detail"
    >
      <!--<etm-title title="学员详情" border>-->
      <!--  <span slot="tool">-->
      <!--    <el-button size="mini" @click="handleEdit">编辑</el-button>-->
      <!--  </span>-->
      <!--</etm-title>-->
      <div class="child-info-panel">
        <el-button
          v-has="{authId: 'daycare.child.update'}"
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
              <span class="username">{{ childDetail.data.childName }}</span>
              <img
                v-if="childDetail.data.gender === 'MALE'"
                src="../../../../../assets/images/daycare/man.png"
                alt=""
              >
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
            <el-step
              title="已到店"
              :description="step(stepData.newCustomerTime, stepData.arrivedTime)"
            />
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
          label="性别"
        >
          {{ gender[childDetail.data.gender] }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="阳历生日"
        >
          {{ childDetail.data.birthday | parseTime }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="阴历生日"
        >
          {{ childDetail.data.lunarBirthday }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="家庭住址"
        >
          {{ childDetail.data.areaName }}
        </etm-field-label>

        <etm-title
          :border="false"
          title="联系信息"
        />

        <etm-field-label
          type="left"
          label="联系人"
        >
          <p
            v-for="parent of childDetail.data.relationshipList"
            :key="parent.id"
          >
            {{ parent.parentName }} {{ parent.relationshipName }} - {{ parent.telephone }}
          </p>
        </etm-field-label>
        <etm-field-label
          type="left"
          label="QQ"
        >
          {{ childDetail.data.qqNumber }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="微信"
        >
          {{ childDetail.data.wechatNumber }}
        </etm-field-label>

        <etm-title
          :border="false"
          title="其他信息"
        />

        <etm-field-label
          type="left"
          label="学员状态"
        >
          {{ childDetail.data.statusName }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="重要程度"
        >
          {{ childDetail.data.importanceAttrName }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="学员来源"
        >
          {{ childDetail.data.sourceName }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="会员卡"
        >
          <p
            v-for="(item, index) in childDetail.data.membershipCards"
            :key="index"
          >
            {{ item.cardNumber }}-{{ item.cardTypeName }}-{{ item.personName }} ({{ item.personCall }})
          </p>
        </etm-field-label>
        <etm-field-label type="left">
          <div
            slot="label"
            class="diyLabel"
          >
            人脸照片
            <el-tooltip
              popper-class="stepTips"
              :visible-arrow="false"
              placement="right"
            >
              <i class="iconfont iconquestion-circle" />
              <div
                slot="content"
              >
                图片尺寸为640*480左右 <br>
                图片中只有一个人像<br>
                图片中人像端正<br>
                图片中人像占图片30%以上，面部区域像素不低于128x128<br>
                图片大小不超过400K<br>
                确保同一人员注册照均为本人
              </div>
            </el-tooltip>
          </div>
          <div class="face-img">
            <div
              v-for="(item, index) in childDetail.data.faceList"
              :key="index"
            >
              <el-image
                style="height: 72px;
                width: 72px;"
                :src="item.url"
                fit="cover"
              />
            </div>
          </div>
        </etm-field-label>
        <etm-field-label
          type="left"
          label="跟进人员"
        >
          {{ childDetail.data.followerName }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="市场人员"
        >
          {{ childDetail.data.marketerName }}
        </etm-field-label>

        <etm-field-label
          type="left"
          label="分配时间"
        >
          {{ childDetail.data.createTime | parseTime }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="录入时间"
        >
          {{ childDetail.data.createTime | parseTime }}
        </etm-field-label>
        <etm-field-label
          type="left"
          label="备注"
        >
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
        :edit="isEdit"
        :child-id="childId"
      />
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

  data () {
    return {
      gender: {
        MALE: '男',
        FEMALE: '女'
      },
      isEdit: false,
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
    _step () {
      return Object.keys(this.stepStatus).indexOf(this.stepData.followPhaseType)
    }
  },
  watch: {
    childId: {
      handler () {
        this.isEdit = false
        this.init()
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {
    this.init()
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
    updateStep () {
      queryFollowPhase(this.childId).then(res => {
        this.stepData = res.data
      })
    },
    handleEdit () {
      this.isEdit = true
    },
    handleSave () {
      // const childForm =

      this.$refs.addChildForm.submit().then(childForm => {
        childForm && updateChild(childForm).then(res => {
          const face = {
            status: true,
            message: ''
          }
          const imageList = res.data.imageList || []
          imageList.forEach(cur => {
            if (!cur.state) {
              face.status = false
              face.message = cur.theReason
            }
          })
          if (!face.status) {
            this.$message.warning(face.message)
          }
          this.isEdit = false
          setTimeout(() => {
            this.$message.success('操作成功')
          }, 100)

          this.$emit('update')
        })
      })
    },
    handleCancel () {
      this.isEdit = false
    },
    prevChild () {
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
    margin-left: -16px;
    margin-right: -16px;
    padding-top: 38px;

    ::v-deep {
      .el-step__title {
        font-size: 14px;
      }

      .el-step__title.is-wait {
        color: rgba(255, 255, 255, 0.6);
      }

      .el-step {
        position: relative;

        .el-step__description {
          background: rgba(255, 255, 255, 0.6);
          border-radius: 20px;
          color: #fff;
          left: 0;
          padding-left: 0;
          padding-right: 0;
          position: absolute;
          top: -12px;
          transform: translate(-50%, 0);
          width: calc(100% - 8px);

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
        background: rgba(255, 255, 255, 0.6);
        height: 2px;
      }

      .el-step__line-inner {
        border-width: 0 !important;
      }

      .el-step__head.is-finish {
        .el-step__line {
          background: #fff;
        }
      }

      .el-step__head.is-finish,
      .el-step__head.is-process {
        .el-step__icon {
          background: #fff;
          border-color: #fff;
        }
      }

      .el-step__title.is-process,
      .el-step__title.is-finish {
        color: #fff;
        font-weight: 500;
      }

      .el-step__icon {
        background: #ccc;
        border-color: #ccc;
        border-width: 1px;
        height: 8px;
        transform: translate(0, 1px);
        width: 8px;

        div {
          display: none;
        }
      }
    }
  }

  .diyLabel {
    align-items: center;
    display: flex;

    .iconquestion-circle {
      //position: relative;
      display: inline-block;
      height: 22px;
      overflow: hidden;
      width: 20px;

      &::before {
        //position: absolute;
        //top: 0;
        //left: 0;
        //transform: translate(-50%, -50%);
      }
    }
  }

  .face-img {
    display: flex;
    flex-wrap: wrap;

    > div {
      background: #ccc;
      height: 72px;
      margin: 0 8px 0 0;
      width: 72px;
    }
  }

  .child-info-panel {
    background: url('../../../../../assets/images/daycare/card.png') no-repeat;
    border-radius: 4px;
    height: 190px;
    margin-bottom: 16px;
    //display: flex;
    //align-items: flex-start;
    padding: 16px;
    position: relative;

    &:hover {
      .leftIcon,
      .rightIcon {
        display: block;
      }
    }

    .child-info-box {
      align-items: flex-start;
      display: flex;
    }

    ::v-deep .edit-btn {
      border-radius: 20px 0 0 20px;
      position: absolute;
      right: 0;
      top: 16px;
    }

    .img-box {
      align-items: center;
      border-radius: 50%;
      display: flex;
      height: 48px;
      justify-content: center;
      overflow: hidden;
      padding: 0 !important;
      width: 48px;

      img {
        height: 100%;
        width: 100%;
      }

      > ::v-deep .iconmorentouxiang {
        color: #fff;
        font-size: 48px;
        width: 100%;
      }
    }

    .info {
      color: $white;
      flex: 1;
      padding-left: 16px;

      .name-box {
        align-items: center;
        display: flex;
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
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }

  .tag-box {
    padding-bottom: 16px;

    .tag-item {
      align-items: center;
      border-radius: 2px;
      display: inline-flex;
      font-size: 12px;
      height: 22px;
      justify-content: center;
      line-height: 22px;
      margin-bottom: 8px;
      margin-right: 8px;
      padding: 0 8px;
    }

    .noTag {
      @include c_secondary_color();
      font-size: 14px;
      text-align: center;
    }
  }

  .leftIcon {
    color: #fff;
    display: none;
    height: 14px;
    left: 8px;
    opacity: 0.3;
    position: absolute;
    top: 85px;
    width: 14px;

    i {
      display: block;
      height: 14px;
      width: 14px;
    }
  }

  .leftIcon:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  .rightIcon {
    color: #fff;
    display: none;
    height: 14px;
    opacity: 0.3;
    position: absolute;
    right: 8px;
    top: 85px;
    width: 14px;

    i {
      display: block;
      height: 14px;
      width: 14px;
    }
  }

  .rightIcon:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
</style>
