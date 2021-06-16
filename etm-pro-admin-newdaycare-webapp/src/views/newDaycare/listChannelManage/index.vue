<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            v-model="activateName"
            setting
            setting-text="应用设置"
            @setting="$router.push({name: 'channelSettings'})"
          >
            <el-tab-pane
              label="渠道管理"
              name="channel"
            >
              <etm-tool-bar
                v-model="formData"
                @search="handleSearch"
                @reset="handleReset"
              >
                <el-form-item label="城市:">
                  <etm-address
                    ref="addressRef"
                    :show-area="false"
                    @provinceChange="provinceCode = $event"
                    @cityChange="cityCode = $event"
                  />
                </el-form-item>
              </etm-tool-bar>
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            :columns="columns"
            :data="tableData"
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <template slot="right">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="showAddPopup"
                >
                  添加渠道
                </el-button>
              </template>
            </etm-table-tool-bar>
            <template slot="left">
              <el-table-column
                label="渠道名称"
                prop="channelName"
              >
                <template slot-scope="{row}">
                  <etm-text @click="channelName(row)">
                    {{ row.channelName }}
                  </etm-text>
                </template>
              </el-table-column>
            </template>
            <template slot="right">
              <el-table-column
                label="操作"
                prop="operate"
              >
                <template slot-scope="{row}">
                  <etm-text @click="handleEdit(row)">
                    编辑
                  </etm-text>
                  <etm-text
                    type="danger"
                    @click="handleDelete(row)"
                  >
                    删除
                  </etm-text>
                </template>
              </el-table-column>
            </template>
          </etm-table-page>
        </div>
      </etm-layout-split>

      <!--      抽屉-->
      <etm-drawer
        :visible.sync="showSide"
        type="small"
        :before-close="drawerBeforeClose"
      >
        <etm-layout-split>
          <etm-title
            size="big"
            :show-line="false"
            border
            title="编辑渠道"
          >
            <template slot="tool">
              <template v-if="isEdit">
                <div class="operate">
                  <el-button
                    size="mini"
                    @click="cancelSide"
                  >
                    取消
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="submitSideChannel('update')"
                  >
                    保存
                  </el-button>
                </div>
              </template>
              <template v-else>
                <div class="operate">
                  <el-button
                    size="mini"
                    @click="handleEdit"
                  >
                    编辑
                  </el-button>
                </div>
              </template>
            </template>
          </etm-title>
          <div class="content">
            <template v-if="isEdit">
              <etm-form
                ref="sideFormRef"
                type="dialog"
                :model="sideFormData"
                :rules="sideFormRules"
              >
                <el-form-item
                  label="渠道名称"
                  prop="channelName"
                >
                  <el-input
                    v-model="sideFormData.channelName"
                    placeholder="请输入名称"
                  />
                </el-form-item>
                <el-form-item
                  label="渠道类型"
                  prop="channelTypeId"
                >
                  <el-select
                    v-model="sideFormData.channelTypeId"
                    placeholder="请选择渠道类型"
                  >
                    <el-option
                      v-for="item in sideChannelTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="渠道联系人"
                  prop="channelPeople"
                >
                  <el-input
                    v-model="sideFormData.channelPeople"
                    placeholder="请输入渠道联系人"
                  />
                </el-form-item>
                <el-form-item
                  label="渠道负责人"
                  prop="employeeId"
                >
                  <el-select
                    v-model="sideFormData.employeeId"
                    placeholder="请选择渠道负责人"
                  >
                    <el-option
                      v-for="item in sideChannelManageOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="渠道联系人电话"
                  prop="telephone"
                >
                  <el-input
                    v-model="sideFormData.telephone"
                    placeholder="请输入渠道联系人电话"
                    maxlength="11"
                  />
                </el-form-item>
                <el-form-item label="所在城市">
                  <etm-address
                    :show-area="false"
                    :province-id="sideFormData.provinceCode"
                    :city-id="sideFormData.cityCode"
                    @provinceChange="sideFormData.provinceCode = $event"
                    @cityChange="sideFormData.cityCode = $event"
                  />
                </el-form-item>
                <el-form-item
                  label="备注"
                  prop="mark"
                >
                  <el-input
                    v-model="sideFormData.remark"
                    type="textarea"
                    :rows="4"
                    maxlength="200"
                    show-word-limit
                    placeholder="请输入备注内容"
                  />
                </el-form-item>
              </etm-form>
            </template>
            <template v-else>
              <etm-field-label
                type="left"
                label="渠道名称"
              >
                {{ sideFormData.channelName }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="渠道类型"
              >
                {{ sideFormData.channelTypeName }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="渠道联系人"
              >
                {{ sideFormData.channelPeople }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="渠道负责人"
              >
                {{ sideFormData.employeeName }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="渠道联系人电话"
              >
                {{ sideFormData.telephone }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="所在城市"
              >
                {{ sideFormData.siteName }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="备注"
              >
                {{ sideFormData.remark }}
              </etm-field-label>
            </template>
          </div>
        </etm-layout-split>
      </etm-drawer>

      <!--      弹窗-->
      <etm-pop
        :visible="showPop"
        pop="complex"
        title="添加渠道"
        confirm-btn="确定"
        cancel-btn="取消"
        @open="showPop = true"
        @close="sideResetData"
        @confirm="submitSideChannel('create')"
        @cancel="showPop = false"
      >
        <template v-if="showPop">
          <etm-form
            ref="sideFormRef"
            type="dialog"
            :model="sideFormData"
            :rules="sideFormRules"
          >
            <el-form-item
              label="渠道名称"
              prop="channelName"
            >
              <el-input
                ref="first"
                v-model="sideFormData.channelName"
                placeholder="请输入名称"
              />
            </el-form-item>
            <el-form-item
              label="渠道类型"
              prop="channelTypeId"
            >
              <el-select
                v-model="sideFormData.channelTypeId"
                placeholder="请选择渠道类型"
              >
                <el-option
                  v-for="item in sideChannelTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="渠道联系人"
              prop="channelPeople"
            >
              <el-input
                v-model="sideFormData.channelPeople"
                placeholder="请输入渠道联系人"
              />
            </el-form-item>
            <el-form-item
              label="渠道负责人"
              prop="employeeId"
            >
              <el-select
                v-model="sideFormData.employeeId"
                placeholder="请选择渠道负责人"
              >
                <el-option
                  v-for="item in sideChannelManageOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="渠道联系人电话"
              prop="telephone"
            >
              <el-input
                v-model="sideFormData.telephone"
                placeholder="请输入渠道联系人电话"
                maxlength="11"
              />
            </el-form-item>
            <el-form-item label="所在城市">
              <etm-address
                :show-area="false"
                :province-id="sideFormData.provinceCode"
                :city-id="sideFormData.cityCode"
                @provinceChange="sideFormData.provinceCode = $event"
                @cityChange="sideFormData.cityCode = $event"
              />
            </el-form-item>
            <el-form-item
              label="备注"
              prop="mark"
            >
              <el-input
                v-model="sideFormData.remark"
                type="textarea"
                :rows="4"
                maxlength="200"
                show-word-limit
                placeholder="请输入备注内容"
              />
            </el-form-item>
          </etm-form>
        </template>
      </etm-pop>
    </etm-main-body>
  </div>
</template>

<script>
/**
   * index create by 油麦菜
   * createTime 2021/1/28 10:00
   */
import EtmAddress from '@/views/newDaycare/listChannelManage/components/EtmAddress'
import baseMixin from '@/layout/mixin/baseMixin'
import formValidate from '@/utils/rules'
import {
  queryChannelList,
  queryChannelTypeList,
  createChannel,
  queryChannel,
  updateChannel,
  removeChannel,
  queryEmployeeList,
  queryAreaByCode
} from '@/api/newDaycare/listChannelManage'

export default {
  name: 'Index',
  components: {
    EtmAddress
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activateName: 'channel',
      formData: [
        {
          type: 'select',
          label: '渠道类型',
          value: '',
          prop: 'channelTypeId',
          options: [
            {
              label: '全部类型',
              value: ''
            }
          ],
          props: {
            placeholder: '请选择渠道类型'
          }
        },
        {
          type: 'input',
          label: '渠道名称',
          value: '',
          prop: 'name',
          props: {
            placeholder: '请输入渠道名称'
          }
        }
      ],
      columns: [
        {
          prop: 'siteName',
          label: '所在城市'
        },
        {
          prop: 'channelTypeName',
          label: '渠道类型'
        },
        {
          prop: 'employeeName',
          label: '渠道负责人'
        },
        {
          prop: 'channelPeople',
          label: '渠道联系人'
        },
        {
          prop: 'telephone',
          label: '渠道联系人电话'
        },
        {
          prop: 'remark',
          label: '备注',
          showOverflowTooltip: true
        }
      ],
      tableData: {
        content: []
      },
      cityCode: null,
      provinceCode: null,
      sideFormData: {
        channelName: undefined,
        channelTypeId: undefined,
        channelTypeName: undefined,
        employeeId: undefined,
        employeeName: undefined,
        channelPeople: undefined,
        telephone: '',
        provinceCode: undefined,
        cityCode: undefined,
        remark: undefined,
        siteName: undefined
      },
      sideChannelTypeOptions: [],
      sideChannelManageOptions: [],
      sideFormRules: {
        channelName: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
        channelPeople: [{ required: true, message: '请输入渠道联系人', trigger: 'blur' }],
        channelTypeId: [{ required: true, message: '请选择渠道类型', trigger: 'change' }],
        telephone: [
          formValidate.phoneRule()
        ]
      },
      showSide: false,
      isEdit: false,
      showPop: false,
      channelId: null,
      drawerPath: false
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init (search = {}) {
      queryEmployeeList({ paged: false }).then(res => {
        this.sideChannelManageOptions = res.data.content.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
      })
      queryChannelTypeList().then(res => {
        this.sideChannelTypeOptions = this.formData[0].options = res.data.map(item => {
          item.label = item.channelTypeName
          item.value = item.channelTypeId
          return item
        })
      })
      const obj = Object.assign({}, search, this.pageInfo)
      queryChannelList(obj).then(res => {
        res.data.content.forEach(item => {
          item.siteName = item.siteName.replace(/null/g, '')
        })
        this.tableData = res.data
      })
    },
    handleSearch () {
      this.init(this.getFormData())
    },
    handleReset () {
      this.$refs.addressRef.resetData()
      this.provinceCode = null
      this.cityCode = null
    },
    getFormData () {
      return {
        channelTypeId: this.getObjectByProp('channelTypeId', this.formData).value,
        name: this.getObjectByProp('name', this.formData).value,
        provinceCode: this.provinceCode,
        cityCode: this.cityCode
      }
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.handleSearch()
    },
    channelName (row) {
      let data = null
      queryChannel({ channelId: row.channelId }).then(async res => {
        data = res.data
        const code = res.data.cityCode || res.data.provinceCode
        if (code) {
          await queryAreaByCode({ code }).then(r => {
            res.data.siteName = `${r.data.provinceName || ''}${r.data.cityName || ''}`
            data = res.data
          })
        }
        this.sideFormData = data
        this.channelId = row.channelId
        this.showSide = true
      })
    },
    handleEdit (row) {
      this.sideResetData()
      this.channelId = row.channelId || this.channelId
      this.channelName({ channelId: this.channelId })
      this.isEdit = this.showSide = true
      if (row.channelId) {
        this.drawerPath = true
      }
    },
    handleDelete (row) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认删除吗？',
        content: '',
        cancelBtn: '取消',
        confirm: () => {
          removeChannel({ channelId: row.channelId }).then(_ => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.init()
          })
          this.$etmTip.close()
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    submitSideChannel (param) {
      const ref = this.$refs.sideFormRef.$children[0]
      ref.validate(async valid => {
        if (!valid) {
          return ''
        }
        if (param === 'create') {
          await createChannel(this.sideFormData).then(_ => {
            this.$message({
              type: 'success',
              message: '新增渠道成功'
            })
          })
        } else {
          await updateChannel(this.sideFormData).then(_ => {
            this.$message({
              type: 'success',
              message: '更新渠道成功'
            })
            this.channelName({ channelId: this.channelId })
          })
        }
        this.isEdit = false
        this.showPop = false
        this.init()
      })
    },
    sideResetData () {
      this.isEdit = false
      this.showPop = false
      this.sideFormData = {
        channelName: undefined,
        channelTypeId: undefined,
        channelTypeName: undefined,
        employeeId: undefined,
        employeeName: undefined,
        sideFormData: undefined,
        telephone: '',
        provinceCode: undefined,
        cityCode: undefined,
        remark: undefined,
        siteName: undefined
      }
    },
    cancelSide () {
      if (this.drawerPath) {
        this.drawerBeforeClose()
        return
      }
      this.sideResetData()
      this.channelName({ channelId: this.channelId })
    },
    drawerBeforeClose () {
      this.sideResetData()
      this.showSide = false
    },
    showAddPopup () {
      this.showPop = true
      this.$nextTick(() => {
        this.$refs.first.focus()
      })
    }
  }
}
</script>
<style lang="scss" scoped>

  .operate {
    display: flex;

    .el-button:first-child {
      margin-right: 5px;
    }
  }
</style>
