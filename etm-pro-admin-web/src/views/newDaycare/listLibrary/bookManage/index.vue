<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="activateName" setting @setting="setting">
            <el-tab-pane label="图书管理" name="libraryManage">
              <etm-tool-bar v-model="libraryManageFormData" @search="search" />
            </el-tab-pane>
            <el-tab-pane label="库存明细" name="storeDetail">
              <etm-tool-bar v-model="storeDetailFormData" @search="search" />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <template v-if="activateName === 'libraryManage'">
            <etm-table-page
              selection
              :stripe="false"
              :border="false"
              :columns="libraryManageColumns"
              :data="libraryManageTableData"
              @currentChange="currentChange"
            >
              <etm-table-tool-bar slot="tool">
                <div slot="right">
                  <el-button type="primary" icon="el-icon-plus" @click="addBookPop = true">添加图书</el-button>
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
                      <div class="img-left" @click="bookDetail(row.bookManageId)">
                        <img v-if="row.cover[0].url" :src="row.cover[0].url" alt="">
                        <img v-else :src="bookDefaultCover" alt="">
                      </div>
                      <div class="info-right">
                        <etm-text type="primary" @click="bookDetail(row.bookManageId)">{{ row.bookManageName }}</etm-text>
                        <div class="author">{{ row.author }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </template>
              <template slot="right">
                <el-table-column
                  prop="operate"
                  label="操作"
                >
                  <template slot-scope="{ row }">
                    <etm-text type="primary" @click="editOperate(row.bookManageId)">编辑</etm-text>
                    <etm-text type="primary" @click="storeOperate(row.bookManageId)">入库</etm-text>
                    <etm-text type="danger" @click="deleteOperate(row.bookManageId)">删除</etm-text>
                  </template>
                </el-table-column>
              </template>
            </etm-table-page>
          </template>
          <template v-else>
            <etm-table-page
              selection
              :stripe="false"
              :border="false"
              :columns="storeDetailColumns"
              :data="storeDetailTableData"
              @currentChange="currentChange"
              @selection-change="selectionChange"
            >
              <etm-table-tool-bar slot="tool">
                <etm-table-digit :data="storeDetailTipData" />
                <div slot="right">
                  <el-button :disabled="!selectTableValue.length" type="primary" @click="storeDetailQRcodePop = true">打印二维码</el-button>
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
                      <div class="img-left" @click="bookDetail(row.bookManageId)">
                        <img v-if="row.cover[0].url" :src="row.cover[0].url" alt="">
                        <img v-else :src="bookDefaultCover" alt="">
                      </div>
                      <div class="info-right">
                        <etm-text type="primary" @click="bookDetail(row.bookManageId)">{{ row.bookManageName }}</etm-text>
                        <div class="author">{{ row.author }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </template>
              <template slot="right">
                <el-table-column
                  prop="operate"
                  label="操作"
                >
                  <template slot-scope="{ row }">
                    <etm-text
                      v-if="row.bookStatus === '未借出'"
                      type="danger"
                      @click="deleteOperateStoreDetail(row.bookInventoryDetailsId)"
                    >删除</etm-text>
                  </template>
                </el-table-column>
              </template>
            </etm-table-page>
          </template>
        </div>
        <!-- 查询图书详情弹窗 -->
        <etm-drawer
          :visible.sync="bookDetailPop"
          :before-close="bookDetailPopBeforeClose"
        >
          <etm-layout-split>
            <div slot="default">
              <!--详情-->
              <template v-if="Object.keys(bookDetailPopData).length !== 0 && !bookDetailPopEditStatus">
                <etm-title size="big" :show-line="false" border title="详情">
                  <template slot="tool">
                    <el-button v-if="activateName === 'libraryManage'" size="mini" plain @click="bookDetailPopEdit">编辑</el-button>
                  </template>
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
              <!--编辑-->
              <template v-else-if="bookDetailPopEditStatus">
                <etm-title size="big" :show-line="false" border title="详情">
                  <template slot="tool">
                    <el-button plain size="mini" @click="cancelDrawer">取消</el-button>
                    <el-button type="primary" size="mini" @click="bookDetailPopSave">保存</el-button>
                  </template>
                </etm-title>
                <etm-form ref="editBookDetailFormRef" type="dialog" :model="bookDetailPopDataDeepCopyData">
                  <el-form-item label="封面">
                    <div class="cover-img">
                      <img v-if="bookDetailPopDataDeepCopyData.cover[0].url" :src="bookDetailPopDataDeepCopyData.cover[0].url" alt="">
                      <img v-else :src="bookDefaultCover" alt="">
                      <div class="translate-cover" @click="replaceCover">更换封面</div>
                      <input ref="replaceCoverRef" type="file" accept="image/*" style="display: none" @change="changeFileImg">
                    </div>
                  </el-form-item>
                  <el-form-item label="编码" prop="coding" :rules="bookDetailPopEditFormRules.coding">
                    <el-input v-model="bookDetailPopDataDeepCopyData.coding" />
                  </el-form-item>
                  <el-form-item label="名称" prop="bookManageName" :rules="bookDetailPopEditFormRules.bookManageName">
                    <el-input v-model="bookDetailPopDataDeepCopyData.bookManageName" />
                  </el-form-item>
                  <el-form-item label="图书分类" required>
                    <el-select v-model="bookDetailPopDataDeepCopyData.bookTypeId" placeholder="请选择图书分类">
                      <el-option
                        v-for="item in storeDetailFormData[1].options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <!--<el-input v-model="bookDetailPopDataDeepCopyData.bookType" />-->
                  </el-form-item>
                  <el-form-item label="作者">
                    <el-input v-model="bookDetailPopDataDeepCopyData.author" />
                  </el-form-item>
                  <el-form-item label="出版社">
                    <el-input v-model="bookDetailPopDataDeepCopyData.publishingHouse" />
                  </el-form-item>
                  <el-form-item label="ISBN">
                    <el-input v-model="bookDetailPopDataDeepCopyData.bookNumber" placeholder="请输入ISBN码" />
                  </el-form-item>
                  <el-form-item label="简介">
                    <el-input
                      v-model="bookDetailPopDataDeepCopyData.introduction"
                      type="textarea"
                      show-word-limit
                      maxlength="100"
                      :autosize="{ minRows: 10}"
                    />
                  </el-form-item>
                </etm-form>
              </template>
            </div>
          </etm-layout-split>
        </etm-drawer>

        <!--入库弹窗-->
        <etm-pop
          :visible="storePop"
          pop="complex"
          title="快速入库"
          confirm-btn="确定"
          cancel-btn="取消"
          @close="storeClose"
          @confirm="storeConfirm"
          @cancel="storePop = false"
        >
          <etm-field-label type="left" label="编码">{{ storeData.coding }}</etm-field-label>
          <etm-field-label type="left" label="类型">{{ storeData.bookTypeName }}</etm-field-label>
          <etm-field-label type="left" label="作者">{{ storeData.author }}</etm-field-label>
          <etm-field-label type="left" label="出版社">{{ storeData.publishingHouse }}</etm-field-label>
          <etm-form ref="etmForm" :model="storeData" :rules="storeDataRuleForm" type="dialog">
            <el-form-item
              label="入库位置"
              prop="storageLocation"
            >
              <el-input v-model="storeData.storageLocation" placeholder="请输入本次入库位置" />
            </el-form-item>
            <el-form-item
              label="入库数量"
              prop="storageCount"
            >
              <el-input v-model="storeData.storageCount" placeholder="请输入本次入库数量" />
            </el-form-item>
          </etm-form>
        </etm-pop>

        <!--添加图书弹窗-->
        <etm-pop
          :visible="addBookPop"
          :append-to-body="false"
          pop="big"
          title="添加图书"
          confirm-btn="确定"
          cancel-btn="取消"
          @close="addBookClose"
          @confirm="addBookConfirm"
          @cancel="addBookPop = false"
        >
          <etm-form v-if="addBookPop" ref="addBookFormRef" :model="addBookData" :rules="addBookDataFormRules" type="dialog">
            <el-form-item label="封面">
              <div class="upload-cover" @click="$refs.uploadCoverRef.click()">
                <img v-if="addBookData.cover[0].url" :src="addBookData.cover[0].url" alt="">
                <i v-else class="el-icon-plus" />
                <div class="tip-box" @click.stop>
                  <i class="el-icon-warning-outline" />
                  <span class="tip-txt">建议尺寸148X210</span>
                </div>
                <!--                <img :src="addBookData.imgSrc" alt="">-->
                <!--                <div class="translate-cover" @click="replaceCover">更换封面</div>-->
                <input ref="uploadCoverRef" type="file" accept="image/*" style="display: none" @change="changeCoverFileImg">
              </div>
            </el-form-item>
            <el-form-item label="编码" prop="coding">
              <el-input v-model="addBookData.coding" :disabled="addBookAutoGenerate" placeholder="请输入编码" />
              <div class="auto-generate">
                <el-checkbox v-model="addBookAutoGenerate" @change="autoGenerate">自动生成</el-checkbox>
              </div>
            </el-form-item>
            <el-form-item label="名称" prop="bookManageName">
              <el-input v-model="addBookData.bookManageName" v-in-focus placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="图书分类" prop="bookTypeId">
              <el-select v-model="addBookData.bookTypeId" placeholder="请选择图书分类">
                <el-option
                  v-for="item in storeDetailFormData[1].options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!--<el-input v-model="bookDetailPopDataDeepCopyData.bookType" />-->
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="addBookData.author" placeholder="请输入作者" />
            </el-form-item>
            <el-form-item label="出版社">
              <el-input v-model="addBookData.publishingHouse" placeholder="请输入出版社" />
            </el-form-item>
            <el-form-item label="ISBN">
              <el-input v-model="addBookData.bookNumber" placeholder="请输入ISBN码" />
            </el-form-item>
            <el-form-item
              label="入库位置"
              prop="storageLocation"
            >
              <el-input v-model="addBookData.storageLocation" placeholder="请输入入库位置" />
            </el-form-item>
            <el-form-item
              label="入库数量"
              prop="storageCount"
            >
              <el-input v-model="addBookData.storageCount" placeholder="请输入入库数量" />
            </el-form-item>
            <el-form-item label="简介">
              <el-input
                v-model="addBookData.introduction"
                type="textarea"
                show-word-limit
                maxlength="100"
                :autosize="{ minRows: 10}"
                placeholder="请输入简介"
              />
            </el-form-item>
          </etm-form>
        </etm-pop>

        <!--打印二维码-->
        <etm-pop
          :visible="storeDetailQRcodePop"
          :append-to-body="false"
          pop="complex"
          title="打印预览"
          confirm-btn="打印"
          cancel-btn="取消"
          @open="storeDetailQRcodeOpen"
          @close="storeDetailQRcodeClose"
          @confirm="storeDetailQRcodeConfirm"
          @cancel="storeDetailQRcodePop = false"
        >
          <div v-if="storeDetailQRCodeImageList.length !== 0" class="qrcode">
            <div
              v-for="(item, index) in storeDetailQRCodeImageList"
              :key="index"
              class="qrcode-list"
            >
              <div class="qrcode-item">
                <vue-qr
                  :text="item.bookCode"
                />
              </div>
              <div class="book-code">{{ item.bookCode }}</div>
            </div>
          </div>
        </etm-pop>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/19 9:23
 */
import baseMixin from '@/layout/mixin/baseMixin'
import { deepCopy } from '@/utils/common'
import formValidate from './utils/rules'
import EtmTableDigit from '@/components/EtmTableDigit'
import vueQr from 'vue-qr'
import printjs from './utils/printjs'
import { uploadFile } from '@/api/base'
import transferDate from '@/utils/date'
import {
  queryLibraryManageList,
  queryStoreDetailList,
  queryStoreDetailStatistics,
  queryLibraryManageTypeList,
  queryLibraryDetailPop,
  updateBookDetail,
  createStore,
  removeStore,
  createLibraryManage,
  removeStoreDetail,
  autoGenerateCoding
} from '@/api/newDaycare/listLibrary'
export default {
  name: 'Index',
  components: {
    EtmTableDigit,
    vueQr
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data() {
    return {
      drawerPath: false,
      bookDefaultCover: require('@/assets/images/daycare/book-cover.png'),
      formValidate: formValidate,
      activateName: 'libraryManage',
      libraryManageFormData: [
        {
          type: 'input',
          label: '图书名称',
          value: '',
          prop: 'name',
          props: {
            placeholder: '请输入图书名称'
          }
        },
        {
          type: 'select',
          label: '图书分类',
          value: '',
          prop: 'bookTypeId',
          props: {
            placeholder: '请选择图书分类'
          },
          options: []
        }
      ],
      libraryManageTableData: {
        content: []
      },
      libraryManageColumns: [
        {
          prop: 'coding',
          label: '编码',
          minWidth: '70'
        },
        {
          prop: 'bookNumber',
          label: '图书ISBN',
          minWidth: '70'
        },
        {
          prop: 'bookTypeName',
          label: '图书分类',
          minWidth: '70'
        },
        {
          prop: 'publishingHouse',
          label: '出版社',
          minWidth: '70'
        },
        {
          prop: 'createTime',
          label: '登记日期',
          minWidth: '70'
        },
        {
          prop: 'createName',
          label: '创建人',
          minWidth: '70'
        }
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      bookDetailPop: false,
      bookDetailPopData: {},
      bookDetailPopDataDeepCopyData: {},
      bookDetailPopEditStatus: false,
      bookDetailPopEditFormRules: {
        coding: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ],
        bookManageName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      storePop: false,
      storeData: {},
      storeDataRuleForm: {
        storageLocation: [{ required: true, message: '请输入本次入库位置', trigger: 'blur' }],
        storageCount: [
          { required: true, message: '请输入本次入库数量', trigger: 'blur' },
          formValidate.isNumberRule()
        ]
      },
      addBookPop: false,
      addBookData: {
        cover: [{ url: '' }],
        coding: '',
        bookNumber: '',
        bookManageName: '',
        bookTypeId: '',
        author: '',
        publishingHouse: '',
        storageLocation: '',
        storageCount: '',
        introduction: ''
      },
      addBookDataFormRules: {
        // imgSrc: [
        //   { required: true, message: '封面不能为空', trigger: ['blur', 'change'] }
        // ],
        coding: [
          { required: true, message: '编码不能为空', trigger: ['blur', 'change'] }
        ],
        bookManageName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        storageLocation: [
          { required: true, message: '入库位置不能为空', trigger: 'blur' }
        ],
        storageCount: [
          { required: true, message: '入库数量不能为空', trigger: 'blur' },
          formValidate.isNumberRule()
        ],
        bookTypeId: [
          { required: true, message: '图书分类不能为空', trigger: ['blur', 'change'] }
        ]
      },
      addBookAutoGenerate: false,
      // 库存明细
      storeDetailFormData: [
        {
          type: 'input',
          label: '图书名称',
          value: '',
          prop: 'bookManageName',
          props: {
            placeholder: '请输入图书名称'
          }
        },
        {
          type: 'select',
          label: '图书分类',
          value: '',
          prop: 'bookTypeId',
          props: {
            placeholder: '请选择图书分类'
          },
          options: []
        },
        {
          type: 'select',
          label: '状态',
          value: '',
          prop: 'bookStatus',
          props: {
            placeholder: '请选择状态'
          },
          options: [
            {
              value: 'NOT_LENT ',
              label: '未借出'
            },
            {
              value: 'TO_BE_CONFIRMED ',
              label: '待确认'
            },
            {
              value: 'LOANED_OUT ',
              label: '已借出'
            },
            {
              value: 'REPORTED_LOSS ',
              label: '已报损'
            },
            {
              value: '',
              label: '所有'
            }
          ]
        }
      ],
      storeDetailTableData: {
        content: []
      },
      storeDetailColumns: [
        {
          prop: 'bookBarcode',
          label: '书刊条码',
          minWidth: '70'
        },
        {
          prop: 'storageLocation',
          label: '图书位置',
          minWidth: '70'
        },
        {
          prop: 'bookTypeName',
          label: '图书分类',
          minWidth: '70'
        },
        {
          prop: 'publishingHouse',
          label: '出版社',
          minWidth: '70'
        },
        {
          prop: 'bookStatus',
          label: '状态',
          minWidth: '70'
        }
      ],
      storeDetailTipData: [],
      storeDetailQRcodePop: false,
      storeDetailQRCodeImageList: [],
      selectTableValue: [],
      bookStatus: {
        TO_BE_CONFIRMED: '待确认',
        NOT_LENT: '未借出',
        LOANED_OUT: '已借出',
        REPORTED_LOSS: '已报损'
      }
    }
  },
  computed: {},
  watch: {
    activateName() {
      this.init()
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init(search = {}) {
      const result = Object.assign({}, search, this.pageInfo)
      if (this.activateName === 'libraryManage') {
        queryLibraryManageList(result).then(res => {
          res.data.content.forEach(item => {
            item.createTime = transferDate(item.createTime).time
          })
          this.libraryManageTableData = res.data
        })
      } else {
        queryStoreDetailList(result).then(res => {
          res.data.content.forEach(item => {
            item.bookStatus = this.bookStatus[item.bookStatus]
          })
          this.storeDetailTableData = res.data
        })
        queryStoreDetailStatistics().then(res => {
          this.storeDetailTipData = []
          res.data.forEach(item => {
            if (item.bookStatus !== 'TO_BE_CONFIRMED') {
              this.storeDetailTipData.push({
                digit: item.count,
                text: this.bookStatus[item.bookStatus]
              })
            }
          })
        })
      }
      this.queryLibraryType()
    },
    cancelDrawer() {
      if (this.drawerPath) {
        this.bookDetailPop = false
      }
      this.bookDetailPopEditStatus = false
    },
    queryLibraryType() {
      queryLibraryManageTypeList().then(res => {
        this.libraryManageFormData[1].options = []
        this.storeDetailFormData[1].options = []
        res.data.forEach(item => {
          this.libraryManageFormData[1].options.push({
            value: item.bookTypeId,
            label: item.bookTypeName
          })
          this.storeDetailFormData[1].options.push({
            value: item.bookTypeId,
            label: item.bookTypeName
          })
        })
      })
    },
    setting() {
      this.$router.push('/newdaycare_bookManageSetting')
    },
    getSearchValue() {
      const search = {}
      if (this.activateName === 'libraryManage') {
        search.name = this.getObjectByProp('name', this.libraryManageFormData).value
        search.bookTypeId = this.getObjectByProp('bookTypeId', this.libraryManageFormData).value
      } else {
        search.bookManageName = this.getObjectByProp('bookManageName', this.storeDetailFormData).value
        search.bookTypeId = this.getObjectByProp('bookTypeId', this.storeDetailFormData).value
        search.bookStatus = this.getObjectByProp('bookStatus', this.storeDetailFormData).value
      }
      return search
    },
    search() {
      const search = this.getSearchValue()

      this.pageInfo = {
        pageSize: 10,
        pageNum: 1
      }
      this.init(search)
    },
    currentChange(pageNum, pageSize) {
      this.pageInfo = {
        pageSize,
        pageNum
      }
      const search = this.getSearchValue()
      this.init(search)
    },
    editOperate(bookManageId, drawerPath = true) {
      this.drawerPath = drawerPath
      queryLibraryDetailPop({ bookManageId }).then(res => {
        res.data.createTime = transferDate(res.data.createTime).time
        this.bookDetailPopData = res.data
        this.bookDetailPopDataDeepCopyData = deepCopy(this.bookDetailPopData)
        this.bookDetailPop = true
        this.bookDetailPopEditStatus = true
      })
    },
    storeOperate(bookManageId) {
      queryLibraryDetailPop({ bookManageId }).then(res => {
        this.storeData = {
          bookManageId,
          coding: res.data.coding,
          bookTypeName: res.data.bookTypeName,
          author: res.data.author,
          publishingHouse: res.data.publishingHouse,
          storageLocation: '',
          storageCount: ''
        }
      })
      this.storePop = true
    },
    deleteOperate(bookManageId) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除该图书?',
        content: '删除后将无法恢复',
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          // 网络操作
          removeStore({ bookManageId }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.init()
            this.$etmTip.close()
          }, () => {
            this.$etmTip.close()
          })
        },
        cancel: () => {
          this.$etmTip.close()
        }
      })
      this.$etmTip.open()
    },
    bookDetail(bookManageId, drawerPath = false) {
      this.drawerPath = drawerPath
      queryLibraryDetailPop({ bookManageId }).then(res => {
        res.data.createTime = transferDate(res.data.createTime).time
        this.bookDetailPopData = res.data
        this.bookDetailPop = true
      })
    },
    bookDetailPopEdit() {
      this.bookDetailPopEditStatus = true
      this.bookDetailPopDataDeepCopyData = deepCopy(this.bookDetailPopData)
    },
    bookDetailPopSave() {
      this.$refs.editBookDetailFormRef.$children[0].validate(valid => {
        if (!valid) {
          return ''
        }
        // 上传数据到服务器
        // 获取数据
        // 记得上传图片到七牛云
        const file = this.$refs.replaceCoverRef.files[0]
        if (file) {
          uploadFile(file, 'daycare/listLibrary/bookDetailData/image', 'image').then(res => {
            this.bookDetailPopDataDeepCopyData.cover[0].url = res.data.key
            this.uploadBook(this.bookDetailPopDataDeepCopyData)
          })
        } else {
          this.uploadBook(this.bookDetailPopDataDeepCopyData)
        }
      })
    },
    uploadBook(params) {
      updateBookDetail(params).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.bookDetailPopEditStatus = false
        // this.bookDetailPopData = deepCopy(this.bookDetailPopDataDeepCopyData)
        this.bookDetail(res.data.bookManageId)
        this.init()
      })
    },
    replaceCover() {
      this.$refs.replaceCoverRef.click()
    },
    changeFileImg() {
      const file = this.$refs.replaceCoverRef.files[0]
      this.bookDetailPopDataDeepCopyData.cover[0].url = URL.createObjectURL(file)
    },
    bookDetailPopBeforeClose(done) {
      this.bookDetailPopEditStatus = false
      this.bookDetailPopDataDeepCopyData = {}
      done()
    },
    storeConfirm() {
      this.$refs.etmForm.$children[0].validate(valid => {
        if (!valid) {
          return ''
        }
        // 网络请求，传数据给后端
        const params = {
          bookManageId: this.storeData.bookManageId,
          storageLocation: this.storeData.storageLocation,
          storageCount: parseInt(this.storeData.storageCount)
        }
        createStore(params).then(res => {
          this.$message({
            type: 'success',
            message: '入库成功'
          })
          this.storePop = false
        })
      })
      // this.storePop = false
    },
    storeClose() {
      this.storeData = {
        code: '2020202',
        type: '儿童读物',
        author: '油麦菜',
        publisher: '油麦菜出版社',
        position: '',
        count: ''
      }
      this.$refs.etmForm.$children[0].clearValidate()
      this.storePop = false
    },
    addBook() {
      this.addBookPop = true
    },
    addBookClose() {
      this.addBookData = {
        cover: [{ url: '' }],
        coding: '',
        bookNumber: '',
        bookManageName: '',
        bookTypeId: '',
        author: '',
        publishingHouse: '',
        storageLocation: '',
        storageCount: '',
        introduction: ''
      }
      this.addBookAutoGenerate = false
      this.$refs.addBookFormRef.$children[0].clearValidate()
      this.addBookPop = false
    },
    addBookConfirm() {
      this.$refs.addBookFormRef.$children[0].validate(valid => {
        if (!valid) {
          return ''
        }
        // childManage/more/image/18665016580/1598954549197/Snipaste_2020-08-25_15-12-04.jpg
        // 将图片上传到七牛云
        const file = this.$refs.uploadCoverRef.files[0]
        if (file) {
          uploadFile(file, 'daycare/listLibrary/bookDetailData/image', 'image').then(res => {
            this.addBookData.cover[0].url = res.data.key
            // 需要处理addBookData.count
            this.addBookRequest(this.addBookData)
          })
        } else {
          // 如果没有上传封面，则选择默认封面
          // this.addBookData.cover[0].url = 'daycare/listLibrary/bookDetailData/image/image/19943288167/1606185987918/u=3289561155,3667091394&fm=26&gp=0.jpg'
          this.addBookRequest(this.addBookData)
        }
      })
    },
    addBookRequest(params) {
      createLibraryManage(params).then(res => {
        this.$message({
          type: 'success',
          message: '添加图书成功'
        })
        this.$refs.uploadCoverRef.value = null
        this.addBookPop = false
        this.init()
      })
    },
    // uploadCover() {
    //
    //   this.$refs.uploadCoverRef.click()
    // },
    changeCoverFileImg() {
      const file = this.$refs.uploadCoverRef.files[0]
      this.addBookData.cover[0].url = URL.createObjectURL(file)
      URL.revokeObjectURL(file)
    },
    autoGenerate() {
      if (this.addBookAutoGenerate) {
        autoGenerateCoding().then(res => {
          this.addBookData.coding = res.data
        })
        // this.addBookData.code = Math.random() * 10000000
      }
    },
    // 库存明细
    deleteOperateStoreDetail(bookInventoryDetailsId) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要删除该库存明细记录吗？',
        content: '删除后库存数将－1',
        confirmBtn: '删除',
        cancelBtn: '取消',
        confirm: () => {
          // 调用接口
          removeStoreDetail({ id: bookInventoryDetailsId }).then(res => {
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
    storeDetailQRcodeOpen() {
      setTimeout(() => {
        this.selectTableValue.forEach(item => {
          this.storeDetailQRCodeImageList.push({
            bookCode: item.bookBarcode
          })
        })
      }, 100)
    },
    storeDetailQRcodeClose() {
      this.storeDetailQRCodeImageList = []
      this.storeDetailQRcodePop = false
    },
    storeDetailQRcodeConfirm() {
      //
      // this.storeDetailQRcodePop = false
      printjs({
        el: document.querySelector('.qrcode'),
        head: document.head
      })
    },
    selectionChange(val) {
      this.selectTableValue = []
      val.forEach(item => {
        this.selectTableValue.push({
          bookBarcode: item.bookBarcode,
          code: item.code
        })
      })
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

  .store-detail {
    //margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    .el-button {
      height: 32px;
    }
  }

  .qrcode {
    display: flex;
    flex-wrap: wrap;
    .qrcode-list {
      margin-right: 35px;
      .qrcode-item {
        width: 120px;
        height: 120px;
        padding: 15px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        background: #FFF;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .book-code {
        padding: 16px 0;
        width: 120px;
        font-size: 14px;
        color: #555555;
        text-align: center;
      }
    }
  }
}

// 打印二维码样式
@media print {
  div {
    box-sizing: border-box;
  }
  .qrcode {
    //display: flex;
    //flex-wrap: wrap;
    //justify-content: space-around;
    .qrcode-list {
      //display: inline-block;
      float: left;
      margin-right: 55px;
      .qrcode-item {
        width: 120px;
        height: 120px;
        padding: 15px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        background: #FFF;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .book-code {
        padding: 16px 0;
        //margin: 16px 0;
        width: 120px;
        //height: 42px;
        font-size: 14px;
        color: #555555;
        text-align: center;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
    .qrcode-list:nth-child(4n) {
      margin-right: 0;
    }
  }
}
</style>
