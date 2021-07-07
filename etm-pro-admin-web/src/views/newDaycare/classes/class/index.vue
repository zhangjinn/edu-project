<template>
  <div class="class-wrap">

    <etm-table-page :data="tableData" :columns="columns" @currentChange="currentChange">
      <etm-table-tool-bar slot="tool">
        <div slot="right">
          <el-button v-has="{authId : 'daycare.room.create'}" type="primary" @click="classOpen"><i class="el-icon-plus" />&nbsp;&nbsp;新增教室
          </el-button>
        </div>
        <!--        <el-button slot="right" type="primary">新增推荐场地</el-button>-->

      </etm-table-tool-bar>

      <el-table-column slot="left" label="教室名称" width="120">
        <template slot-scope="scoped">
          <el-button type="text" @click="editClassOpen(scoped.row.roomId)">{{ scoped.row.roomName }}</el-button>
        </template>
      </el-table-column>

      <el-table-column slot="right" label="操作" width="120">
        <template slot-scope="scoped">
          <etm-text v-has="{authId : 'daycare.room.update'}" type="primary" @click="editClassOpen(scoped.row.roomId, true)">编辑</etm-text>
          <etm-text v-has="{authId : 'daycare.room.remove'}" type="danger" @click="delectClass(scoped.row.roomId)">删除</etm-text>
        </template>
      </el-table-column>
    </etm-table-page>

    <!--    弹框-->
    <etm-pop
      :visible="isClassHidden"
      title="添加教室"
      pop="complex"
      cancel-btn="取消"
      @cancel="classCancel"
      @close="classCancel"
      @confirm="classConfirm"
    >
      <edit ref="addClassRoom" v-model="addClassInfo" />
    </etm-pop>

    <!--    侧边栏-->
    <etm-drawer type="small" :visible.sync="isEditClass">
      <etm-layout-split>
        <etm-title :show-line="false" border size="big">
          编辑教室
          <template slot="tool">
            <template v-if="isEdit">
              <el-button size="mini" plain @click="cancelDrawer">取消</el-button>
              <el-button size="mini" type="primary" @click="updateClass">保存</el-button>
            </template>
            <template v-else>
              <el-button v-has="{authId : 'daycare.room.update'}" size="mini" plain @click="isEdit = true">编辑</el-button>
            </template>
          </template>
        </etm-title>

        <template v-if="isEdit">
          <edit ref="editClassRoom" :data="classdetail" />
        </template>
        <template v-else>

          <div class="banner">
            <el-carousel v-if="classdetail.resultImg && classdetail.resultImg.length" height="200px">
              <el-carousel-item
                v-for="(item, index) in classdetail.resultImg"
                :key="index"
              >
                <el-image :src="item.url" fit="contain">
                  <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
              </el-carousel-item>
            </el-carousel>
            <div v-else class="defaultImg">
              <img :src="defaultImg">
            </div>
          </div>

          <etm-title :show-line="false" border>
            {{ classdetail.roomName }}
          </etm-title>
          <div class="classContent">{{ classdetail.remarks }}</div>

          <etm-title :show-line="false" border>
            教室信息
          </etm-title>
          <div>
            {{ classdetail.details }}
          </div>
        </template>
      </etm-layout-split>
    </etm-drawer>
  </div>

</template>

<script>

import Edit from './components/edit'

/**
 * class create by Administrator
 * createTime 2020/8/31 9:27
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { createClassRoom, queryClass, queryClassRoom, removeClass, updateClasses } from '@/api/newDaycare/classroom'
// import { createClasses } from '@/api/daycare/classes'
import { deepClone } from '@/views/newDaycare/contract/common'

export default {
  name: 'Class',
  components: { Edit },
  filters: {},
  mixins: [baseMixin],
  props: {
    search: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isEditClass: false, // 侧边栏开关
      isEdit: false, // 侧边栏是否编辑
      isClassHidden: false, // 弹框开关
      activeName: 'class',

      addClassInfo: {
        roomName: '',
        remarks: '',
        details: '',
        enable: true,
        imageList: [],
        previewSrcKey: [],
        resultImg: []
      },
      classdetail: {}, // 详情数据
      choiceId: 0, // 选中的班级id
      tableData: {
        content: []
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      // <el-table-column slot="left" label="备注">
      //   <template slot-scope="scoped">
      //     {{ scoped.row.remarks }}
      //   </template>
      // </el-table-column>
      //
      // <el-table-column slot="right" label="状态" width="120">
      //   <template slot-scope="scoped">
      //     {{scoped.row.enable}}
      //     {{ scoped.row.enable ? '开启' : '关闭' }}
      //   </template>
      // </el-table-column>
      columns: [
        {
          prop: 'remarks',
          label: '备注'
        }, {
          label: '状态',
          prop: 'enable',
          width: '120'
        }
      ],
      formData: [
        {
          label: '教师名称',
          type: 'input'
        }, {
          label: '使用班级',
          type: 'input'
        }, {
          label: '教师容量',
          type: 'select',
          value: 10,
          options: [
            {
              label: '10',
              value: 10
            }, {
              label: '20',
              value: 20
            }
          ]
        }
      ],
      defaultImg: require('@/assets/images/daycare/img-jsxq.png')
    }
  },
  computed: {},
  watch: {
    search(n, o) {
      // if (Object.keys(n).length) {
      this.pageInfo.pageNum = 1
      this.init(n)
      // }
    }
  },
  created() {
    this.init(this.search)
  },

  mounted() {
  },
  methods: {
    classCancel() {
      this.isClassHidden = false
      this.addClassInfo = {
        roomName: '',
        remarks: '',
        details: '',
        enable: true,
        imageList: [],
        previewSrcKey: [],
        resultImg: []
      }
      this.$refs['addClassRoom'].$refs.form.$children[0].resetFields()
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum, pageSize,
        paged: true
      }
      this.init(this.search)
    },
    init(search) {
      const _params = Object.assign({
        childName: ''
      }, search, this.pageInfo)

      queryClassRoom(_params).then(res => {
        this.tableData = res.data
        this.tableData['content'] = res.data['content'].map(cur => {
          cur.enable = cur.enable ? '开启' : '关闭'
          return cur
        })
      })
    },
    editClassCallback() {
      this.isEditClass = false
    },
    editClassOpen(id, edit = false) {
      this.choiceId = id
      this.isEdit = edit
      this.isEditClass = true

      queryClass(id).then(res => {
        this.classdetail = this.calcImg(res)
      })
    },
    calcImg(res) {
      const _res = deepClone(res.data)
      const resultImg = _res.imageList

      const imageList = []
      const previewSrcKey = []

      _res.imageList.forEach(cur => {
        imageList.push(cur.url)
        previewSrcKey.push(cur.name)
      })

      _res.resultImg = resultImg
      _res.imageList = imageList
      _res.previewSrcKey = previewSrcKey

      return _res
    },
    classOpen() {
      this.isClassHidden = true
    },
    classConfirm() {
      this.$refs['addClassRoom'].$refs.form.$children[0].validate(valid => {
        if (valid) {
          const result = deepClone(this.addClassInfo)

          result.imageList = result.resultImg

          createClassRoom(result).then(res => {
            this.classCancel()
            this.init(this.search)
            this.$message.success('教室添加成功')
          })
        }
      })
    },
    delectClass(id) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除教室？',
        content: '将清除从此时起所有与本教室有关的排课数据',
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          removeClass(id).then(res => {
            this.init(this.search)
            this.$etmTip.close()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    cancelDrawer() {
      const cacheData = this.$refs['editClassRoom'].rollback()
      this.classdetail = cacheData

      this.$set(this, 'classdetail', cacheData)
      this.isEdit = false
    },
    updateClass() {
      this.$refs['editClassRoom'].$refs.form.$children[0].validate(valid => {
        if (valid) {
          const queryParams = {}

          const _form = deepClone(this.classdetail)
          _form.imageList = _form.resultImg

          Object.keys(_form).forEach(cur => {
            if (_form[cur]) {
              queryParams[cur] = _form[cur]
            }
          })

          console.log(queryParams)
          updateClasses(queryParams).then(res => {
            this.isEdit = false

            queryClass(this.choiceId).then(res => {
              // const resultImg = deepClone(res.data.imageList)
              //
              // const imageList = []
              // const previewSrcKey = []
              //
              // res.data.imageList.forEach(cur => {
              //   imageList.push(cur.url)
              //   previewSrcKey.push(cur.name)
              // })
              //
              // res.data.resultImg = resultImg
              // res.data.imageList = imageList
              // res.data.previewSrcKey = previewSrcKey
              //
              this.classdetail = this.calcImg(res)

              this.init(this.search)
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.class-wrap {
  ::v-deep .el-image {
    height: 200px;
  }

  .classContent {
    margin-bottom: 16px;
  }

  .banner {
    margin-bottom: 16px;
    height: 200px;
  }

  .defaultImg {
    margin-bottom: 16px;
    padding-top: 24px;
    height: 200px;
    text-align: center;
    @include bgc_hover_color();
  }
}
</style>
