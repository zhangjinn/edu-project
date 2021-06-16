<template>
  <div class="index-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div slot="header">
          <etm-tabs v-model="activateName">
            <el-tab-pane
              label="已确认"
              name="alreadySure"
            >
              <etm-tool-bar
                v-model="alreadySureFormData"
                @search="search"
              />
            </el-tab-pane>
            <el-tab-pane
              label="已归还"
              name="alreadyGiveBack"
            >
              <etm-tool-bar
                v-model="alreadyGiveBackFormData"
                @search="search"
              />
            </el-tab-pane>
          </etm-tabs>
        </div>
        <div slot="body">
          <template v-if="activateName === 'alreadySure'">
            <etm-table-page
              selection
              :stripe="false"
              :border="false"
              :columns="alreadySureColumns"
              :data="alreadySureTableData"
              @currentChange="currentChange"
            >
              <etm-table-tool-bar slot="tool">
                <div slot="right">
                  <el-button
                    type="primary"
                    @click="giveBack(null)"
                  >
                    归还
                  </el-button>
                  <el-button
                    type="primary"
                    @click="lendRegisterPop = true"
                  >
                    借阅登记
                  </el-button>
                </div>
              </etm-table-tool-bar>
              <template slot="left">
                <el-table-column
                  prop="bookName"
                  label="名称"
                  width="200px"
                  show-overflow-tooltip
                >
                  <template slot-scope="{ row }">
                    <div class="book-name">
                      <div
                        class="img-left"
                        @click="lookLibraryDetail(row.bookManageId)"
                      >
                        <img
                          v-if="row.cover[0].url"
                          :src="row.cover[0].url"
                          alt=""
                        >
                        <img
                          v-else
                          :src="bookDefaultCover"
                          alt=""
                        >
                      </div>
                      <div class="info-right">
                        <etm-text
                          type="primary"
                          @click="lookLibraryDetail(row.bookManageId)"
                        >
                          {{ row.bookManageName }}
                        </etm-text>
                        <div class="author">
                          {{ row.author }}
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </template>
              <el-table-column
                prop="childName"
                label="学员名称"
              >
                <template slot-scope="{ row }">
                  <etm-text
                    type="primary"
                    @click="borrowDetailDrawerClick(row.bookLendingDetailsId)"
                  >
                    {{ row.childName }}
                  </etm-text>
                </template>
              </el-table-column>
              <el-table-column
                prop="childPhone"
                label="学员电话"
              />
              <el-table-column
                prop="createDate"
                label="借阅日期"
                sortable
                sort-by="createDate"
              />
              <el-table-column
                prop="duration"
                label="借阅时长"
                sortable
                sort-by="duration"
              />
              <el-table-column
                prop="endDate"
                label="到期日期"
                sortable
                sort-by="endDate"
              />
              <template slot="right">
                <el-table-column
                  prop="operate"
                  label="操作"
                >
                  <template slot-scope="{ row }">
                    <template v-if="row.bookBarcode !== '--'">
                      <etm-text
                        type="primary"
                        @click="giveBack(row.bookBarcode, row.bookLendingDetailsId)"
                      >
                        归还
                      </etm-text>
                      <etm-text
                        v-if="row.bookStatus !== 'REPORTED_LOSS'"
                        type="primary"
                        @click="renewal(row.bookLendingDetailsId)"
                      >
                        续借
                      </etm-text>
                      <etm-text
                        v-if="row.bookStatus !== 'REPORTED_LOSS'"
                        type="primary"
                        @click="breakage(row.bookLendingDetailsId)"
                      >
                        报损
                      </etm-text>
                    </template>
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
              :columns="alreadyGiveBackColumns"
              :data="alreadyGiveBackTableData"
              @currentChange="currentChange"
            >
              <template slot="left">
                <el-table-column
                  prop="bookName"
                  label="名称"
                  width="200px"
                  show-overflow-tooltip
                >
                  <template slot-scope="{ row }">
                    <div class="book-name">
                      <div
                        class="img-left"
                        @click="lookLibraryDetail(row.bookManageId)"
                      >
                        <img
                          v-if="row.cover[0].url"
                          :src="row.cover[0].url"
                          alt=""
                        >
                        <img
                          v-else
                          :src="bookDefaultCover"
                          alt=""
                        >
                      </div>
                      <div class="info-right">
                        <etm-text
                          type="primary"
                          @click="lookLibraryDetail(row.bookManageId)"
                        >
                          {{ row.bookManageName }}
                        </etm-text>
                        <div class="author">
                          {{ row.author }}
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </template>
              <el-table-column
                prop="childName"
                label="学员名称"
              >
                <template slot-scope="{ row }">
                  <etm-text
                    type="primary"
                    @click="borrowDetailDrawerClick(row.bookLendingDetailsId)"
                  >
                    {{ row.childName }}
                  </etm-text>
                </template>
              </el-table-column>
              <el-table-column
                prop="childPhone"
                label="学员电话"
              />
              <el-table-column
                prop="createDate"
                label="借阅日期"
                sortable
                sort-by="createDate"
              />
              <el-table-column
                prop="duration"
                label="借阅时长"
                sortable
                sort-by="duration"
              />
              <el-table-column
                prop="endDate"
                label="到期日期"
                sortable
                sort-by="endDate"
              />
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
              <template v-if="Object.keys(bookDetailPopData).length !== 0">
                <etm-title
                  size="big"
                  :show-line="false"
                  border
                  title="详情"
                >
                  <!--                  <template slot="tool">-->
                  <!--                    <el-button type="primary" @click="bookDetailPopEdit">编辑</el-button>-->
                  <!--                  </template>-->
                </etm-title>
                <div class="content">
                  <div class="cover-img">
                    <div class="cover">
                      <img
                        v-if="bookDetailPopData.cover[0].url"
                        :src="bookDetailPopData.cover[0].url"
                        alt=""
                      >
                      <img
                        v-else
                        :src="bookDefaultCover"
                        alt=""
                      >
                    </div>
                  </div>
                  <!--                  <etm-field-label type="left" label="封面">-->
                  <!--                    <img :src="bookDetailPopData.imgSrc" alt="" style="width: 100px;height: 100px;">-->
                  <!--                  </etm-field-label>-->
                  <etm-field-label
                    type="left"
                    label="名称"
                  >
                    {{ bookDetailPopData.bookManageName }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="编码"
                  >
                    {{ bookDetailPopData.coding }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="类型"
                  >
                    {{ bookDetailPopData.bookTypeName }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="作者"
                  >
                    {{ bookDetailPopData.author }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="出版社"
                  >
                    {{ bookDetailPopData.publishingHouse }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="ISBN"
                  >
                    {{ bookDetailPopData.bookNumber }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="创建人"
                  >
                    {{ bookDetailPopData.createName }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="登记日期"
                  >
                    {{ bookDetailPopData.createTime }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="简介"
                  >
                    {{ bookDetailPopData.introduction }}
                  </etm-field-label>
                </div>
              </template>
            </div>
          </etm-layout-split>
        </etm-drawer>

        <!-- 归还弹窗 -->
        <etm-pop
          :visible="giveBackPop"
          pop="complex"
          title="归还"
          confirm-btn="确定"
          cancel-btn="取消"
          @close="giveBackPopClose"
          @confirm="giveBackPopConfirm"
          @cancel="giveBackPop = false"
        >
          <template v-if="!giveBackLibrarySearch">
            <etm-field-label
              type="left"
              label="书刊条码"
            >
              {{ giveBackPopData.bookBarcode }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="图书名称"
            >
              {{ giveBackPopData.bookManageName }}
            </etm-field-label>
            <etm-form
              ref="giveBackPopRef"
              :model="giveBackPopData"
              :rules="giveBackPopRules"
              type="dialog"
            >
              <el-form-item
                label="图书位置"
                prop="storageLocation"
              >
                <el-input v-model="giveBackPopData.storageLocation" />
              </el-form-item>
            </etm-form>
            <etm-field-label
              type="left"
              label="学员电话"
            >
              {{ giveBackPopData.phone }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="学员名称"
            >
              {{ giveBackPopData.childName }}
            </etm-field-label>
            <etm-field-label
              type="left"
              label="到期日期"
            >
              {{ giveBackPopData.dateOfExpiry }}
            </etm-field-label>
          </template>
          <template v-else>
            <etm-form
              v-if="giveBackPop"
              ref="giveBackPopRef"
              :model="giveBackPopData"
              :rules="giveBackPopRules"
              type="dialog"
            >
              <el-form-item
                label="书刊条码"
                prop="bookBarcode"
              >
                <el-input
                  v-model="giveBackPopData.bookBarcode"
                  v-in-focus
                  @blur="blurSearch"
                />
              </el-form-item>
              <etm-field-label
                type="left"
                label="图书名称"
              >
                {{ giveBackPopData.bookManageName }}
              </etm-field-label>
              <el-form-item
                label="图书位置"
                prop="storageLocation"
              >
                <el-input v-model="giveBackPopData.storageLocation" />
              </el-form-item>
              <etm-field-label
                type="left"
                label="学员电话"
              >
                {{ giveBackPopData.phone }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="学员名称"
              >
                {{ giveBackPopData.childName }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="到期日期"
              >
                {{ giveBackPopData.dateOfExpiry }}
              </etm-field-label>
            </etm-form>
          </template>
        </etm-pop>

        <!-- 续借弹窗 -->
        <etm-drawer
          :visible.sync="renewalPop"
          :before-close="renewalPopBeforeClose"
        >
          <etm-layout-split>
            <div slot="default">
              <!--详情-->
              <template v-if="Object.keys(renewalDetailData).length > 1">
                <etm-title
                  size="big"
                  :show-line="false"
                  border
                  title="详情"
                >
                  <template slot="tool">
                    <el-button
                      type="primary"
                      @click="renewalPop = false"
                    >
                      取消
                    </el-button>
                    <el-button
                      type="primary"
                      @click="renewalPopSave"
                    >
                      保存
                    </el-button>
                  </template>
                </etm-title>
                <div class="content">
                  <div class="cover-img">
                    <div class="cover">
                      <img
                        v-if="renewalDetailData.cover[0].url"
                        :src="renewalDetailData.cover[0].url"
                        alt=""
                      >
                      <img
                        v-else
                        :src="bookDefaultCover"
                        alt=""
                      >
                    </div>
                  </div>
                  <!--                  <etm-field-label type="left" label="封面">-->
                  <!--                    <img :src="bookDetailPopData.imgSrc" alt="" style="width: 100px;height: 100px;">-->
                  <!--                  </etm-field-label>-->
                  <etm-field-label
                    type="left"
                    label="名称"
                  >
                    {{ renewalDetailData.bookManageName }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="书刊条码"
                  >
                    {{ renewalDetailData.bookBarcode }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="类型"
                  >
                    {{ renewalDetailData.bookTypeName }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="作者"
                  >
                    {{ renewalDetailData.author }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="出版社"
                  >
                    {{ renewalDetailData.publishingHouse }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="学员名称"
                  >
                    {{ renewalDetailData.childName }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="到期日期"
                  >
                    {{ renewalDetailData.dateOfExpiry }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="借阅日期"
                  >
                    {{ renewalDetailData.borrowingDate }}
                  </etm-field-label>
                  <etm-form
                    ref="renewalFormRef"
                    :model="renewalDetailData"
                    type="dialog"
                  >
                    <el-form-item
                      label="续借时长"
                      prop="renewalDuration"
                      :rules="[
                        { required: true, message: '续借时长不能为空', trigger: 'blur' },
                        formValidate.isNumberMonthRule()
                      ]"
                    >
                      <el-input
                        v-model="renewalDetailData.renewalDuration"
                        @input="renewalDurationChange"
                      >
                        <div slot="append">
                          个月
                        </div>
                      </el-input>
                    </el-form-item>
                  </etm-form>
                  <etm-field-label
                    type="left"
                    label="续后到期"
                  >
                    {{ renewalDetailData.renewalOfAfter }}
                  </etm-field-label>
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
                <etm-title
                  size="big"
                  :show-line="false"
                  border
                  title="借阅详情"
                />
                <div class="content">
                  <etm-field-label
                    type="left"
                    :label="borrowDetailDrawerData.childName"
                  >
                    {{ borrowDetailDrawerData.childPhone }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="图书编码"
                  >
                    {{ borrowDetailDrawerData.coding }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="图书名称"
                  >
                    {{ borrowDetailDrawerData.bookManageName }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="ISBN"
                  >
                    {{ borrowDetailDrawerData.bookNumber }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="图书位置"
                  >
                    {{ borrowDetailDrawerData.storageLocation }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="借阅日期"
                  >
                    {{ borrowDetailDrawerData.borrowingDate }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="借阅时长"
                  >
                    {{ borrowDetailDrawerData.duration }}个月
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="借阅状态"
                  >
                    {{ borrowDetailDrawerData.borrowingStatus }}
                  </etm-field-label>
                  <etm-field-label
                    type="left"
                    label="到期日期"
                  >
                    {{ borrowDetailDrawerData.dateOfExpiry }}
                  </etm-field-label>
                  <etm-title
                    :show-line="false"
                    border
                    title="其他图书"
                  />
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

        <!-- 借阅登记弹窗 -->
        <etm-pop
          :visible="lendRegisterPop"
          pop="complex"
          title="借阅登记"
          confirm-btn="确定"
          cancel-btn="取消"
          @close="lendRegisterPopClose"
          @confirm="lendRegisterPopConfirm"
          @cancel="lendRegisterPop = false"
        >
          <etm-layout-split>
            <etm-form
              v-if="lendRegisterPop"
              ref="lendRegisterPopFromRef"
              :model="lendRegisterPopData"
              :rules="lendRegisterPopRules"
              type="dialog"
            >
              <el-form-item
                label="书刊条码"
                prop="bookBarcode"
              >
                <el-input
                  v-model="lendRegisterPopData.bookBarcode"
                  v-in-focus
                  @change="lendRegisterPopBookBarcodeChange"
                />
              </el-form-item>
              <etm-field-label
                type="left"
                label="图书名称"
              >
                {{ lendRegisterPopData.bookManageName }}
              </etm-field-label>
              <etm-field-label
                type="left"
                label="图书位置"
              >
                {{ lendRegisterPopData.storageLocation }}
              </etm-field-label>
              <el-form-item
                label="学员姓名"
                prop="childName"
              >
                <etm-text
                  v-if="lendRegisterPopData.childName"
                  type="primary"
                  @click="chooseChildPop=true"
                >
                  {{ lendRegisterPopData.childName }}
                </etm-text>
                <el-button
                  v-else
                  type="primary"
                  icon="el-icon-plus"
                  @click="chooseChildPop=true"
                >
                  选择学员
                </el-button>
              </el-form-item>
              <etm-field-label
                type="left"
                label="借阅日期"
              >
                {{ lendRegisterPopData.createDate }}
              </etm-field-label>
              <el-form-item
                label="借阅时长"
                prop="duration"
              >
                <el-input
                  v-model="lendRegisterPopData.duration"
                  @input="durationChange"
                >
                  <div slot="append">
                    个月
                  </div>
                </el-input>
              </el-form-item>
              <etm-field-label
                type="left"
                label="到期日期"
              >
                {{ lendRegisterPopData.endDate }}
              </etm-field-label>
            </etm-form>
          </etm-layout-split>
        </etm-pop>

        <!--        选择学员弹窗-->
        <choose-child
          :show-pop.sync="chooseChildPop"
          @chooseChildInfo="chooseChildInfo"
        />
      </etm-layout-split>
    </etm-main-body>
  </div>
</template>

<script>
/**
 * index create by 油麦菜
 * createTime 2020/11/23 9:55
 */
import baseMixin from '@/layout/mixin/baseMixin'
import transferDate from '@/utils/date'
import {
  queryBookLendingDetails,
  queryLibraryDetailPop,
  queryGiveBackDetail,
  updateGiveBackLibrary,
  updateBreakage,
  queryRenewalDetail,
  updateRenewalDuration,
  childNameByPhone,
  createLendRegister,
  queryBorrowDetail,
  queryDuration
} from '@/api/newDaycare/listLibrary'
import formValidate from '../bookManage/utils/rules'
import chooseChild from '@/views/newDaycare/listLibrary/bookManage/components/chooseChild'
export default {
  name: 'Index',
  components: {
    chooseChild
  },
  filters: {},
  mixins: [baseMixin],
  props: {},
  data () {
    return {
      chooseChildPop: false,
      bookDefaultCover: require('@/assets/images/daycare/book-cover.png'),
      activateName: 'alreadySure',
      transferDate: transferDate,
      // 已确认
      alreadySureFormData: [
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
      alreadySureColumns: [
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
        }
      ],
      alreadySureTableData: {
        content: []
      },
      bookDetailPop: false,
      bookDetailPopData: {
        // imgSrc: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2168641989,3800624395&fm=26&gp=0.jpg',
      },
      borrowDetailDrawer: false,
      borrowDetailDrawerData: {},
      giveBackPop: false,
      giveBackPopData: {},
      giveBackPopRules: {
        storageLocation: [
          { required: true, message: '图书位置不能为空', trigger: 'blur' }
        ],
        bookBarcode: [
          { required: true, message: '书刊条码不能为空', trigger: 'blur' }
        ]
      },
      giveBackLibrarySearch: false,
      renewalPop: false,
      renewalDetailData: {
      },
      formValidate: formValidate,
      lendRegisterPop: false,
      lendRegisterPopData: {
        childName: '',
        createDate: transferDate(null).time,
        endDate: ''
      },
      lendRegisterPopRules: {
        bookBarcode: [{ required: true, message: '书刊条码不能为空', trigger: 'blur' }],
        childName: [{ required: true, message: '请选择学员', trigger: 'change' }],
        createDate: [{ required: true, message: '借阅日期不能为空', trigger: 'blur' }],
        duration: [
          { required: true, message: '借阅时长不能为空', trigger: 'blur' },
          formValidate.isNumberMonthRule()
        ]
      },
      // 已归还
      alreadyGiveBackFormData: [
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
      alreadyGiveBackColumns: [
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
        }
      ],
      alreadyGiveBackTableData: {
        content: []
      },
      borrowingStatus: {
        TO_BE_CONFIRMED: '待确认',
        CONFIRMED: '已确认',
        CANCELLED: '已取消',
        RETURNED: '已归还'
      }
    }
  },
  computed: {},
  watch: {
    activateName () {
      this.init()
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init (search = {}) {
      if (this.activateName === 'alreadySure') {
        search.bookLendStatus = 'CONFIRMED'
        const result = Object.assign({}, search, this.pageInfo)
        queryBookLendingDetails(result).then(res => {
          res.data.content.forEach(item => {
            item.createDate = item.createDate && transferDate(item.createDate).time
            item.endDate = item.endDate && transferDate(item.endDate).time
          })
          this.alreadySureTableData = res.data
        })
      } else {
        search.bookLendStatus = 'RETURNED'
        const result = Object.assign({}, search, this.pageInfo)
        queryBookLendingDetails(result).then(res => {
          res.data.content.forEach(item => {
            item.createDate = item.createDate && transferDate(item.createDate).time
            item.endDate = item.endDate && transferDate(item.endDate).time
          })
          this.alreadyGiveBackTableData = res.data
        })
      }
    },
    getSearchObj () {
      const formData = this.activateName === 'alreadySure' ? this.alreadySureFormData : this.alreadyGiveBackFormData
      const dateRange = this.getObjectByProp('date1', formData).value
      return {
        startDate: (dateRange && dateRange[0] + ' 00:00:00') || null,
        endDate: (dateRange && dateRange[1] + ' 23:59:59') || null,
        bookManageName: this.getObjectByProp('bookManageName', formData).value,
        childName: this.getObjectByProp('childName', formData).value
      }
    },
    search () {
      this.pageInfo = {
        pageNum: 1,
        pageSize: 10
      }
      this.init(this.getSearchObj())
    },
    currentChange (pageNum, pageSize) {
      this.pageInfo = {
        pageNum,
        pageSize
      }
      this.init(this.getSearchObj())
    },
    giveBack (bookBarcode, bookLendingDetailsId) {
      if (bookBarcode) {
        this.giveBackLibrarySearch = false
        queryGiveBackDetail({ bookBarcode }).then(res => {
          res.data.bookLendingDetailsId = bookLendingDetailsId
          res.data.dateOfExpiry = transferDate(res.data.dateOfExpiry).time
          this.giveBackPopData = res.data
          this.giveBackPop = true
        })
      } else {
        this.giveBackLibrarySearch = true
        this.giveBackPop = true
      }
    },
    lendRegister () {

    },
    lendRegisterPopBookBarcodeChange () {
      this.$refs.lendRegisterPopFromRef.$children[0].validateField('bookBarcode', msg => {
        if (msg) {
          this.$set(this.lendRegisterPopData, 'bookBarcode', '')
          this.$set(this.lendRegisterPopData, 'bookManageName', '')
          this.$set(this.lendRegisterPopData, 'storageLocation', '')
          return ''
        } else {
          const bookBarcode = this.lendRegisterPopData.bookBarcode
          queryGiveBackDetail({ bookBarcode: bookBarcode }).then(res => {
            this.$set(this.lendRegisterPopData, 'bookBarcode', res.data.bookBarcode)
            this.$set(this.lendRegisterPopData, 'bookManageName', res.data.bookManageName)
            this.$set(this.lendRegisterPopData, 'storageLocation', res.data.storageLocation)
            if (this.lendRegisterPopData.phone && this.lendRegisterPopData.childName) {
              queryDuration({
                bookBarcode: this.lendRegisterPopData.bookBarcode,
                childId: this.lendRegisterPopData.childId
              }).then(res => {
                const durations = res.data
                if (durations.length === 1) {
                  // this.lendRegisterPopData.duration = durations[0]
                  this.$set(this.lendRegisterPopData, 'duration', durations[0].toString())
                  this.durationChange()
                } else if (durations.length > 1) {
                  this.$message({
                    type: 'info',
                    message: '匹配超过一条申请记录请自行输入借阅时长'
                  })
                }
              })
            }
          }, () => {
            const bookBarcode = this.lendRegisterPopData.bookBarcode
            this.$set(this.lendRegisterPopData, 'bookBarcode', bookBarcode)
            this.$set(this.lendRegisterPopData, 'bookManageName', '')
            this.$set(this.lendRegisterPopData, 'storageLocation', '')
          })
        }
      })
    },
    phoneChange () {
      this.$refs.lendRegisterPopFromRef.$children[0].validateField('phone', msg => {
        if (msg) {
          this.$set(this.lendRegisterPopData, 'childName', '')
          this.$set(this.lendRegisterPopData, 'childId', '')
          return ''
        } else {
          childNameByPhone({ phone: this.lendRegisterPopData.phone }).then(res => {
            this.$set(this.lendRegisterPopData, 'childName', res.data.childName)
            this.$set(this.lendRegisterPopData, 'childId', res.data.childId)
            if (this.lendRegisterPopData.bookBarcode && this.lendRegisterPopData.bookManageName) {
              queryDuration({
                bookBarcode: this.lendRegisterPopData.bookBarcode,
                childId: this.lendRegisterPopData.childId
              }).then(res => {
                const durations = res.data
                if (durations.length === 1) {
                  // this.lendRegisterPopData.duration = durations[0]
                  this.$set(this.lendRegisterPopData, 'duration', durations[0].toString())
                  this.durationChange()
                } else if (durations.length > 1) {
                  this.$message({
                    type: 'info',
                    message: '匹配超过一条申请记录请自行输入借阅时长'
                  })
                }
              })
            }
          }, () => {
            this.$set(this.lendRegisterPopData, 'childName', '')
            this.$set(this.lendRegisterPopData, 'childId', '')
          })
        }
      })
    },
    renewal (bookLendingDetailsId) {
      queryRenewalDetail({ bookLendingDetailsId }).then(res => {
        res.data.bookLendingDetailsId = bookLendingDetailsId
        res.data.borrowingDate = transferDate(res.data.borrowingDate).time
        res.data.dateOfExpiry = transferDate(res.data.dateOfExpiry).time
        this.renewalDetailData = res.data
        this.renewalPop = true
      })
    },
    breakage (bookLendingDetailsId) {
      this.$etmTip.init({
        type: 'warn',
        title: '确认要执行报损操作？',
        content: '',
        confirmBtn: '确定',
        cancelBtn: '取消',
        confirm: () => {
          updateBreakage({ bookLendingDetailsId }).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功'
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
    bookDetailPopBeforeClose (done) {
      this.bookDetailPopData = {}
      done()
    },
    lookLibraryDetail (bookManageId) {
      queryLibraryDetailPop({ bookManageId }).then(res => {
        res.data.createTime = transferDate(res.data.createTime).time
        this.bookDetailPopData = res.data
        this.bookDetailPop = true
      })
    },
    giveBackPopClose () {
      this.$refs.giveBackPopRef.$children[0].clearValidate()
      this.giveBackPopData = {}
      this.giveBackPop = false
    },
    giveBackPopConfirm () {
      this.$refs.giveBackPopRef.$children[0].validate(valid => {
        if (!valid) {
          return ''
        }
        if (!this.giveBackPopData.bookLendingDetailsId) {
          this.$message({
            type: 'error',
            message: '未找到图书'
          })
          return ''
        }
        const obj = {
          bookLendingDetailsId: this.giveBackPopData.bookLendingDetailsId,
          bookBarcode: this.giveBackPopData.bookBarcode,
          storageLocation: this.giveBackPopData.storageLocation
        }
        updateGiveBackLibrary(obj).then(res => {
          this.$message({
            type: 'success',
            message: '归还成功'
          })
          this.giveBackPop = false
          this.init()
        })
      })
    },
    blurSearch () {
      this.$refs.giveBackPopRef.$children[0].validateField('bookBarcode', valid => {
        if (valid === '书刊条码不能为空') {
          return ''
        } else {
          queryGiveBackDetail({ bookBarcode: this.giveBackPopData.bookBarcode }).then(res => {
            res.data.dateOfExpiry = transferDate(res.data.dateOfExpiry).time
            this.giveBackPopData = res.data
          }, () => {
            const bookBarcode = this.giveBackPopData.bookBarcode
            const storageLocation = this.giveBackPopData.storageLocation
            this.giveBackPopData = {
              bookBarcode,
              storageLocation
            }
          })
        }
      })
    },
    renewalDurationChange () {
      // this.renewalDetailData.renewalOfAfter = this.renewalDetailData.renewalDuration
      const duration = this.renewalDetailData.renewalDuration
      if (!duration) {
        this.renewalDetailData.renewalOfAfter = ''
        return ''
      }
      // 计算几个月后的日期
      const c = new Date(this.renewalDetailData.dateOfExpiry)
      c.setMonth(c.getMonth() + parseInt(duration))
      const formDate = `${c.getFullYear()}-${(c.getMonth() + 1 + '').padStart(2, '0')}-${(c.getDate() + '').padStart(2, '0')}`

      this.renewalDetailData.renewalOfAfter = formDate
    },
    renewalPopSave () {
      this.$refs.renewalFormRef.$children[0].validate(valid => {
        if (!valid) {
          return ''
        }
        console.log(this.renewalDetailData.duration)
        updateRenewalDuration({
          bookLendingDetailsId: this.renewalDetailData.bookLendingDetailsId,
          duration: parseInt(this.renewalDetailData.renewalDuration) + parseInt(this.renewalDetailData.duration),
          dateOfExpiry: this.renewalDetailData.renewalOfAfter
        }).then(res => {
          this.$message({
            type: 'success',
            message: '续借成功'
          })
          this.renewalPop = false
          this.init()
        })
      })
    },
    lendRegisterPopClose () {
      this.$refs.lendRegisterPopFromRef.$children[0].clearValidate()
      this.lendRegisterPopData = {
        createDate: transferDate(null).time,
        endDate: ''
      }
      this.lendRegisterPop = false
    },
    durationChange () {
      const duration = this.lendRegisterPopData.duration
      if (!duration || !this.lendRegisterPopData.createDate) {
        this.lendRegisterPopData.endDate = ''
        return ''
      }
      // 计算几个月后的日期
      const c = new Date(this.lendRegisterPopData.createDate)
      c.setMonth(c.getMonth() + parseInt(duration))
      const formDate = `${c.getFullYear()}-${(c.getMonth() + 1 + '').padStart(2, '0')}-${(c.getDate() + '').padStart(2, '0')}`
      this.lendRegisterPopData.endDate = formDate
    },
    lendRegisterPopConfirm () {
      this.$refs.lendRegisterPopFromRef.$children[0].validate(valid => {
        if (!valid) {
          return ''
        }
        if (!this.lendRegisterPopData.bookManageName) {
          this.$message({
            type: 'error',
            message: '未找到图书'
          })
          return ''
        }
        if (!this.lendRegisterPopData.childId) {
          this.$message({
            type: 'error',
            message: '该手机号码不存在'
          })
          return ''
        }
        const obj = {
          bookBarcode: this.lendRegisterPopData.bookBarcode,
          childId: this.lendRegisterPopData.childId,
          phone: this.lendRegisterPopData.phone,
          createDate: transferDate(this.lendRegisterPopData.createDate).time,
          duration: this.lendRegisterPopData.duration,
          endDate: this.lendRegisterPopData.endDate
        }
        createLendRegister(obj).then(res => {
          this.$message({
            type: 'success',
            message: '借出图书成功'
          })
          this.lendRegisterPop = false
          this.init()
        })
      })
    },
    borrowDetailDrawerClick (bookLendingDetailsId) {
      queryBorrowDetail({ bookLendingDetailsId }).then(res => {
        res.data.borrowingDate = transferDate(res.data.borrowingDate).time
        res.data.dateOfExpiry = transferDate(res.data.dateOfExpiry).time
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
    borrowDetailDrawerBeforeClose () {
      // 初始化数据
      this.borrowDetailDrawerData = {}
      this.borrowDetailDrawer = false
    },
    renewalPopBeforeClose (done) {
      this.$refs.renewalFormRef.$children[0].clearValidate()
      this.renewalDetailData = {}
      done()
    },
    chooseChildInfo (row) {
      console.log(row)
      this.lendRegisterPopData.childName = row.childName
      this.lendRegisterPopData.childId = row.childId
      this.lendRegisterPopData.phone = row.telephone
    }
  }
}
</script>
<style lang="scss" scoped>
.index-wrap {
  ::v-deep.el-table__row {
    td:nth-child(2) {
      padding: 17px 0;

      .cell {
        padding-left: 17px;
      }

      .book-name {
        display: flex;

        .img-left {
          //text-align: center;
          //background: #FFFFFF;
          //border: 1px solid #E0E0E0;
          border-radius: 2px;
          flex-shrink: 0;
          //width: 126px;
          height: 70px;
          margin-right: 17px;

          img {
            height: 68px;
            object-fit: cover;
            width: 51px;
          }
        }

        .info-right {
          display: flex;
          flex-direction: column;
          justify-content: center;

          .author {
            color: #999;
            text-align: start;
          }
        }
      }
    }
  }

  .EtmForm-wrap ::v-deep .el-form .el-form-item .el-form-item__content {
    .cover-img {
      height: 100px;
      position: relative;
      width: 100px;

      &:hover {
        .translate-cover {
          display: block;
        }
      }

      img {
        height: 100%;
        object-fit: cover;
        width: 100%;
      }

      .translate-cover {
        background: #555;
        bottom: 0;
        color: #fff;
        display: none;
        left: 0;
        line-height: 16px;
        position: absolute;
        text-align: center;
        width: 100%;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .upload-cover {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 2px;
      height: 80px;
      //width: 80px;
      //height: 80px;
      line-height: 80px;
      position: relative;
      text-align: center;
      width: 80px;
      //border: 1px dashed;
      .el-icon-plus {
        font-size: 25px;
      }

      .tip-box {
        bottom: -30px;
        position: absolute;
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
        height: 100%;
        object-fit: cover;
        width: 100%;
      }
    }

    .auto-generate {
      ::v-deep.el-checkbox {
        position: absolute;
        right: -100px;
        top: 0;
      }
    }

  }

  .content {
    .cover-img {
      height: 136px;
      margin-bottom: 16px;
      width: 100%;
      //border: 1px solid #E0E0E0;
      .cover {
        height: 100%;
        margin: 0 auto;
        width: 102px;

        img {
          height: 100%;
          object-fit: cover;
          width: 100%;
        }
      }
    }
  }
}
</style>
