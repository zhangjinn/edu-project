<template>
  <div class="cameraManagement-wrap">
    <etm-table-page
      :columns="columns"
      :data="tableData"
      @size-change="handleSizeChange"
      @currentChange="handleCurrentChange"
    >
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button
            type="primary"
            @click="handleAdd"
          >
            <i class="el-icon-plus" /> 添加摄像头
          </el-button>
          <el-button
            v-if="hasAuthOfBool('newdaycare.monitorCare.empower')"
            plain
            @click="gotoClassroomAuthorize"
          >
            托育班级授权
          </el-button>
          <el-button
            v-if="hasAuthOfBool('newdaycare.monitorGuard.empower')"
            plain
            @click="gotoChildClassroomAuthorize"
          >
            幼儿园班级授权
          </el-button>
          <el-button
            plain
            @click="gotoWorderAuthorize"
          >
            教职工授权
          </el-button>
        </div>
      </etm-table-tool-bar>
      <el-table-column label="名称">
        <template v-slot="scoped">
          <etm-text
            type="primary"
            @click.stop="handleDetail(scoped.row)"
          >
            {{ scoped.row.cameraName }}
          </etm-text>
        </template>
      </el-table-column>
      <el-table-column label="位置">
        <template v-slot="scoped">
          {{ scoped.row.address }}
        </template>
      </el-table-column>
      <el-table-column
        slot="right"
        label="操作"
      >
        <template v-slot="scoped">
          <etm-text
            type="primary"
            @click.stop="handleEdit(scoped.row)"
          >
            编辑
          </etm-text>
          <etm-text
            type="danger"
            @click.stop="handleDelete(scoped.row)"
          >
            删除
          </etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <!--添加弹框-->
    <etm-pop
      v-if="showPop"
      :visible.sync="showPop"
      cancel-btn="取消"
      confirm-btn="确定"
      pop="complex"
      title="添加摄像头"
      @cancel="popClose"
      @close="popClose"
      @confirm="popConfirm"
    >
      <div class="popContent">
        <edit
          ref="addForm"
          :type="type"
        />
      </div>
    </etm-pop>

    <!--详情/编辑抽屉-->
    <etm-drawer
      v-if="showDrawer"
      :visible.sync="showDrawer"
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
              @click="type = '';showDrawer = false"
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
            :camera-id="cameraId"
            :type="type"
          />
        </div>
      </etm-layout-split>
    </etm-drawer>
  </div>
</template>

<script>
import {
  createCamera,
  queryCameraList,
  removeCamera,
  updateCamera
} from '@/api/newDaycare/monitorEquipment'
import edit from '@/views/newDaycare/listEquipment/monitorEquipment/components/cameraManagementEdit'
import detail from '@/views/newDaycare/listEquipment/monitorEquipment/components/cameraManagementDetail'
import baseMixin from '@/layout/mixin/baseMixin'
/**
 * cameraManagement create by zhangbanxian
 * createTime 2020/10/27 10:59
 */
export default {
  name: 'CameraManagement',
  components: {
    edit,
    detail
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
        cameraName: null,
        pageSize: 10,
        pageNum: 1
      },
      showPop: false,
      showDrawer: false,
      drawerTitles: {
        edit: '编辑摄像头',
        detail: '详情'
      },
      type: '',
      cameraId: '',
      // 表格数据
      tableData: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 888,
        totalPages: 22,
        content: []
      },
      columns: [
        {
          label: '品牌',
          prop: 'brand',
          formatter (row) {
            // todo 暂时写死
            if (row.brand) return [{ value: 'EZVIZ', label: '萤石' }].find(j => j.value === row.brand).label
            else return ''
          }
        }, {
          label: '序列号',
          prop: 'deviceSerial'
        }, {
          label: '验证码',
          prop: 'validateCode'
        }
      ]
    }
  },
  // watch: {
  //   form: {
  //     handler(v) {
  //       if (v) {
  //         this.formData = v
  //       }
  //     }
  //   }
  // },
  mounted () {
    // this.init()
  },
  methods: {
    init (params = this.searchForm) {
      queryCameraList(params).then(res => {
        // console.log('cameraList', res)
        this.tableData = res.data
      })
    },
    search () {
      this.searchForm.cameraName = this.getValueByProp('cameraName', this.formData) || null
      this.searchForm.pageNum = 1
      this.init()
    },
    reset () {
      this.searchForm = {
        cameraName: null,
        pageNum: 1,
        pageSize: 10
      }
      this.init()
    },
    handleCurrentChange (val) {
      this.searchForm.pageNum = val
      this.init()
    },
    handleSizeChange (val) {
      this.searchForm.pageNum = 1
      this.searchForm.pageSize = val
      this.init()
    },
    handleEdit (row) {
      this.type = 'edit'
      if (row.cameraId) this.cameraId = row.cameraId
      this.showDrawer = true
    },
    handleAdd () {
      this.type = 'add'
      this.showPop = true
    },
    handleDetail (row) {
      this.type = 'detail'
      this.cameraId = row.cameraId
      this.showDrawer = true
    },
    handleDelete (row) {
      const cameraId = row.cameraId
      removeCamera(cameraId).then(() => {
        this.$message.success('删除成功')
        this.init()
      })
    },
    gotoClassroomAuthorize () {
      this.$router.push({ name: 'classroomAuthorize' })
    },
    gotoChildClassroomAuthorize () {
      this.$router.push({ name: 'childClassroomAuthorize' })
    },
    gotoWorderAuthorize () {
      this.$router.push({ name: 'workerAuthorize' })
    },
    popConfirm () {
      let ref, fn, msg
      if (this.type === 'add') {
        ref = 'addForm'
        fn = createCamera
        msg = '新增成功'
      } else {
        ref = 'editFrom'
        fn = updateCamera
        msg = '修改成功'
      }
      // console.log('this.refs', this, this.$refs)
      this.$refs[ref].$refs.form.$children[0].validate(valid => {
        if (valid) {
          const formData = this.$refs[ref].form
          fn(formData).then(() => {
            this.$message.success(msg)
            this.type = ''
            this.showDrawer = false
            this.showPop = false
            this.init()
          })
        }
      })
    },
    popClose () {
      this.type = ''
      this.showPop = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
