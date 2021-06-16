<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs
            v-model="activateName"
            setting
            setting-text="家长端设置"
            @setting="$router.push({name: 'cm_setting'})"
          >
            <el-tab-pane
              label="交代事宜"
              name="matterList"
            >
              <etm-tool-bar
                v-model="formData"
                @search="handleSearch"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            :stripe="false"
            :border="false"
            :columns="columns"
            :data="tableData"
            @currentChange="currentChange"
          >
            <template slot="left">
              <el-table-column
                label="头像"
                prop="avatar"
              >
                <template slot-scope="{row}">
                  <div class="avatar">
                    <img
                      v-if="row.avatar"
                      :src="row.avatar"
                      alt=""
                    >
                    <!--                    <img v-else :src="morenAvatar" alt="">-->
                    <span class="iconfont iconmorentouxiang" />
                  </div>
                </template>
              </el-table-column>
            </template>
            <template slot="right">
              <el-table-column
                label="图片"
                prop="images"
              >
                <template slot-scope="{row}">
                  <etm-text
                    v-if="row.image.length"
                    @click="handleShowImg(row)"
                  >
                    查看图片
                  </etm-text>
                  <div v-else>
                    --
                  </div>
                </template>
              </el-table-column>
            </template>
            <template slot="right">
              <el-table-column
                label="交代人"
                prop="tellName"
              >
                <template slot-scope="{row}">
                  <span>{{ row.tellName }}({{ row.parentsCall }})</span>
                </template>
              </el-table-column>
            </template>
            <template slot="right">
              <el-table-column
                show-overflow-tooltip
                label="交代时间"
                prop="tellTime"
              />
            </template>
            <template slot="right">
              <el-table-column
                label="确认老师"
                prop="employeeName"
              />
            </template>
            <template slot="right">
              <el-table-column
                show-overflow-tooltip
                label="确认时间"
                prop="confirmTime"
              />
            </template>
            <template slot="right">
              <el-table-column
                label="状态"
                prop="tellState"
              >
                <template slot-scope="scope">
                  <etm-status :type="setStatus(scope)">
                    {{ scope.row.tellState }}
                  </etm-status>
                </template>
              </el-table-column>
            </template>
            <template slot="right">
              <el-table-column
                label="操作"
                prop="operate"
              >
                <template slot-scope="{row}">
                  <template v-if="row.tellState === '待确认'">
                    <etm-text @click="handleConfirm(row)">
                      确认
                    </etm-text>
                  </template>
                </template>
              </el-table-column>
            </template>
          </etm-table-page>
        </div>
        <div
          v-if="src"
          class="preview"
        >
          <el-image
            ref="elImageRef"
            :src="src"
            :preview-src-list="srcList"
          />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
/**
   * index create by 油麦菜
   * createTime 2021/1/15 15:16
   */
import baseMixin from '@/layout/mixin/baseMixin'
import {
  updateMatterListStatus,
  queryMatterList
} from '@/api/newDaycare/matterList'
import { parseTime } from '@/utils'

export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      activateName: 'matterList',
      formData: [
        {
          type: 'input',
          label: '班级',
          value: '',
          prop: 'clazzName',
          props: {
            placeholder: '请输入班级'
          }
        },
        {
          type: 'date',
          label: '交代日期',
          value: '',
          prop: 'submitTime',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月',
            'picker-options': {
              disabledDate (time) {
                return time.getTime() > Date.now()
              }
            }
          }
        },
        {
          type: 'select',
          label: '状态',
          value: '',
          prop: 'tellState',
          options: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '已确认',
              value: 'B_DETERMINE'
            },
            {
              label: '待确认',
              value: 'C_TO_BE_SIGNED'
            },
            {
              label: '已撤销',
              value: 'A_REVOKED'
            }
          ],
          props: {
            placeholder: '请选择状态'
          }
        },
        {
          type: 'input',
          label: '宝宝姓名',
          value: '',
          prop: 'childName',
          props: {
            placeholder: '请输入宝宝姓名'
          }
        },
        {
          type: 'date',
          label: '确认日期',
          value: '',
          prop: 'confirmTime',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月',
            endPlaceholder: '年/月'
          }
        }
      ],
      columns: [
        {
          prop: 'childName',
          label: '宝宝姓名'
        },
        {
          prop: 'clazzName',
          label: '班级'
        },
        {
          prop: 'gender',
          label: '性别'
        },
        {
          prop: 'tellType',
          label: '交代类型'
        },
        {
          prop: 'tellContent',
          label: '交代内容',
          showOverflowTooltip: true
        }
      ],
      tableData: {
        content: []
      },
      src: '',
      srcList: [],
      morenAvatar: require('@/assets/images/moren.png')
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
      const obj = Object.assign({}, search, this.pageInfo)
      queryMatterList(obj).then(res => {
        res.data.content.forEach(item => {
          item.tellType = item.tellType.map(type => this.getMatterType(type))
          item.tellState = this.getMatterStatus(item.tellState)
          item.tellTime = item.tellTime && parseTime(item.tellTime, '')
          item.confirmTime = item.confirmTime && parseTime(item.confirmTime, '')
        })
        this.tableData = res.data
      })
    },
    setStatus (scope) {
      const status = scope.row.tellState
      switch (status) {
        case '待确认':
          return 'primary'
        case '已确定':
          return 'active'
        case '已撤销':
          return 'inactive'
      }
    },
    getMatterType (type) {
      switch (type) {
        case 'MEDICINE':
          return '吃药'
        case 'WATER':
          return '喝水'
        case 'DRESSING':
          return '穿衣'
        case 'MODD':
          return '情绪'
        case 'MEAL':
          return '特殊餐'
        case 'OTHER':
          return '其他'
      }
    },
    getMatterStatus (status) {
      switch (status) {
        case 'C_TO_BE_SIGNED':
          return '待确认'
        case 'B_DETERMINE':
          return '已确定'
        case 'A_REVOKED':
          return '已撤销'
      }
    },
    handleSearch () {
      this.init(this.getFormData())
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.handleSearch()
    },
    getFormData () {
      const submitTime = this.getObjectByProp('submitTime', this.formData).value || []
      const [explainBeginTime, explainEndTime] = [...submitTime]
      const confirmTime = this.getObjectByProp('submitTime', this.formData).value || []
      const [defineBeginTime, defineEndTime] = [...confirmTime]
      const obj = {
        clazzName: this.getObjectByProp('clazzName', this.formData).value,
        tellState: this.getObjectByProp('tellState', this.formData).value,
        childName: this.getObjectByProp('childName', this.formData).value,
        explainBeginTime,
        explainEndTime,
        defineBeginTime,
        defineEndTime
      }
      console.log(obj)
      return obj
    },
    handleConfirm (row) {
      console.log(row)
      updateMatterListStatus({
        tellMattersId: row.tellMattersId,
        tellState: 'B_DETERMINE'
      }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.init()
      })
    },
    handleShowImg (row) {
      this.src = ''
      this.srcList = []

      setTimeout(_ => {
        this.srcList = row.image.map(item => item.url)
        this.src = this.srcList[0]

        this.$nextTick(_ => {
          this.$refs.elImageRef.clickHandler()
        })
      }, 100)
    }
  }
}
</script>
<style lang="scss" scoped>
  .index-wrap {
    ::v-deep .el-table__row {
      td:nth-child(1) {
        padding: 8px 0;

        .cell {
          padding-left: 17px;

          .avatar {
            align-items: center;
            border-radius: 50%;
            display: flex;
            height: 50px;
            justify-content: center;
            width: 50px;

            img {
              border-radius: 50%;
              height: 100%;
              width: 100%;
            }

            .iconmorentouxiang {
              color: #c1c4cc;
              font-size: 40px;
            }
          }
        }
      }
    }

    .preview {
      height: 100px;
      left: -9999px;
      position: absolute;
      width: 100px;
    }
  }
</style>
