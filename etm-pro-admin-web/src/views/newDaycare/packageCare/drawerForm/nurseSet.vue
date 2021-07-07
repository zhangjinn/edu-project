<template>
  <div class="earlySet">
    <!--    <el-carousel v-if="imgArr.length" height="200px">-->
    <!--      <el-carousel-item v-for="(img, index) in imgArr" :key="index">-->
    <!--        <el-image :src="img" fit="contain">-->
    <!--          <div slot="placeholder" class="image-slot">-->
    <!--            加载中<span class="dot">...</span>-->
    <!--          </div>-->
    <!--        </el-image>-->
    <!--      </el-carousel-item>-->
    <!--    </el-carousel>-->
    <!--    <etm-title :show-line="false" border>-->
    <!--      <etm-text type="primary">{{ name }}</etm-text>-->
    <!--      <div slot="tool">-->
    <!--        <etm-text type="primary">总价 ￥{{ price }}</etm-text>-->
    <!--      </div>-->
    <!--    </etm-title>-->
    <!--    <div class="text">-->
    <!--      {{ description }}-->
    <!--    </div>-->
    <el-row style="margin-bottom: 16px">
      <el-col span="10">
        <el-carousel v-if="imgArr.length" height="200px">
          <el-carousel-item v-for="(img, index) in imgArr" :key="index">
            <el-image :src="img" fit="contain">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </el-carousel-item>
        </el-carousel>
        <div v-else class="imgPlaceholder"><img src="../../../../assets/images/etm-logo.png"></div>
      </el-col>
      <el-col span="12" :offset="1">
        <div class="earlySetDetail">
          <p>{{ name }}</p>
          <p>
            <etm-text type="primary">￥{{ price }}</etm-text>
          </p>
          <div class="text">
            {{ description }}
          </div>
        </div>
      </el-col>
    </el-row>

    <etm-title :show-line="true" :border="false">套餐内容</etm-title>
    <!-- todo: 套餐列表 -->
    <nesting-table v-model="templateData" :map="map" :disable="false" :is-delete="false" />
    <!--    <etm-form type="dialog">-->
    <!--      <el-form-item label="早教课时总计">-->
    <!--        {{ lessonTotal }}-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="购买课时总计">-->
    <!--        {{ buyLessonTotal }}-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="赠送课时总计">-->
    <!--        {{ handselLessonTotal }}-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="锁定签约数量">-->
    <!--        {{ modify }}-->
    <!--      </el-form-item>-->
    <!--    </etm-form>-->
    <div>
      <!--      <etm-field-label label="托育天数总计" type="left">{{ lessonTotal }}</etm-field-label>-->
      <!--      <etm-field-label label="购买天数总计" type="left">{{ buyLessonTotal }}</etm-field-label>-->
      <!--      <etm-field-label label="赠送天数总计" type="left">{{ handselLessonTotal }}</etm-field-label>-->
      <etm-field-label label="锁定签约数量" type="left">{{ modify }}</etm-field-label>
    </div>
  </div>
</template>
<script>
import { queryNurseDetail } from '@/api/newDaycare/courseManage'
import nestingTable from '@/views/newDaycare/contract/components/nestingTable3'

export default {
  components: {
    nestingTable
  },
  data() {
    return {
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
      imgArr: [],
      name: '',
      price: 0.00,
      description: '',
      modify: '',
      handselLessonTotal: 0,
      lessonTotal: 0,
      buyLessonTotal: 0,
      templateData: []
    }
  },
  computed: {},
  methods: {
    getData(id) {
      // console.log(id)
      queryNurseDetail(id).then(res => {
        const { data } = res

        this.name = data.caeCoursePackageName
        this.price = data.totalPrice
        this.early = data.caeCoursePackageItemList
        this.description = data.introduction || '无'
        this.totalPrice = data.totalPrice

        this.buyLessonTotal = data.buyLessonTotal
        this.lessonTotal = data.lessonTotal
        this.handselLessonTotal = data.handselLessonTotal
        this.modify = data.modify ? '是' : '否'

        data.caeCoursePackageItemList.forEach((cur) => {
          cur.name = cur.itemName
          cur.itemId = cur.caeCoursePackageItemId
        })

        this.templateData = data.caeCoursePackageItemList.map(cur => {
          if (cur['image'] && cur['image'].length) {
            cur.img = cur['image'][0].url
          } else {
            cur.img = ''
          }

          return cur
        })
        this.imgArr = []
        Array.isArray(data.image) && data.image.forEach(v => {
          this.imgArr.push(v.url)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">

.earlySet {
  .imgPlaceholder {
    height: 200px;
    background: #eee;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
  }

  & > > > .el-carousel {
    margin-bottom: 16px;
  }

  & > > > .el-image {
    height: 200px;
  }

  .text {
    margin-bottom: 16px;
  }

  .earlySetDetail {
    p {
      margin-bottom: 8px;

      &:first-child {
        font-weight: bold;
      }
    }

    & > div {
      color: #999;
    }
  }
}
</style>
