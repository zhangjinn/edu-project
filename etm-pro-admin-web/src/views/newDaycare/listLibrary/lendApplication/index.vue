<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="activateName">
            <el-tab-pane label="借阅申请" name="borrowApplication">
              <etm-tool-bar v-model="borrowApplicationFormData" @search="search" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <etm-table-page
            selection
            :stripe="false"
            :border="false"
            :columns="borrowApplicationColumns"
            :data="borrowApplicationTableData"
            @selection-change="selectionChange"
            @currentChange="currentChange"
          >
            <etm-table-tool-bar slot="tool">
              <div slot="right">
                <el-button :disabled="!selectTableValue.length" plain @click="batchConfirm">批量确认</el-button>
              </div>
            </etm-table-tool-bar>
            <template slot="left">
              <el-table-column
                prop="bookName"
                label="名称"
                width="200px"
                fixed
                show-overflow-tooltip
              >
                <template slot-scope="{ row }">
                  <div class="book-name">
                    <div class="img-left" @click="lookLibraryDetail(row.bookManageId)">
                      <img v-if="row.cover[0].url" :src="row.cover[0].url" alt="">
                      <img v-else :src="bookDefaultCover" alt="">
                    </div>
                    <div class="info-right">
                      <etm-text type="primary" @click="lookLibraryDetail(row.bookManageId)">{{ row.bookManageName }}</etm-text>
                      <div class="author">{{ row.author }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </template>
            <el-table-column
              prop="bookTypeName"
              label="图书分类"
              fixed
            />
            <el-table-column
              prop="childName"
              label="学员名称"
              fixed
            >
              <template slot-scope="{ row }">
                <etm-text type="primary" @click="borrowDetailDrawerClick(row.bookLendingDetailsId)">{{ row.childName }}</etm-text>
              </template>
            </el-table-column>
            <template slot="right">
              <el-table-column
                prop="operate"
                label="操作"
              >
                <template slot-scope="{ row }">
                  <etm-text type="primary" @click="borrowConfirm(row)">确认</etm-text>
                </template>
              </el-table-column>
            </template>
          </etm-table-page>
        </div>

        <!-- 查询图书详情弹窗 -->
        <etm-drawer
          :visible.sync="bookDetailPop"
          :before-close="bookDetailPopBeforeClose"
        >
          <etm-layout-split>
            <div slot="default">
              <!--详情-->
              <template v-if="Object.keys(bookDetailPopData).length !== 0">
                <etm-title size="big" :show-line="false" border title="详情">
                  <!--                  <template slot="tool">-->
                  <!--                    <el-button type="primary" @click="bookDetailPopEdit">编辑</el-button>-->
                  <!--                  </template>-->
                </etm-title>
                <div class="content">
                  <div class="cover-img">
                    <div class="cover">
                      <img v-if="bookDetailPopData.cover[0].url" :src="bookDetailPopData.cover[0].url" alt="">
                      <img v-else :src="bookDefaultCover" alt="">
                    </div>
                  </div>
                  <!--                  <etm-field-label type="left" label="封面">-->
                  <!--                    <img :src="bookDetailPopData.imgSrc" alt="" style="width: 100px;height: 100px;">-->
                  <!--                  </etm-field-label>-->
                  <etm-field-label type="left" label="名称">{{ bookDetailPopData.bookManageName }}</etm-field-label>
                  <etm-field-label type="left" label="编码">{{ bookDetailPopData.coding }}</etm-field-label>
                  <etm-field-label type="left" label="类型">{{ bookDetailPopData.bookTypeName }}</etm-field-label>
                  <etm-field-label type="left" label="作者">{{ bookDetailPopData.author }}</etm-field-label>
                  <etm-field-label type="left" label="出版社">{{ bookDetailPopData.publishingHouse }}</etm-field-label>
                  <etm-field-label type="left" label="ISBN">{{ bookDetailPopData.bookNumber }}</etm-field-label>
                  <etm-field-label type="left" label="创建人">{{ bookDetailPopData.createName }}</etm-field-label>
                  <etm-field-label type="left" label="登记日期">{{ bookDetailPopData.createTime }}</etm-field-label>
                  <etm-field-label type="left" label="简介">{{ bookDetailPopData.introduction }}</etm-field-label>
                </div>
              </template>
            </div>
          </etm-layout-split>
        </etm-drawer>

        <!-- 借阅详情(点击学员姓名)侧拉窗 -->
        <etm-drawer
          :visible.sync="borrowDetailDrawer"
          :before-close="borrowDetailDrawerBeforeClose"
        >
          <etm-layout-split>
            <div slot="default">
              <!--详情-->
              <template v-if="Object.keys(borrowDetailDrawerData).length !== 0">
                <etm-title size="big" :show-line="false" border title="借阅详情" />
                <div class="content">
                  <etm-field-label type="left" :label="borrowDetailDrawerData.childName">{{ borrowDetailDrawerData.childPhone }}</etm-field-label>
                  <etm-field-label type="left" label="图书编码">{{ borrowDetailDrawerData.coding }}</etm-field-label>
                  <etm-field-label type="left" label="图书名称">{{ borrowDetailDrawerData.bookManageName }}</etm-field-label>
                  <etm-field-label type="left" label="ISBN">{{ borrowDetailDrawerData.bookNumber }}</etm-field-label>
                  <etm-field-label type="left" label="图书位置">{{ borrowDetailDrawerData.storageLocation }}</etm-field-label>
                  <etm-field-label type="left" label="借阅日期">{{ borrowDetailDrawerData.borrowingDate }}</etm-field-label>
                  <etm-field-label type="left" label="借阅时长">{{ borrowDetailDrawerData.duration }}</etm-field-label>
                  <etm-field-label type="left" label="借阅状态">{{ borrowDetailDrawerData.borrowingStatus }}</etm-field-label>
                  <etm-field-label type="left" label="到期日期">{{ borrowDetailDrawerData.dateOfExpiry }}</etm-field-label>
                  <etm-title :show-line="false" border title="其他图书" />
                  <etm-table
                    :data="borrowDetailDrawerData.bookList"
                    :columns="[
                      {
                        label: '书名',
                        prop: 'name'
                      },
                      {
                        label: '借阅日期',
                        prop: 'createDate'
                      },
                      {
                        label: '借阅状态',
                        prop: 'borrowingStatus'
                      }
                    ]"
                  />
                </div>
              </template>
            </div>
          </etm-layout-split>
        </etm-drawer>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/23 9:55
 */
import {
  queryBookLendingDetails,
  queryBorrowDetail,
  queryLibraryDetailPop,
  updateLibraryBorrowStatus
} from '@/api/newDaycare/listLibrary'
import baseMixin from '@/layout/mixin/baseMixin'
import transferDate from '@/utils/date'
export default {
  name: 'Index',
  components: {},
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      bookDefaultCover: require('@/assets/images/daycare/book-cover.png'),
      activateName: 'borrowApplication',
      borrowApplicationFormData: [
        {
          type: 'input',
          prop: 'bookManageName',
          label: '图书名称',
          value: '',
          props: {
            placeholder: '请输入图书名称'
          }
        },
        {
          type: 'input',
          prop: 'childName',
          label: '学员名称',
          value: '',
          props: {
            placeholder: '请输入学员名称'
          }
        },
        {
          type: 'date',
          prop: 'date1',
          label: '借阅日期',
          value: '',
          props: {
            type: 'daterange',
            startPlaceholder: '年/月/日',
            endPlaceholder: '年/月/日'
          }
        }
      ],
      borrowApplicationColumns: [
        {
          prop: 'childPhone',
          label: '学员电话',
          minWidth: '70'
        },
        {
          prop: 'reviewDate',
          label: '申请日期',
          minWidth: '70'
        },
        {
          prop: 'duration',
          label: '借阅时长',
          minWidth: '70'
        },
        // {
        //   prop: 'dateOfExpiry',
        //   label: '到期日期',
        //   minWidth: '70'
        // },
        {
          prop: 'borrowingStatus',
          label: '借阅状态',
          minWidth: '70'
        }
      ],
      borrowApplicationTableData: {
        content: []
      },
      bookDetailPop: false,
      bookDetailPopData: {
        // imgSrc: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2168641989,3800624395&fm=26&gp=0.jpg',
      },
      borrowDetailDrawer: false,
      borrowDetailDrawerData: {},
      selectTableValue: [],
      borrowingStatus: {
        TO_BE_CONFIRMED: '待确认',
        CONFIRMED: '已确认',
        CANCELLED: '已取消',
        RETURNED: '已归还'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init(search = {}) {
      search.bookLendStatus = 'TO_BE_CONFIRMED'
      const result = Object.assign({}, search, this.pageInfo)
      queryBookLendingDetails(result).then(res => {
        res.data.content.forEach(item => {
          const reviewDate = item.reviewDate && transferDate(item.reviewDate).fullTime
          item.reviewDate = reviewDate.substring(0, reviewDate.length - 3)
          item.borrowingStatus = this.borrowingStatus[item.borrowingStatus]
        })
        this.borrowApplicationTableData = res.data
      })
    },
    getSearchObj() {
      const dateRange = this.getObjectByProp('date1', this.borrowApplicationFormData).value
      return {
        reviewStartDate: dateRange && dateRange[0] + ' 00:00:00' || null,
        reviewEndDate: dateRange && dateRange[1] + ' 23:59:59' || null,
        bookManageName: this.getObjectByProp('bookManageName', this.borrowApplicationFormData).value,
        childName: this.getObjectByProp('childName', this.borrowApplicationFormData).value
      }
    },
    search() {
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10
      }
      this.init(this.getSearchObj())
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init(this.getSearchObj())
    },
    borrowConfirm(row) {
      this.$etmTip.init({
        type: 'warn',
        title: `同意${row.childName}借阅《${row.bookManageName}》`,
        content: ``,
        confirmBtn: '确认',
        cancelBtn: '取消',
        confirm: () => {
          updateLibraryBorrowStatus({ id: [row.bookLendingDetailsId] }).then(res => {
            this.$message({
              type: 'success',
              message: '同意借阅成功'
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
    batchConfirm() {
      this.$etmTip.init({
        type: 'warn',
        title: `确认需要确认${this.selectTableValue.length}个借阅申请?`,
        content: '',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          updateLibraryBorrowStatus({
            id: this.selectTableValue.map(item => item.bookLendingDetailsId)
          }).then(res => {
            this.$message({
              type: 'success',
              message: '批量确认操作成功'
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
    lookLibraryDetail(bookManageId) {
      queryLibraryDetailPop({ bookManageId }).then(res => {
        res.data.createTime = transferDate(res.data.createTime).time
        this.bookDetailPopData = res.data
        this.bookDetailPop = true
      })
    },
    bookDetailPopBeforeClose(done) {
      this.bookDetailPopData = {}
      done()
    },
    borrowDetailDrawerClick(bookLendingDetailsId) {
      queryBorrowDetail({ bookLendingDetailsId }).then(res => {
        res.data.borrowingDate = res.data.borrowingDate && transferDate(res.data.borrowingDate).time
        res.data.dateOfExpiry = res.data.dateOfExpiry && transferDate(res.data.dateOfExpiry).time
        res.data.borrowingStatus = this.borrowingStatus[res.data.borrowingStatus]
        const bookList = []
        res.data.bookList.forEach(item => {
          if (item.borrowingStatus === 'CONFIRMED') {
            item.borrowingStatus = this.borrowingStatus[item.borrowingStatus]
            item.createDate = item.createDate && transferDate(item.createDate).time
            bookList.push(item)
          }
        })
        this.borrowDetailDrawerData = res.data
        this.borrowDetailDrawerData.bookList = bookList
        this.borrowDetailDrawer = true
      })
    },
    borrowDetailDrawerBeforeClose() {
      // 初始化数据
      this.borrowDetailDrawerData = {}
      this.borrowDetailDrawer = false
    },
    selectionChange(val) {
      this.selectTableValue = val
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  /deep/.el-table__row {
    td:nth-child(2) {
      padding: 17px 0;
      .cell {
        padding-left: 17px;
      }
      .book-name {
        display: flex;
        .img-left {
          margin-right: 17px;
          //width: 126px;
          height: 70px;
          flex-shrink: 0;
          //text-align: center;
          //background: #FFFFFF;
          //border: 1px solid #E0E0E0;
          border-radius: 2px;
          img {
            width: 51px;
            height: 68px;
            object-fit: cover;
          }
        }
        .info-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .author {
            text-align: start;
            color: #999999;
          }
        }
      }
    }
  }

  .EtmForm-wrap /deep/ .el-form .el-form-item .el-form-item__content {
    .cover-img {
      position: relative;
      width: 100px;
      height: 100px;
      &:hover {
        .translate-cover {
          display: block;
        }
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .translate-cover {
        display: none;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        color: #fff;
        text-align: center;
        line-height: 16px;
        background: #555555;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .upload-cover {
      position: relative;
      width: 80px;
      height: 80px;
      background: #FAFAFA;
      border: 1px solid #E0E0E0;
      border-radius: 2px;
      //width: 80px;
      //height: 80px;
      line-height: 80px;
      text-align: center;
      //border: 1px dashed;
      .el-icon-plus {
        font-size: 25px;
      }
      .tip-box {
        position: absolute;
        bottom: -30px;
        right: -146px;
        .el-icon-warning-outline {
          font-size: 16px;
          //&:hover {
          //  .tip-txt {
          //    visibility: visible;
          //  }
          //  color: #f00;
          //}
        }
        .tip-txt {
          //visibility: hidden;
        }
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .auto-generate {
      /deep/.el-checkbox {
        position: absolute;
        top: 0;
        right: -100px;
      }
    }

  }

  .content {
    .cover-img {
      margin-bottom: 16px;
      width: 100%;
      height: 136px;
      //border: 1px solid #E0E0E0;
      .cover {
        width: 102px;
        height: 100%;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
