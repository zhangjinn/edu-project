<template>
  <div>
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs ref="tabs" v-model="name" setting @setting="handleSetting" @tab-click="handleReset">
            <el-tab-pane label="摄像头管理" name="CameraManagement">
              <etm-tool-bar
                v-show="true"
                v-model="CameraManagementFormData"
                @reset="handleReset"
                @search="handleSearch"
              />
            </el-tab-pane>
            <el-tab-pane v-if="hasAuth('newdaycare.monitorCare.queryBatch', 'tabs', 'name')" label="托育云视频服务" name="CloudCameraService">
              <etm-tool-bar
                v-show="true"
                v-model="CloudCameraServiceFormData"
                @reset="handleReset"
                @search="handleSearch"
              />
            </el-tab-pane>
            <el-tab-pane v-if="hasAuth('newdaycare.monitorGuard.queryBatch', 'tabs', 'name')" label="幼儿云视频服务" name="service">
              <etm-tool-bar
                v-model="nope"
                @search="search"
                @reset="reset"
              >
                <el-form-item label="幼儿姓名:">
                  <el-input v-model.trim="filters.childName" placeholder="请输入幼儿姓名" />
                </el-form-item>

                <el-form-item label="家长姓名:">
                  <el-input v-model.trim="filters.parentName" placeholder="请输入家长姓名" />
                </el-form-item>

                <el-form-item label="联系电话:">
                  <el-input v-model.trim="filters.phone" placeholder="请输入联系电话" />
                </el-form-item>

                <el-form-item label="开通状态:">
                  <el-select
                    v-model="filters.status"
                    filterable
                  >
                    <el-option label="全部" value="" />
                    <el-option label="开通" value="ENABLE" />
                    <el-option label="过期" value="OVERDUE" />
                    <el-option label="未开通" value="UN_BUY" />
                  </el-select>
                </el-form-item>

                <el-form-item label="班级:">
                  <el-select
                    ref="selection"
                    v-model="filters.grade"
                    filterable
                    placeholder="请选择年级"
                    @change="change"
                  >
                    <el-option
                      v-for="item in gradeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select
                    v-model="filters.clazzId"
                    filterable
                    placeholder="请选择班级"
                  >
                    <el-option
                      v-for="item in clazzOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </etm-tool-bar>
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <template v-if="name === 'service'">
            <etm-table-tool-bar slot="tool">
              <el-button slot="right" plain @click.stop="exportToExcel">
                导出Excel
              </el-button>
            </etm-table-tool-bar>
            <etm-table-page
              :data="tableData"
              :span-method="objectSpanMethod"
              @currentChange="currentChange"
            >
              <el-table-column
                v-for="column in columns"
                :key="column.prop"
                slot="left"
                :label="column.label"
                :prop="column.prop"
              >
                <template slot-scope="scope">
                  <etm-status
                    v-if="column.prop === 'status'"
                    :type="{'ENABLE': 'active', 'OVERDUE': 'danger', 'UN_BUY': 'inactive'}[scope.row.status]"
                  >
                    {{ {'ENABLE': '开通', 'OVERDUE': '过期', 'UN_BUY': '未开通'}[scope.row.status] }}
                  </etm-status>
                  <span v-else-if="column.prop === 'operateBy'">
                    {{ scope.row.payType === '线上' ? scope.row.parentName : scope.row.operateBy }}
                  </span>
                  <span v-else>{{ scope.row[column.prop] }}</span>
                </template>
              </el-table-column>
              <el-table-column
                slot="right"
                label="操作"
              >
                <template slot-scope="scoped">
                  <etm-text v-show="name === 'service' && scoped.row.status !== 'UN_BUY'" type="primary" @click.stop="renew(scoped)">续费</etm-text>
                  <etm-text v-show="name === 'service' && scoped.row.status !== 'UN_BUY'" type="danger" @click.stop="closeService(scoped)">关闭服务</etm-text>
                  <etm-text v-show="name === 'service' && scoped.row.status === 'UN_BUY'" type="primary" @click.stop="activeOffline(scoped)">线下开通</etm-text>
                </template>
              </el-table-column>
            </etm-table-page>
          </template>
          <component
            :is="name"
            v-else
            :ref="name"
            :form-data="{CameraManagement: CameraManagementFormData, CloudCameraService: CloudCameraServiceFormData }[name]"
          />
        </div>
      </etm-layout-split>
      <etm-drawer
        :visible.sync="showSide"
        type="small"
      >
        <etm-layout-split>
          <etm-title :show-line="false" border size="big">
            {{ { renew: '续费', active: '线下开通' }[serviceFormType] }}
            <template slot="tool">
              <el-button plain size="mini" @click.stop="handleDrawerSubmit">提交</el-button>
            </template>
          </etm-title>
          <etm-form ref="drawerForm" type="dialog" :model="drawerFormData" :rules="drawerRules">
            <el-form-item label="幼儿姓名">
              {{ drawerFormData.childName }}
            </el-form-item>
            <el-form-item label="年级">
              {{ drawerFormData.gradeName }}
            </el-form-item>
            <el-form-item label="班级">
              {{ drawerFormData.clazzName }}
            </el-form-item>
            <el-form-item label="购买人">
              {{ `${drawerFormData.parentName}(${drawerFormData.relationship})` }}
            </el-form-item>

            <el-form-item label="选择套餐" prop="serviceId">
              <el-select v-model="drawerFormData.serviceId" placeholder="请选择套餐" @change="handleSelectService">
                <el-option
                  v-for="(item, index) in serviceList"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                >
                  {{ `${item.quantity}个月-￥${item.sellMoney}` }}
                  <span v-show="item.discountMoney !== null" style="text-decoration: line-through; color: #666;">
                    {{ `(￥${item.discountMoney})` }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="到期日期" prop="expireDate">
              <el-date-picker
                v-model="drawerFormData.expireDate"
                type="date"
                placeholder="请选择到期日期"
              />
            </el-form-item>

            <el-form-item label="应付金额（元）" prop="shouldPay">
              <el-input
                v-model="drawerFormData.shouldPay"
                placeholder="请输入应付金额"
                @blur="handleBlur"
              />
            </el-form-item>
            <el-form-item label="实付金额（元）" prop="actualPay">
              <el-input
                v-model="drawerFormData.actualPay"
                placeholder="请输入实付金额"
                @blur="handleBlur"
              />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentType">
              <el-select v-model="drawerFormData.paymentType" placeholder="请选择支付方式">
                <el-option
                  v-for="item in paymentTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </etm-form>
        </etm-layout-split>
      </etm-drawer>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * cashFlow create by shanglu
 * createTime 2020/10/20 9:00
 */
import baseMixin from '@/layout/mixin/baseMixin'
import transferDate from '@/utils/date'
import { downloadFileForUrl } from '@/utils/file'

import CameraManagement from '@/views/newDaycare/listEquipment/monitorEquipment/cameraManagement'
import CloudCameraService from '@/views/newDaycare/listEquipment/monitorEquipment/cloudCameraService'
import {
  queryPackageList,
  queryServiceRecordList,
  closeService,
  addService,
  exportServiceList,
  getClazz,
  getGrade
} from '@/api/newDaycare/monitorEquipment.js'
export default {
  name: 'MonitorEquipment',
  components: {
    CameraManagement,
    CloudCameraService
  },
  mixins: [baseMixin],
  data() {
    return {
      name: 'CameraManagement',
      CameraManagementFormData: [{
        label: '名称',
        type: 'input',
        value: '',
        prop: 'cameraName',
        props: {
          placeholder: '请输入名称'
        }
      }],
      CloudCameraServiceFormData: [
        {
          label: '学员姓名',
          type: 'input',
          value: '',
          prop: 'childName',
          props: {
            placeholder: '请输入学员姓名'
          }
        },
        {
          label: '联系人姓名',
          type: 'input',
          value: '',
          prop: 'personName',
          props: {
            placeholder: '请输入联系人姓名'
          }
        },
        {
          label: '联系电话',
          type: 'input',
          value: '',
          prop: 'parentPhone',
          props: {
            placeholder: '请输入联系电话'
          }
        },
        {
          label: '开通状态',
          type: 'select',
          value: '',
          prop: 'cameraBuyStatusEnum',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '未开通',
              value: 'NONACTIVATED'
            },
            {
              label: '已开通',
              value: 'ACTIVATED'
            }
          ],
          props: {
            placeholder: '请选择开通状态'
          }
        }
      ],
      // 幼儿部分
      nope: [],
      cameraName: '',
      filters: {
        childName: '',
        parentName: '',
        phone: '',
        status: '',
        grade: '',
        clazzId: ''
      }, // 云视频服务选项卡下的查询表单
      tableData: {
        content: []
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      formData: {
        brand: '',
        cameraName: '未命名设备',
        serialNumber: '',
        verifyCode: '',
        position: ''
      },
      rules: {
        brand: [
          { required: true, message: '请选择摄像头品牌' }
        ],
        cameraName: [
          { required: true, message: '请输入摄像头名称' }
        ],
        serialNumber: [
          { required: true, trigger: 'blur', validator(rule, value, cb) {
            if (value.length !== 9) {
              cb(new Error('请输入9位摄像头序列号'))
            } else {
              cb()
            }
          } }
        ],
        verifyCode: [
          { required: true, message: '请输入摄像头验证码' }
        ]
      },
      gradeOptions: [],
      clazzOptions: [],
      showSide: false,
      serviceFormType: 'renew',
      drawerFormData: {
        childName: '',
        gradeName: '',
        clazzName: '',
        parentName: '',
        relationship: '',
        serviceId: undefined,
        expireDate: new Date(),
        shouldPay: '',
        actualPay: '',
        paymentType: ''
      },
      drawerRules: {
        serviceId: [
          { required: true, message: '请选择套餐' }
        ],
        expireDate: [
          { required: true, message: '请选择到期日期' }
        ],
        shouldPay: [
          { required: true, message: '请输入应付金额' }
        ],
        actualPay: [
          { required: true, message: '请输入实付金额' }
        ],
        paymentType: [
          { required: true, message: '请选择支付方式' }
        ]
      },
      paymentTypeList: [
        { label: '微信', value: 'WECHAT' },
        { label: '支付宝', value: 'ALIPAY' },
        { label: '现金', value: 'CASH' },
        { label: '网银', value: 'ONLINE_BANKING' }
      ],
      serviceList: [],
      canExport: true,
      judgeCombineObj: {},
      columns: [
        { label: '幼儿姓名', prop: 'childName' },
        { label: '年级', prop: 'gradeName' },
        { label: '班级', prop: 'clazzName' },
        { label: '家长姓名', prop: 'parentName' },
        { label: '关系', prop: 'relationship' },
        { label: '家长电话', prop: 'parentPhone' },
        { label: '到期日期', prop: 'expireDate' },
        { label: '开通方式', prop: 'paymentType' },
        { label: '开通状态', prop: 'status' },
        { label: '操作人', prop: 'operateBy' }
      ]
    }
  },
  watch: {
    name: {
      handler(v) {
        if (v === 'service') {
          this.getGradeList()
          queryPackageList({}).then(res => {
            const { data } = res
            data.forEach(v => {
              v.value = v.cameraServicePackageId
              v.label = v.discountMoney === null ? `${v.quantity}个月-￥${v.sellMoney || 0}(售卖)` : `${v.quantity}个月-￥${v.sellMoney || 0}(售卖)-￥${v.discountMoney || 0}(优惠)`
            })
            this.serviceList = data
          }).catch(err => {
            this.serviceList = []
            console.log(err)
          })
        }
        this.reset()
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleReset()
    })
  },
  methods: {
    handleSearch() {
      this.$nextTick(() => {
        this.$refs[this.name].search()
      })
    },
    handleReset() {
      this.$nextTick(() => {
        this.$refs[this.name] && this.$refs[this.name].reset()
      })
    },
    handleSetting() {
      this.$router.push({ path: '/newdaycare_videoEquipment/videoEquipmentSetting' })
    },
    // 幼儿园部分
    change(id) { // 改变年级切换对应班级
      this.filters.clazzId = ''
      this.getClazzList(id)
    },
    // 获取班级列表
    getClazzList(id) {
      const param = {
        gradeId: id,
        paged: false
      }
      getClazz(param).then((res) => {
        this.clazzOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },
    // 获取年级列表
    getGradeList() {
      const param = {
        paged: false
      }
      getGrade(param).then((res) => {
        this.gradeOptions = this.convertDataToOptions(res.data, 'name', 'id')
      })
    },
    search() {
      this.refreshTableData()
    },
    reset() {
      if (this.name === 'service') {
        this.filters = {
          childName: '',
          parentName: '',
          phone: '',
          status: '',
          grade: '',
          clazzId: ''
        }
        this.clazzOptions = []
      }
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10
      }
      this.refreshTableData()
    },
    refreshTableData() {
      if (this.name === 'service') {
        const options = {
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize
        }
        const attrArr = ['childName', 'parentName', 'phone', 'status', 'clazzId']
        attrArr.forEach(attr => {
          if (this.filters[attr]) {
            options[attr] = this.filters[attr]
          }
        })
        queryServiceRecordList(options).then(res => {
          const { data } = res
          this.judgeCombineObj = {}
          this.handleSort(data.content)
          data.content.forEach((v, index) => {
            if (!this.judgeCombineObj[v.childId]) {
              this.judgeCombineObj[v.childId] = []
            }
            this.judgeCombineObj[v.childId].push(index)
            v.expireDate = transferDate(v.expireDate).time
          })
          this.handleJudgeCombineObj()
          this.tableData = data
        }).catch(err => {
          this.tableData = {
            content: []
          }
          this.judge = {}
          console.log(err)
        })
      }
    },
    // 将同一个孩子的不同开通状态的家长排在一起
    handleSort(content) {
      if (content[0].status === content[content.length - 1].status) { // 如果展示的信息的开通状态都一样，则不处理
        return content
      }
      for (let i = 0; i < content.length; i++) {
        const target = content[i]
        if (target.status === 'ENABLE') {
          _switch(target.childId, i)
        }
        if (target.status === 'UN_BUY') {
          break
        }
      }
      return content
      function _switch(childId, index) {
        for (let j = content.length - 1; j >= 0; j--) { // 从后面（未开通状态）开始往前遍历
          // 如果是未开通状态且还没被移动的选项而且是同一个孩子的家长
          if (content[j].status === 'UN_BUY' && !content[j]._sort && content[j].childId === childId) {
            const target = content.splice(j, 1)[0] // 获得这条信息，从数据中割裂出来
            target._sort = true // 标识为已经排序过了
            content.splice(index, 0, target) // 插入到开通状态的信息后面
            j++
          }
          if (content[j].status === 'ENABLE') { // 遍历到了已开通状态的信息，返回
            return
          }
        }
      }
    },
    handleJudgeCombineObj() {
      for (const id of Object.keys(this.judgeCombineObj)) {
        const arr = this.judgeCombineObj[id]
        if (Array.isArray(arr)) {
          if (arr.length === 1) { // 一个幼儿只有一个家长信息
            arr._type = 'single' // 标识一个
          }
          if (arr.length > 1) { // 一个幼儿对应多个家长信息
            arr.shift() // 移除第一个索引
            arr._type = 'multiple' // 标识多个
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.name === 'service' && [0, 1, 2].indexOf(columnIndex) !== -1) {
        if (Object.keys(this.judgeCombineObj).length === 0) {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
        const judgeArr = this.judgeCombineObj[row.childId]
        if (judgeArr._type && judgeArr._type === 'multiple') { // 对应多个家长
          if (judgeArr.indexOf(rowIndex) === -1) { // 合并头
            return {
              rowspan: judgeArr.length + 1,
              colspan: 1
            }
          } else { // 合并身体
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else { // 对应一个家长
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize
      }
      this.refreshTableData()
    },
    exportToExcel() {
      if (!this.canExport) return
      this.canExport = false
      const options = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }
      const attrArr = ['childName', 'parentName', 'phone', 'status', 'clazzId']
      attrArr.forEach(attr => {
        if (this.filters[attr]) {
          options[attr] = this.filters[attr]
        }
      })
      exportServiceList(options).then(res => {
        downloadFileForUrl(res)
        this.canExport = true
      }).catch(err => {
        console.error(err)
        this.canExport = true
      })
    },
    renew(s) { // 续费
      this.serviceFormType = 'renew'
      this.initForm(s)
      this.showSide = true
    },
    closeService(s) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要关闭服务？',
        content: '关闭后，该家长将无法观看云视频服务',
        confirmBtn: '关闭',
        cancelBtn: '取消',
        confirm: () => {
          closeService({ deviceServiceRecordId: s.row.deviceServiceRecordId }).then(res => {
            this.$message.success('关闭成功')
            this.$etmTip.close()
            this.refreshTableData()
          }).catch(err => {
            console.log(err)
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    activeOffline(s) { // 线下开通
      this.serviceFormType = 'active'
      this.initForm(s)
      this.showSide = true
    },
    handleDrawerSubmit() {
      this.$refs.drawerForm.$children[0].validate(valid => {
        if (valid) {
          addService({
            childId: this.drawerFormData.childId,
            parentId: this.drawerFormData.parentId,
            paymentType: this.drawerFormData.paymentType,
            serviceId: this.drawerFormData.serviceId,
            expireDate: transferDate(this.drawerFormData.expireDate).time,
            totalAmount: this.drawerFormData.shouldPay,
            actualAmount: this.drawerFormData.actualPay
          }).then(res => {
            this.$message.success('操作成功')
            this.showSide = false
            this.refreshTableData()
          }).catch(err => {
            this.showSide = false
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    initForm(s) {
      const { childName, gradeName, clazzName, parentName, parentId, relationship, paymentType, deviceServiceRecordId, expireDate, serviceId, childId } = s.row
      this.drawerFormData.deviceServiceRecordId = deviceServiceRecordId
      this.drawerFormData.childName = childName
      this.drawerFormData.gradeName = gradeName
      this.drawerFormData.clazzName = clazzName
      this.drawerFormData.parentName = parentName
      this.drawerFormData.relationship = relationship
      this.drawerFormData.paymentType = { '微信': 'WECHAT', '支付宝': 'ALIPAY', '现金': 'CASH', '网银': 'ONLINE_BANKING' }[paymentType]
      this.drawerFormData.expire = expireDate
      this.drawerFormData.expireDate = new Date(expireDate)
      this.drawerFormData.parentId = parentId
      this.drawerFormData.serviceId = serviceId
      this.drawerFormData.childId = childId
      if (serviceId && serviceId !== '--') {
        this.handleSelectService(serviceId)
      } else if (this.serviceList.length) {
        this.drawerFormData.serviceId = this.serviceList[0].cameraServicePackageId
        this.handleSelectService(this.serviceList[0].cameraServicePackageId)
      }
    },
    handleBlur(e) { // 限制只能输入两位数小数
      let value = e.target.value.replace(/[a-zA-z]/g, '') // 转为只能是数字
      if (value) {
        const REG = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/ // 验证是否是两位小数的数字
        if (/\./.test(value)) { // 有小数点
          if (!REG.test(value)) { // 不符合两位小数的
            this.$message.warning('请输入两位小数的数字类型')
            value = ''
          }
        } else { // 没有小数点，后面补两位小数0
          value += '.00'
        }
        e.target.value = value
      } else {
        e.target.value = ''
      }
    },
    handleSelectService(serviceId) {
      let target
      for (let i = 0; i < this.serviceList.length; i++) {
        if (this.serviceList[i].cameraServicePackageId === serviceId) {
          target = this.serviceList[i]
          break
        }
      }
      if (target) {
        this.drawerFormData.shouldPay = target.sellMoney + ''
        this.drawerFormData.actualPay = target.discountMoney === null ? (target.sellMoney + '') : (target.discountMoney + '')
        let date
        if (this.serviceFormType === 'renew') { // 续费
          date = new Date(this.drawerFormData.expire)
        }
        if (this.serviceFormType === 'active') { // 开通
          date = new Date()
        }
        date.setMonth(date.getMonth() + target.quantity)
        this.drawerFormData.expireDate = date
      }
    }
  }
}
</script>

<style scoped>

</style>
