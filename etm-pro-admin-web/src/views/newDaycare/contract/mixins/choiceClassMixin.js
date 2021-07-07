import fee from '@/views/newDaycare/contract/components/addPop/fee'
import feeCare from '@/views/newDaycare/contract/components/addPop/feeCare'
import nurseCourse from '@/views/newDaycare/contract/components/addPop/nurseCourse' // 课程
// const nurseCourse = () => import('@/views/daycare/contract/components/addPop/nurseCourse') // 课程
import earlySetMeal from '@/views/newDaycare/contract/components/addPop/earlySetMeal'
import earlyCourse from '@/views/newDaycare/contract/components/addPop/earlyCourse' // 课程
import earlyType from '@/views/newDaycare/contract/components/addPop/earlyType' // 类型
import nurseType from '@/views/newDaycare/contract/components/addPop/nurseType'
import nurseSetMeal from '@/views/newDaycare/contract/components/addPop/nurseSetMeal' // 套餐
import item from '@/views/newDaycare/contract/components/addPop/item'

export const choiceClassMixin = {
  components: {
    fee,
    feeCare,
    nurseCourse, // 课程
    earlySetMeal,
    earlyCourse, // 课程
    earlyType, // 类型
    nurseType,
    nurseSetMeal, // 套餐
    item
  },
  data() {
    return {
      popCurType: '',
      cacheTemplate: {
        'SET_MEAL': [],
        'COURSE_TYPE': [],
        'RURRICULUM': [],
        'GOODS': [],
        'COST': []
      },
      typeName: '',
      popType: {
        fee,
        feeCare,
        nurseCourse,
        nurseType,
        nurseSetMeal,
        earlySetMeal,
        earlyCourse,
        earlyType,
        item
      }
    }
  },
  methods: {
    selectEvent(name, typeName) {
      if (this['selectDiy'] && this.selectDiy()) {
        return
      }

      this.typeName = typeName
      this.popCurType = name
      this.showPop = true

      this.$nextTick(() => {
        this.$refs.pop.getData()
      })
    },
    cancelCache() {
      this.cacheTemplate = {
        'SET_MEAL': [],
        'COURSE_TYPE': [],
        'RURRICULUM': [],
        'GOODS': [],
        'COST': []
      }
    },
    // 子弹窗确认事件
    popConfirm() {
      const selection = this.$refs.pop.getSelectionData()
      // console.log(selection)
      let _list = []
      let list = []
      const _cache = []
      let isExist = false
      // 数据去重

      if (!selection.list) {
        return false
      }
      selection.list.forEach(cur => {
        switch (selection.name) {
          case 'PRICE':
            if (!this.cacheTemplate['COST'].includes((cur.priceId))) {
              _cache.push(cur)
            } else {
              isExist = '费用'
            }
            break
          case 'GOODS':
            if (!this.cacheTemplate['GOODS'].includes((cur.materialId))) {
              _cache.push(cur)
            } else {
              isExist = '物品'
            }
            break
          case 'CAE_COURSE':
            if (!this.cacheTemplate['RURRICULUM'].includes((cur.caeCourseId || cur.teCourseId))) {
              _cache.push(cur)
            } else {
              isExist = '课程'
            }
            break
          case 'COURSE_TYPE':
            if (!this.cacheTemplate['COURSE_TYPE'].includes((cur.teCourseTypeId || cur.caeCourseTypeId))) {
              _cache.push(cur)
            } else {
              isExist = '课程类型'
            }
            break
          case 'SET_MEAL':
            _list = cur.teCoursePackageItemList || cur.caeCoursePackageItemList
            if (!this.cacheTemplate['SET_MEAL'].includes((cur.teCoursePackageId || cur.caeCoursePackageId))) {
              _cache.push(cur)
            } else {
              isExist = '套餐'
            }
            break
        }
      })

      // 做数据兼容
      const _result = _cache.map(cur => {
        switch (selection.name) {
          case 'PRICE':
            this.cacheTemplate['COST'].push(cur.priceId)
            return {
              id: cur.priceId,
              name: cur.priceName,
              modify: cur.modify,
              netReceipts: cur.price,
              receivable: cur.price,
              purchase: 1,
              give: 0,
              img: cur['img'] !== '--' ? (cur['img'] || '') : '',
              receivableNotes: cur.price,
              netReceiptsNotes: cur.price,
              cacSetMealEnum: 'COST'
              // childList: null
            }

          case 'GOODS':
            this.cacheTemplate['GOODS'].push(cur.materialId)
            return {
              id: cur.materialId,
              name: cur.materialName,
              modify: false,
              netReceipts: cur.price,
              receivable: cur.price,
              purchase: 1,
              give: 0,
              img: cur['img'] !== '--' ? (cur['img'] || '') : '',
              receivableNotes: cur.price,
              netReceiptsNotes: cur.price,
              cacSetMealEnum: selection.name
            }
          case 'CAE_COURSE':
            this.cacheTemplate['RURRICULUM'].push(cur.caeCourseId || cur.teCourseId)
            return {
              id: cur.caeCourseId || cur.teCourseId,
              name: cur.caeCourseName || cur.teCourseName,
              modify: false,
              netReceipts: cur.price,
              receivable: cur.price,
              img: cur['img'] !== '--' ? (cur['img'] || '') : '',
              purchase: 1,
              give: 0,
              receivableNotes: cur.price,
              netReceiptsNotes: cur.price,
              cacSetMealEnum: 'RURRICULUM'
            }
          case 'COURSE_TYPE':
            this.cacheTemplate['COURSE_TYPE'].push(cur.teCourseTypeId || cur.caeCourseTypeId)
            return {
              id: cur.teCourseTypeId || cur.caeCourseTypeId,
              name: cur.teCourseTypeName || cur.caeCourseTypeName,
              modify: false,
              netReceipts: cur.price,
              receivable: cur.price,
              img: cur['img'] !== '--' ? (cur['img'] || '') : '',
              purchase: 1,
              give: 0,
              receivableNotes: cur.price,
              netReceiptsNotes: cur.price,
              cacSetMealEnum: selection.name
            }
          case 'SET_MEAL':
            console.log(cur, 'tc')
            _list = cur.teCoursePackageItemList || cur.caeCoursePackageItemList

            this.cacheTemplate['SET_MEAL'].push(cur.teCoursePackageId || cur.caeCoursePackageId)

            list = _list.map(c => {
              const _t = c.type === 'CAE_COURSE' ? 'RURRICULUM' : (c.type === 'PRICE' ? 'COST' : c.type)
              this.cacheTemplate[_t].push(c.teCoursePackageItemId || c.caeCoursePackageItemId)

              return {
                id: c.teCoursePackageItemId || c.caeCoursePackageItemId,
                name: c.itemName,
                netReceipts: c.paidPrice, // 实收
                give: c.giftQuantity || 0, // 赠送
                receivable: c.receivablePrice, // 应收
                purchase: c.buyQuantity, // 购买
                img: c['img'] !== '--' ? (c['img'] || '') : '',
                netReceiptsNotes: c.paidTotalPrice, // 实收总额
                receivableNotes: c.receivableTotalPrice, // 应收总额
                cacSetMealEnum: _t // 类型
              }
            })

            return {
              id: cur.teCoursePackageId || cur.caeCoursePackageId,
              name: cur.teCoursePackageName || cur.caeCoursePackageName,
              modify: cur.modify,
              netReceipts: '',
              receivable: '',
              img: cur['img'] !== '--' ? (cur['img'] || '') : '',
              purchase: 1,
              give: 1,
              receivableNotes: cur.totalPrice,
              netReceiptsNotes: cur.totalPrice,
              cacSetMealEnum: selection.name,
              childList: list
            }
        }
      })

      // console.log(this.cacheTemplate, 'x-x-x-x-x-x')
      if (isExist) {
        this.$message({
          type: 'warning',
          message: '已存在部分' + isExist
        })
      }

      if (this['popConfirmHandle']) {
        this.popConfirmHandle(_result)
      }

      this.showPop = false
    }
  }
}

