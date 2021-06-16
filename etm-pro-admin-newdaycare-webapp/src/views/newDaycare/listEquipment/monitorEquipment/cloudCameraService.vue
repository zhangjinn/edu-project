<template>
  <div class="cloudCameraService-wrap">
    <etm-table-page
      :data="tableData"
      index
      @size-change="handleSizeChange"
      @currentChange="handleCurrentChange"
    >
      <el-table-column label="学员姓名">
        <template v-slot="scoped">
          {{ scoped.row.childName }}
        </template>
      </el-table-column>
      <el-table-column label="联系人姓名">
        <template v-slot="scoped">
          <etm-text
            type="primary"
            @click.stop="handleDetail(scoped.row)"
          >
            {{ scoped.row.personName }}
          </etm-text>
        </template>
      </el-table-column>
      <el-table-column label="关系">
        <template v-slot="scoped">
          {{ scoped.row.relationshipName }}
        </template>
      </el-table-column>
      <el-table-column label="联系人电话">
        <template v-slot="scoped">
          {{ scoped.row.parentPhone }}
        </template>
      </el-table-column>
      <el-table-column label="到期日期">
        <template v-slot="scoped">
          {{ scoped.row.expireDate | filterDate }}
        </template>
      </el-table-column>
      <el-table-column label="开通方式">
        <template v-slot="scoped">
          {{ scoped.row.openType | openType }}
        </template>
      </el-table-column>
      <el-table-column label="开通状态">
        <template v-slot="scoped">
          {{ scoped.row.openState | filter }}
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="操作"
      >
        <template v-slot="scoped">
          <!-- <etm-text v-if="scoped.row.openState === 'ACTIVATED'" type="primary" @click.stop="handleEdit(scoped.row)">编辑</etm-text> -->
          <etm-text
            v-if="scoped.row.openState === 'ACTIVATED'"
            type="primary"
            @click.stop="handleContinue(scoped.row)"
          >
            续费
          </etm-text>
          <etm-text
            v-if="scoped.row.openState === 'ACTIVATED'"
            type="danger"
            @click.stop="handleCloseService(scoped.row)"
          >
            关闭服务
          </etm-text>
          <etm-text
            v-if="scoped.row.openState === 'NONACTIVATED'"
            type="primary"
            @click.stop="handleOpenService(scoped.row)"
          >
            线下开通
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <!--添加弹框-->
    <!-- <etm-pop
      v-if="showCloudPop"
      :visible.sync="showCloudPop"
      cancel-btn="取消"
      confirm-btn="确定开通"
      pop="complex"
      title="开通云视频服务"
      @cancel="popClose"
      @close="popClose"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <edit ref="addForm" :type="type" :child-id="childId" :parent-phone="parentPhone" />
      </div>
    </etm-pop> -->
    <etm-drawer
      v-if="showCloudPop"
      :visible.sync="showCloudPop"
    >
      <etm-layout-split line>
        <etm-title
          :title="drawerTitles[type]"
          border
        >
          <template slot="tool">
            <el-button
              size="mini"
              type="primary"
              @click="popConfirm"
            >
              提交
            </el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <edit
            ref="addForm"
            :type="type"
            :child-id="childId"
            :parent-id="parentId"
            :parent-phone="parentPhone"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>

    <!--详情/编辑抽屉-->
    <etm-drawer
      v-if="showCloudDrawer"
      :visible.sync="showCloudDrawer"
    >
      <etm-layout-split line>
        <etm-title
          :title="drawerTitles[type]"
          border
        >
          <template
            v-if="type==='edit'"
            slot="tool"
          >
            <el-button
              plain
              size="mini"
              @click="type = '';showCloudDrawer = false"
            >
              取消
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="popConfirm"
            >
              保存
            </el-button>
          </template>
          <template
            v-if="type==='detail'"
            slot="tool"
          >
            <el-button
              plain
              size="mini"
              @click="handleEdit"
            >
              编辑
            </el-button>
          </template>
        </etm-title>
        <div class="drawerBody">
          <component
            :is="type"
            ref="editFrom"
            :child-id="childId"
            :parent-id="parentId"
            :parent-phone="parentPhone"
            :type="type"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import { createServiceNContinue, queryCameratOrderList, updateCameratOrder, removeService } from '@/api/newDaycare/monitorEquipment'
import edit from '@/views/newDaycare/listEquipment/monitorEquipment/components/cloudCameraServiceEdit'
import detail from '@/views/newDaycare/listEquipment/monitorEquipment/components/cloudCameraServiceDetail'
import baseMixin from '@/layout/mixin/baseMixin'
import { parseTime } from '@/utils'

/**
 * CloudCameraService create by zhangbanxian
 * createTime 2020/10/27 13:42
 */
export default {
  name: 'CloudCameraService',
  components: {
    edit,
    detail
  },
  filters: {
    filter (v) {
      if (v) {
        const item = [
          {
            label: '未开通',
            value: 'NONACTIVATED'
          },
          {
            label: '已开通',
            value: 'ACTIVATED'
          }
        ].find(j => j.value === v) || {}
        return item.label
      } else return ''
    },
    filterDate (v) {
      if (v && v !== '--') return parseTime(v).substr(0, 10)
      else return v
    },
    openType (v) {
      return { ONLINE: '线上', OFFLINE: '线下' }[v]
    }
  },
  mixins: [baseMixin],
  props: {
    formData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // formData: [],
      searchForm: {
        childName: '',
        personName: '',
        parentPhone: '',
        parentId: '',
        cameraBuyStatusEnum: '',
        pageNum: 1,
        pageSize: 10
      },
      showCloudPop: false,
      showCloudDrawer: false,
      drawerTitles: {
        edit: '编辑',
        detail: '详情',
        add: '线下开通',
        continue: '续费'
      },
      type: '',
      childId: '',
      parentPhone: '',
      // 表格数据
      tableData: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 888,
        totalPages: 22,
        content: [{ parentName: '父亲' }]
      }
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    init (params = this.searchForm) {
      queryCameratOrderList(params).then(res => {
        // console.log('cameraList', res)
        this.tableData = res.data
      })
    },
    search () {
      this.searchForm.childName = this.getValueByProp('childName', this.formData) || null
      this.searchForm.personName = this.getValueByProp('personName', this.formData) || null
      this.searchForm.parentPhone = this.getValueByProp('parentPhone', this.formData) || null
      this.searchForm.cameraBuyStatusEnum = this.getValueByProp('cameraBuyStatusEnum', this.formData) || null
      this.searchForm.pageNum = 1
      this.init()
    },
    reset () {
      this.searchForm = {
        childName: null,
        personName: null,
        parentPhone: null,
        cameraBuyStatusEnum: null,
        pageNum: 1,
        pageSize: 10
      }
      this.init()
    },
    handleSizeChange (val) {
      this.searchForm.pageNum = 1
      this.searchForm.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.searchForm.pageNum = val
      this.init()
    },
    handleEdit (row) {
      this.type = 'edit'
      if (row.childId) {
        this.childId = row.childId
        this.parentPhone = row.parentPhone
        this.parentId = row.parentId
      }
      this.showCloudDrawer = true
    },
    handleDetail (row) {
      this.type = 'detail'
      this.childId = row.childId
      this.parentPhone = row.parentPhone
      this.parentId = row.parentId
      this.showCloudDrawer = true
    },
    handleCloseService (row) {
      // const cameraId = row.cameraId
      // removeCamera(cameraId).then(() => {
      //   this.$message.success('删除成功')
      //   this.init()
      // })
      this.$etmTip.init({
        type: 'error',
        title: '确认要关闭服务？',
        content: '关闭后，家长将无法观看云视频',
        confirmBtn: '确定',
        cancelBtn: '取消',
        cancel: () => {
          this.$etmTip.close()
        },
        confirm: () => {
          this.$etmTip.close()
          removeService({ childId: row.childId, parentId: row.parentId }).then(() => {
            this.$message.success('关闭成功')
            this.init()
          })
        }
      })
      this.$etmTip.open()
    },
    handleOpenService (row) {
      this.type = 'add'
      if (row.childId) {
        this.childId = row.childId
        this.parentPhone = row.parentPhone
        this.parentId = row.parentId
      }
      this.showCloudPop = true
      this.$nextTick(() => {
        this.$refs.addForm.init()
      })
    },
    handleContinue (row) {
      this.type = 'continue'
      if (row.childId) {
        this.childId = row.childId
        this.parentPhone = row.parentPhone
        this.parentId = row.parentId
      }
      this.showCloudPop = true
      this.$nextTick(() => {
        this.$refs.addForm.init()
      })
    },
    popConfirm () {
      let ref, fn, msg
      if (this.type === 'add' || this.type === 'continue') {
        ref = 'addForm'
        fn = createServiceNContinue
        msg = { add: '开通成功', continue: '续费成功' }[this.type]
        this.$refs[ref].$refs.form.$children[0].validate(valid => {
          if (valid) {
            const formData = this.$refs[ref].form
            createServiceNContinue({
              childId: this.childId,
              phone: formData.parentPhone,
              expireDate: formData.expireDate,
              packId: formData.serviceId,
              originalPayAmount: formData.shouldPay,
              payAmount: formData.actualPay,
              payTypeId: formData.paymentType
            }).then(() => {
              this.$message.success(msg)
              this.type = ''
              this.showCloudDrawer = false
              this.showCloudPop = false
              this.init()
            })
          } else {
            return false
          }
        })
        return
      } else if (this.type === 'edit') {
        ref = 'editFrom'
        fn = updateCameratOrder
        msg = '修改成功'
      }
      // console.log('this.refs', this, this.$refs)
      this.$refs[ref].$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs[ref].form
          let params
          if (this.type === 'add') {
            params = {
              childId: this.childId,
              phone: formData.parentPhone,
              expireDate: formData.expireDate
            }
          } else {
            params = {
              parentPhone: formData.parentPhone,
              expireDate: formData.expireDate
            }
          }
          fn(params).then(() => {
            this.$message.success(msg)
            this.type = ''
            this.showCloudDrawer = false
            this.showCloudPop = false
            this.init()
          })
        }
      })
    },
    popClose () {
      this.type = ''
      this.showCloudPop = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
