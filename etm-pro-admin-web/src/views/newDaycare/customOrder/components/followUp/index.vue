<template>
  <div class="followUp">
    <etm-layout-split :left-styles="{minWidth:'320px', maxWidth:'320px'}">
      <template slot="left">
        <customer-detail :customer-id="customerId" @handleCall="handleCall" @handleMessage="handleMessage" />
      </template>
      <div slot="right" class="right">
        <etm-tabs v-if="customerType === 'detail'" v-model="activeName" :show-toggle="false">
          <el-tab-pane label="跟进记录" name="followUpRecord">
            <timeLine v-if="activeName==='followUpRecord'" />
          </el-tab-pane>
        </etm-tabs>
        <etm-tabs v-else v-model="activeName" :show-toggle="false">
          <el-tab-pane label="写跟进" name="followUp">
            <customize-form
              v-if="activeName==='followUp'"
              ref="childCustomizeForm"
              :form-data="formData"
              @dynamicTags="getDynamicTags"
              @imgKeyList="getImgKeyList"
            >
              <etm-form-foot @save="saveFollowUpForm" @cancel="cancel" />
            </customize-form>
          </el-tab-pane>
          <el-tab-pane label="跟进记录" name="followUpRecord">
            <timeLine v-if="activeName==='followUpRecord'" />
          </el-tab-pane>
          <el-tab-pane label="通话记录" name="callRecords">
            <call-records v-if="activeName==='callRecords'" ref="callChild" :customer-id="customerId" />
          </el-tab-pane>
          <el-tab-pane label="短信记录" name="smsRecords">
            <sms-records v-if="activeName==='smsRecords'" ref="smsChild" :customer-id="customerId" @handleMessage="handleMessage" />
          </el-tab-pane>
        </etm-tabs>
      </div>

    </etm-layout-split>
  </div>

</template>

<script>
import customizeForm from '../addCustomer/newCustomizeForm'
import timeLine from '../timeLine/index'
import customerDetail from './customerDetail'
import callRecords from './callRecords'
import smsRecords from './smsRecords'
import formValidate from '@/utils/rules'
import { getSelectedCustomerRow, getCustomerType } from '@/utils/auth'
import { getFollowFields, addFollow } from '@/api/customer'
export default {
  name: 'Index',
  components: {
    customizeForm,
    timeLine,
    customerDetail,
    callRecords,
    smsRecords
  },

  data() {
    return {
      formValidate,
      isDisable: false, // 表单重复提交
      formData: { // 动态显示表单项目列表资源
        customizeLists: []
      },
      defaultLists: { // 固定显示表单项目列表资源
        followUpContent: '', // 跟进内容绑定值
        previewSrcListsStr: '' // 上传图片绑定值
      },
      previewSrcLists: [], // 上传图片的url
      dynamicTags: [], // 添加标签列表
      imgKeyList: [], // 上传图片列表
      activeName: '', // 当前tab页
      selectedCustomerRow: '', // 选中的当前客户列表里的一条数据
      customerType: '', // 选中的客户类型
      customerId: '', // 当前客户id
      customerDetailLists: {// 客户详情
        name: '',
        avatar: '',
        wechat: '',
        qq: '',
        customFields: [],
        contact: [],
        tag: []

      }
    }
  },
  watch: {
    previewSrcLists: function(val) {
      this.defaultLists.previewSrcListsStr = val.toString()
    }

  },
  created() {
    this.selectedCustomerRow = getSelectedCustomerRow()
    this.customerType = getCustomerType()
    this.customerId = this.selectedCustomerRow.customerId
    if (this.customerType === 'follow') {
      this.activeName = 'followUp'
    } else if (this.customerType === 'detail') {
      this.activeName = 'followUpRecord'
    }

    this.getFormSource()
  },
  methods: {
    handleMessage() {
      if (this.activeName === 'smsRecords') {
        this.$refs.smsChild.entrance()
      }
    },
    // 实时更新电话列表
    handleCall() {
      if (this.activeName === 'callRecords') {
        this.$refs.callChild.entrance()
      }
    },
    // 跟进、跟进记录，tab切换
    tabChange(val) {
      this.activeName = val.name
    },

    // 获取跟进自定义表单数据
    async getFormSource() {
      // 获取跟进自定义列表
      const source = await getFollowFields()
      const result = source.data
      result.forEach((item, index) => {
        if (item.controlType === 'CHECKBOX' || item.controlType === 'CASCADE_SELECT_BOX' || item.controlType === 'MARK_SELECT_BOX' || item.controlType === 'IMAGE_UPLOAD') {
          item.value = []
        } else {
          item.value = ''
        }
      })
      this.formData.customizeLists = result
    },

    // 获取上传标签列表
    getDynamicTags(val) {
      this.dynamicTags = val
    },
    getImgKeyList(key) {
      this.imgKeyList = key
    },
    // 新增跟进
    saveFollowUpForm(saveStyle) {
      this.$refs['childCustomizeForm'].$refs['customizeForm'].$children[0].validate(valid => {
        if (valid) {
          const formData = this.formData
          // 提交字段集合
          let followTime = ''
          let nextFollowTime = ''
          const customerId = this.customerId
          const customFields = []
          const customerCustomFields = []
          formData.customizeLists.forEach((item, index) => {
            if (item.key === 'state' || item.key === 'important_level' || item.key === 'sales_stage' || item.key === 'mark') {
              const cusObj = {}
              cusObj.key = item.key
              if (item.key === 'mark') {
                cusObj.value = this.dynamicTags.length > 0 ? this.dynamicTags.join(',') : ''
              } else {
                cusObj.value = item.value
              }
              customerCustomFields.push(cusObj)
            } else {
              const obj = {}
              obj.key = item.key
              if (item.key === 'follow_time') {
                followTime = item.value
              }
              if (item.key === 'next_follow_time') {
                nextFollowTime = item.value
              }
              if (item.key === 'follow_img') {
                obj.value = this.imgKeyList.length > 0 ? this.imgKeyList.join(',') : ''
              } else if (item.controlType === 'CHECKBOX') {
                obj.value = item.value.join(',')
              } else {
                obj.value = item.value
              }
              customFields.push(obj)
            }
          })

          if (this.compareDate(followTime, nextFollowTime)) { // 比较跟进时间和下次跟进时间大小
            this.$message({
              message: '跟进时间要小于下次跟进时间',
              type: 'warning'
            })
            return
          }
          this.isDisable = true
          const param = {
            customerId: customerId,
            customFields: customFields,
            customerCustomFields: customerCustomFields
          }
          addFollow(param).then((res) => {
            this.$message({
              message: '新增跟进成功',
              type: 'success'
            })
            this.previewSrcLists = [] // 上传图片的url
            this.dynamicTags = [] // 添加标签列表
            this.imgKeyList = [] // 上传图片列表
            this.getFormSource()
            this.activeName = 'followUpRecord'
            this.isDisable = false
          })
        }
      })
    },
    cancel() {
      this.$emit('jump', 'mainContent')
    },

    // 比较跟进日期和下次跟进日期
    compareDate(d1, d2) {
      return ((new Date(d1.replace(/-/g, '\/'))) >= (new Date(d2.replace(/-/g, '\/'))))
    }

  }
}
</script>

<style lang="scss" scoped>
  .followUp {
    display: flex;
    font-size: 14px;
    font-weight:400;
    @include c_text_color();
    .right{
      position: relative;
      height: 100%;
    }
    /deep/ .EtmLayoutSplit-wrap{
      .layout-left{
        margin-right: 0;
        border-radius: 0;
        border-right: 1px solid $divide-color;
      }
      .layout-right{
        border-radius: 0;
      }
    }

  }

</style>
