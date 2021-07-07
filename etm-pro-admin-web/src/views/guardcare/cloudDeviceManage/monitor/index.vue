<template>
  <div class="monitor">
    <etm-layout-split>
      <div slot="header">
        <etm-tabs v-model="tabsValue" setting @setting="toSetting">
          <el-tab-pane label="摄像头管理" name="manage">
            <etm-tool-bar
              v-model="nope"
              @search="search"
              @reset="reset"
            >
              <el-form-item label="名称:">
                <el-input v-model.trim="cameraName" placeholder="请输入摄像头名称" />
              </el-form-item>
            </etm-tool-bar>
          </el-tab-pane>
          <el-tab-pane label="云视频服务" name="service">
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
        <etm-table-tool-bar slot="tool">
          <template v-if="tabsValue === 'manage'">
            <div slot="right">
              <el-button type="primary" @click.stop="handleAdd">
                <i class="el-icon-plus" />&nbsp;&nbsp;添加摄像头
              </el-button>
              <el-button plain @click.stop="$router.push('/guardcareSettings/guardcare_monitorEquipment_clazzAuthorize')">
                班级授权
              </el-button>
              <el-button plain @click.stop="$router.push('/guardcareSettings/guardcare_monitorEquipment_staffAuthorize')">
                员工授权
              </el-button>
            </div>
          </template>
          <div v-else slot="right">
            <el-button plain @click.stop="exportToExcel">
              导出Excel
            </el-button>
          </div>
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
              <etm-text v-show="tabsValue === 'manage'" type="primary" @click.stop="handleEdit(scoped)">编辑</etm-text>
              <etm-text v-show="tabsValue === 'manage'" type="danger" @click.stop="handleDelete(scoped)">删除</etm-text>
              <etm-text v-show="tabsValue === 'service' && scoped.row.status !== 'UN_BUY'" type="primary" @click.stop="renew(scoped)">续费</etm-text>
              <etm-text v-show="tabsValue === 'service' && scoped.row.status !== 'UN_BUY'" type="danger" @click.stop="closeService(scoped)">关闭服务</etm-text>
              <etm-text v-show="tabsValue === 'service' && scoped.row.status === 'UN_BUY'" type="primary" @click.stop="activeOffline(scoped)">线下开通</etm-text>
            </template>
          </el-table-column>
        </etm-table-page>
      </div>
    </etm-layout-split>
    <etm-pop
      :visible="showPop"
      pop="complex"
      :title="popTitle"
      confirm-btn="确定"
      cancel-btn="取消"
      @open="handlePopOpen"
      @close="handlePopClose"
      @confirm="handlePopConfirm"
      @cancel="handlePopCancel"
    >
      <div class="addCamera">
        <el-alert
          title="萤石摄像头序列号和验证码均在在机身底部位置。"
          type="warning"
          :closable="false"
        />
        <etm-form ref="form" type="dialog" :model="formData" :rules="rules">
          <el-form-item label="品牌" prop="brand">
            <el-select
              v-model="formData.brand"
              filterable
              placeholder="请选择摄像头品牌"
            >
              <el-option label="萤石云" value="萤石云" />
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="cameraName">
            <el-input v-model="formData.cameraName" placeholder="请输入摄像头名称" />
          </el-form-item>
          <el-form-item label="序列号" prop="serialNumber">
            <el-input v-model="formData.serialNumber" placeholder="请输入9位数摄像头序列号" />
          </el-form-item>
          <el-form-item label="验证码" prop="verifyCode">
            <el-input v-model="formData.verifyCode" placeholder="请输入摄像头验证码" />
          </el-form-item>
          <el-form-item label="位置" prop="position">
            <el-input v-model="formData.position" placeholder="请输入摄像头位置" />
          </el-form-item>
        </etm-form>
      </div>
    </etm-pop>
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
                {{ `${item.countMonth}个月-￥${item.price}` }}
                <span v-show="item.discountPrice !== null" style="text-decoration: line-through; color: #666;">
                  {{ `(￥${item.discountPrice})` }}
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
  </div>
</template>
<script>
import {
  queryCamsList,
  createCam,
  removeCam,
  queryCamDetail,
  updateCamDetail,
  queryServiceRecordList,
  queryServiceList,
  closeService,
  addService,
  exportServiceList
} from '@/api/guardcare/cloudDeviceManage/monitor'
import { getClazz } from '@/api/guardcare/edu/clazzManage'
import { getGrade } from '@/api/guardcare/edu/gradeManage'
import baseMixin from '@/layout/mixin/baseMixin'
import transferDate from '@/utils/date'
import { downloadFileForUrl } from '@/utils/file'
export default {
  mixins: [baseMixin],
  data() {
    return {
      nope: [],
      popType: 'add',
      cameraName: '',
      filters: {
        childName: '',
        parentName: '',
        phone: '',
        status: '',
        grade: '',
        clazzId: ''
      }, // 云视频服务选项卡下的查询表单
      targetCam: null, // 点击编辑或删除时候对应的摄像头对象
      tableData: {
        content: []
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      showPop: false,
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
      tabsValue: 'manage',
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
      judgeCombineObj: {}
    }
  },
  computed: {
    popTitle() {
      return { add: '添加摄像头', edit: '编辑摄像头' }[this.popType]
    },
    columns() {
      if (this.tabsValue === 'manage') {
        return [
          {
            label: '品牌',
            prop: 'brand'
          },
          {
            label: '序列号',
            prop: 'serialNumber'
          },
          {
            label: '验证码',
            prop: 'verifyCode'
          },
          {
            label: '名称',
            prop: 'cameraName'
          },
          {
            label: '位置',
            prop: 'position'
          }
        ]
      } else if (this.tabsValue === 'service') {
        return [
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
      } else {
        return []
      }
    }
  },
  watch: {
    tabsValue: {
      handler(v) {
        if (v === 'service') {
          this.getGradeList()
          queryServiceList({ enable: true }).then(res => {
            const { data } = res
            data.forEach(v => {
              v.value = v.deviceServiceId
              v.label = v.discountPrice === null ? `${v.countMonth}个月-￥${v.price || 0}(售卖)` : `${v.countMonth}个月-￥${v.price || 0}(售卖)-￥${v.discountPrice || 0}(优惠)`
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
  methods: {
    toSetting() {
      this.$router.push('/guardcareSettings/monitorManageSetting')
    },
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
      if (this.tabsValue === 'manage') {
        this.cameraName = ''
      }
      if (this.tabsValue === 'service') {
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
      if (this.tabsValue === 'manage') {
        const options = {
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize
        }
        if (this.cameraName.trim()) options.cameraName = this.cameraName.trim()
        queryCamsList(options).then(res => {
          const { data } = res
          this.tableData = data
        }).catch(err => {
          this.tableData = []
          console.log(err)
        })
      }
      if (this.tabsValue === 'service') {
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
          this.tableData = []
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
      if (this.tabsValue === 'manage') {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
      if (this.tabsValue === 'service' && [0, 1, 2].indexOf(columnIndex) !== -1) {
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
    handleEdit(s) {
      queryCamDetail({ cameraId: s.row.cameraId }).then(res => {
        const { data } = res
        this.formData = data
        this.popType = 'edit'
        this.showPop = true
      }).catch(err => {
        console.log(err)
      })
    },
    handleAdd() {
      this.popType = 'add'
      this.handlePopOpen()
    },
    handleDelete({ row }) {
      this.targetCam = row
      this.$etmTip.init({
        type: 'warn',
        title: '删除摄像头',
        content: '是否删除当前摄像头？该操作不可撤销',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          this.removeCam()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    removeCam() {
      removeCam({
        cameraId: this.targetCam.cameraId
      }).then(res => {
        this.$etmTip.close()
        this.$message.success('删除成功')
        this.refreshTableData()
      }).catch(err => {
        this.$etmTip.close()
        console.log(err)
      })
    },
    handlePopOpen() {
      this.showPop = true
    },
    handlePopClose() {
      this.showPop = false
      this.$refs.form.$children[0].resetFields()
    },
    handlePopConfirm() {
      this.$refs.form.$children[0].validate(valid => {
        if (valid) {
          const { brand, serialNumber, verifyCode, cameraName, position } = this.formData
          let p
          if (this.popType === 'add') {
            p = createCam({ brand, serialNumber, verifyCode, cameraName, position })
          }
          if (this.popType === 'edit') {
            const cameraId = this.formData.cameraId
            p = updateCamDetail({ cameraId, brand, serialNumber, verifyCode, cameraName, position })
          }
          p.then(res => {
            this.$message.success('操作成功')
            this.handlePopClose()
            this.refreshTableData()
          }).catch(err => {
            this.handlePopClose()
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    handlePopCancel() {
      this.handlePopClose()
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
      this.drawerFormData.parentId = parentId
      this.drawerFormData.serviceId = serviceId
      this.drawerFormData.childId = childId
      if (serviceId) {
        this.handleSelectService(serviceId)
      }
    },
    handleBlur(e) { // 限制只能输入两位数小数
      let value = e.target.value.replace(/[^\d.]/g, '').replace(/[^\d.]/g, '') // 转为只能是数字
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
      }
    },
    handleSelectService(serviceId) {
      let target
      for (let i = 0; i < this.serviceList.length; i++) {
        if (this.serviceList[i].value === serviceId) {
          target = this.serviceList[i]
          break
        }
      }
      if (target) {
        this.drawerFormData.shouldPay = target.price + ''
        this.drawerFormData.actualPay = target.discountPrice === null ? (target.price + '') : (target.discountPrice + '')
        let date
        if (this.serviceFormType === 'renew') { // 续费
          date = new Date(this.drawerFormData.expire)
        }
        if (this.serviceFormType === 'active') { // 开通
          date = new Date(transferDate().time)
        }
        date.setMonth(date.getMonth() + target.countMonth)
        this.drawerFormData.expireDate = date
      }
    }
  }
}
</script>

<style scoped lang="scss">
.monitor {
  margin-top: 16px;
}
.addCamera {
  ::v-deep .el-alert {
    margin-bottom: 24px;
  }
}
</style>
