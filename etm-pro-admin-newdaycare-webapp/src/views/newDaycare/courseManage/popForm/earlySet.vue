<template>
  <div class="earlySet">
    <etm-form
      ref="form"
      type="dialog"
      :model="formData"
      :rules="rules"
    >
      <el-form-item
        :rules="formValidate.nullValueRule(true, '请输入套餐名称', ['change'])"
        label="套餐名称"
        prop="caeCoursePackageName"
      >
        <el-input
          v-model="formData.caeCoursePackageName"
          v-in-focus
          placeholder="请输入套餐名称"
        />
      </el-form-item>
    </etm-form>

    <div>
      <etm-title
        :border="false"
        :show-line="true"
      >
        套餐内容
      </etm-title>

      <div class="buttonGroup">
        <el-button
          v-for="attr in ['course', 'item', 'fee', 'type']"
          :key="attr"
          type="dashed"
          @click.stop="addCourseType(attr)"
        >
          <i class="el-icon-plus" />&nbsp;&nbsp;{{ popStaticList[attr].title }}
        </el-button>
      </div>
      <!-- TODO: 套餐列表 -->
      <nesting-table
        v-model="templateData"
        :map="map"
        :disable="!formData.modify"
        @del="deleteData"
      />
    </div>

    <etm-form
      ref="form2"
      type="dialog"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="锁定签约数量">
        <div>
          <el-switch v-model="formData.modify" />
        </div>
      </el-form-item>
      <el-form-item label="早教课时总计">
        {{ formData.lessonTotal }}
      </el-form-item>
      <el-form-item label="购买课时总计">
        {{ formData.buyLessonTotal }}
      </el-form-item>
      <el-form-item label="赠送课时总计">
        {{ formData.handselLessonTotal }}
      </el-form-item>
      <el-form-item label="总价">
        {{ formData.totalPrice }}
      </el-form-item>
      <el-form-item label="套餐简介">
        <el-input
          v-model="formData.introduction"
          type="textarea"
          placeholder="请输入套餐详细介绍"
        />
      </el-form-item>
      <el-form-item label="上传展示图片">
        <etm-upload-img
          :resource-name="'daycare/courseManage/earlySet'"
          :preview-src-list="formData.previewSrcLists"
          :preview-src-key="formData.previewSrcKey"
          @getImgList="getImgList"
        />
      </el-form-item>
      <el-form-item label="是否开启">
        <div>
          <el-switch v-model="formData.enable" />
        </div>
      </el-form-item>
    </etm-form>
    <!--    <etm-pop-->
    <!--      :visible="showPop"-->
    <!--      pop="complex"-->
    <!--      :title="popStaticList[addType].title"-->
    <!--      cancel-btn="取消"-->
    <!--      @open="showPop = true"-->
    <!--      @close="showPop = false"-->
    <!--      @confirm="handlePopConfirm"-->
    <!--      @cancel="showPop = false"-->
    <!--    >-->
    <!--      <component :is="popStaticList[addType].component" ref="pop" />-->
    <!--    </etm-pop>-->

    <etm-pop
      :visible="showPop"
      :title="btnType"
      cancle-btn="取消"
      pop="complex"
      @cancel="popCancel"
      @close="popCancel"
      @confirm="popConfirm"
    >
      <component
        :is="popType[popCurType]"
        v-if="popCurType"
        ref="pop"
      />
    </etm-pop>
  </div>
</template>
<script>
import etmUploadImg from '@/components/EtmUploadImg/index'
// import earlyCourse from './addPop/earlyCourse'
// import item from './addPop/item'
// import fee from './addPop/fee'
// import earlyType from './addPop/earlyType'
import nestingTable from '@/views/newDaycare/contract/components/nestingTable3'
import { queryEarlyDetail } from '@/api/newDaycare/courseManage'
// import { deepClone } from '@/views/daycare/contract/common'
import { getImgUrlRelativePath } from '@/utils'
import { toFixed } from '@/views/newDaycare/contract/common'
import { choiceClassMixin } from '@/views/newDaycare/contract/mixins/choiceClassMixin'
import formValidate from '@/utils/rules'
export default {
  components: {
    etmUploadImg,
    nestingTable
  },
  mixins: [choiceClassMixin],
  data () {
    return {
      formValidate,
      btnType: '',
      templateData: [],
      cacheTemplateIds: {
        CAE_COURSE: [],
        GOODS: [],
        PRICE: [],
        COURSE_TYPE: []
      },
      map: {
        id: 'id',
        name: 'name',
        netReceipts: 'paidPrice', // 实收
        give: 'giftQuantity', // 赠送
        receivable: 'receivablePrice', // 应收
        purchase: 'buyQuantity', // 购买
        img: 'img',
        netReceiptsNotes: 'paidTotalPrice', // 实收总额
        receivableNotes: 'receivableTotalPrice', // 应收总额
        cacSetMealEnum: 'cacSetMealEnum', // 类型
        childList: 'childList'
      },
      formData: {
        caeCoursePackageName: '',
        modify: false,
        lessonTotal: 0,
        buyLessonTotal: 0,
        handselLessonTotal: 0,
        totalPrice: 0.00,
        introduction: '',
        image: [],
        previewSrcLists: [],
        previewSrcKey: [],
        enable: true
      },
      rules: {
        caeCoursePackageName: [{
          required: true,
          message: '请输入套餐名称'
        }]
      },
      popStaticList: {
        course: {
          title: '添加早教课程',
          // component: earlyCourse,
          type: 'earlyCourse'
        },
        item: {
          title: '添加物品',
          // component: item,
          type: 'item'
        },
        fee: {
          title: '添加费用',
          //  component: fee,
          type: 'fee'
        },
        type: {
          title: '添加课程类型',
          //  component: earlyType,
          type: 'earlyType'
        }
      },
      showPop: false,
      addType: 'course', // 添加套餐内容的类型
      itemData: [{}]
    }
  },
  computed: {},
  watch: {
    templateData: {
      handler (n) {
        this.calcTotal()
      },
      deep: true
    }
  },
  methods: {
    addCourseType (attr) {
      this.btnType = this.popStaticList[attr].title
      this.selectEvent(this.popStaticList[attr].type)
    },
    popCancel () {
      this.showPop = false
    },
    getData (id) {
      queryEarlyDetail(id).then(res => {
        const { data } = res

        console.log(data.caeCoursePackageItemList)
        const result = data.caeCoursePackageItemList.map(cur => {
          // 写入缓存
          const _map = {
            PRICE: 'COST',
            GOODS: 'GOODS',
            CAE_COURSE: 'RURRICULUM',
            COURSE_TYPE: 'COURSE_TYPE'
          }
          this.cacheTemplate[_map[cur.type]].push(cur.caeCoursePackageItemId)

          // 字段兼容
          if (cur.image && cur.image.length) {
            cur.img = cur.image[0].url
          } else {
            cur.img = ''
          }
          cur.name = cur.itemName
          cur.id = cur.caeCoursePackageItemId
          cur.itemId = cur.caeCoursePackageItemId

          this.cacheTemplateIds[cur.type].push(cur.caeCoursePackageItemId)

          return cur
        })

        data.previewSrcLists = []
        data.previewSrcKey = []

        Array.isArray(data.image) && data.image.forEach(v => {
          data.previewSrcLists.push(v.url)
          data.previewSrcKey.push(getImgUrlRelativePath(v.url))
        })

        // console.log(this.cacheTemplate, result)
        this.templateData = result

        this.formData = data
      }).catch(err => {
        console.log(err)
      })
    },
    // deleteData(row) {
    //   const _index = this.cacheTemplateIds[row.type].indexOf(row.itemId)
    //   this.cacheTemplateIds[row.type].splice(_index, 1)
    // },
    deleteData (cur) {
      const _map = {
        PRICE: 'COST',
        GOODS: 'GOODS',
        CAE_COURSE: 'RURRICULUM',
        COURSE_TYPE: 'COURSE_TYPE'
      }
      this.cacheTemplate[_map[cur.type]].splice(
        this.cacheTemplate[_map[cur.type]].indexOf(cur.id),
        1
      )
    },
    getImgList (val, key) {
      this.formData.image = key.map((cur, index) => {
        return {
          name: 'earlySet',
          url: cur
        }
      })

      this.formData.previewSrcLists = val
      this.formData.previewSrcKey = key
    },
    popConfirmHandle (data) {
      // console.log(data, {
      //   id: 'id',
      //   name: 'name',
      //   netReceipts: 'paidPrice', // 实收
      //   give: 'giftQuantity', // 赠送
      //   receivable: 'receivablePrice', // 应收
      //   purchase: 'buyQuantity', // 购买
      //   img: 'img',
      //   netReceiptsNotes: 'paidTotalPrice', // 实收总额
      //   receivableNotes: 'receivableTotalPrice', // 应收总额
      //   cacSetMealEnum: 'cacSetMealEnum' // 类型
      // })

      const _map = {
        COST: 'PRICE',
        GOODS: 'GOODS',
        RURRICULUM: 'CAE_COURSE',
        COURSE_TYPE: 'COURSE_TYPE'
      }

      this.templateData = this.templateData.concat(data.map(cur => {
        return {
          id: cur.id,
          itemId: cur.id,
          name: cur.name,
          paidPrice: cur.netReceipts,
          giftQuantity: cur.give,
          receivablePrice: cur.receivable,
          buyQuantity: cur.purchase,
          img: cur.img,
          paidTotalPrice: cur.netReceiptsNotes,
          receivableTotalPrice: cur.receivableNotes,
          cacSetMealEnum: cur.cacSetMealEnum,
          type: _map[cur.cacSetMealEnum]
        }
      }))
    },
    // addItem(type) {
    //   console.log(type)
    //   return
    //   this.addType = type
    //   this.showPop = true
    //   this.$nextTick(() => {
    //     this.$refs.pop.getData()
    //   })
    // },
    // handlePopConfirm() {
    //   const result = this.$refs.pop.getSelectionData()
    //   this.showPop = false
    //
    //   const _result = result.list.map(cur => {
    //     const _result = {
    //       type: result.name,
    //       buyQuantity: 1,
    //       giftQuantity: 0,
    //       paidPrice: cur.price,
    //       receivablePrice: cur.price,
    //       paidTotalPrice: cur.price,
    //       receivableTotalPrice: cur.price
    //     }
    //
    //     switch (result.name) {
    //       case 'COURSE_TYPE' :
    //         _result.name = cur.teCourseTypeName
    //         _result.itemId = cur.teCourseTypeId
    //         break
    //       case 'CAE_COURSE' :
    //         _result.name = cur.caeCourseName
    //         _result.itemId = cur.caeCourseId
    //         break
    //       case 'PRICE' :
    //         _result.name = cur.priceName
    //         _result.itemId = cur.priceId
    //         break
    //       case 'GOODS' :
    //         _result.name = cur.materialName
    //         _result.itemId = cur.materialId
    //         break
    //       default :
    //         break
    //     }
    //     return _result
    //   })
    //
    //   /* 去重 */
    //   const _result2 = _result.filter(cur => {
    //     if (!this.cacheTemplateIds[cur.type].includes(cur.itemId)) {
    //       this.cacheTemplateIds[cur.type].push(cur.itemId)
    //       return true
    //     }
    //     return false
    //   })
    //
    //   this.templateData = this.templateData.concat(_result2)
    // },
    resetForm () {
      this.templateData = []
      this.cacheTemplateIds = {
        CAE_COURSE: [],
        GOODS: [],
        PRICE: [],
        COURSE_TYPE: []
      }
      this.cancelCache()
      this.formData = {
        ceaCoursePackageName: '',
        modify: false,
        lessonTotal: 0,
        buyLessonTotal: 0,
        handselLessonTotal: 0,
        totalPrice: 0.00,
        introduction: '',
        previewSrcLists: [],
        previewSrcKey: [],
        enable: true
      }

      this.$refs.form.$children[0].resetFields()
      this.$refs.form2.$children[0].resetFields()
    },
    calcTotal () {
      let buyLessonTotal = 0 // 购买课时总计
      let handselLessonTotal = 0 // 赠送课时总计
      let totalPrice = 0 // 实收总额

      this.templateData.forEach(cur => {
        if (cur.type === 'COURSE_TYPE' || cur.type === 'CAE_COURSE') {
          buyLessonTotal += toFixed(cur.buyQuantity)
          handselLessonTotal += toFixed(cur.giftQuantity)
        }
        totalPrice += toFixed(cur.paidTotalPrice)
      })

      this.formData.lessonTotal = buyLessonTotal + handselLessonTotal
      this.formData.buyLessonTotal = buyLessonTotal
      this.formData.handselLessonTotal = handselLessonTotal
      this.formData.totalPrice = totalPrice.toFixed(2)
    }
  }
}
</script>

<style scoped lang="scss">
.earlySet {
  .buttonGroup {

    margin-bottom: 16px;

    ::v-deep .el-button + .el-button {
      margin-left: 8px;
    }
  }
}
</style>
