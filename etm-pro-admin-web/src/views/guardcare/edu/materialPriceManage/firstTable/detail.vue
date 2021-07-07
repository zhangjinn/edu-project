<template>
  <div class="detail">
    <el-carousel v-if="baseInfo.imageList.length>0" class="banner" trigger="click" height="200px">
      <el-carousel-item v-for="(item, index) in baseInfo.imageList" :key="index">
        <img :src="item.url" alt="">
      </el-carousel-item>
    </el-carousel>
    <div v-else class="defaultImg">
      <img :src="defaultImg">
    </div>
    <div class="firstMsg">
      <etm-title :show-line="false" border>
        <div class="title">
          <span>{{ baseInfo.name }}</span>
          <span>单价 ¥ : {{ baseInfo.price }}</span>
        </div>
      </etm-title>

      <div v-if="baseInfo.desc" class="desc">
        {{ baseInfo.desc }}
      </div>
    </div>
    <div class="secondMsg">
      <etm-title :show-line="false" border>
        <div class="title">
          <span>物品信息</span>
        </div>
      </etm-title>
      <ul>
        <li>
          <etm-field-label type="left" label="物品类型">{{ baseInfo.type }}</etm-field-label>
        </li>
        <li>
          <etm-field-label type="left" label="入库总数">{{ baseInfo.reserve }}{{ baseInfo.unit }}</etm-field-label>
        </li>
        <li>
          <etm-field-label type="left" label="库存数量">{{ baseInfo.stock }}{{ baseInfo.unit }}</etm-field-label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  getMaterialItem
} from '@/api/guardcare/edu/materialPriceManage'

export default {
  name: 'Detail',
  props: {
    itemId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      baseInfo: {
        imageList: [],
        name: null,
        price: null,
        desc: null,
        type: null,
        reserve: null,
        stock: null,
        unit: null
      },
      defaultImg: require('@/assets/images/guardcare/img-wpgl.png')
    }
  },
  created() {
    this.getMaterialItemData()
  },
  methods: {
    getMaterialItemData() {
      const materialId = this.itemId
      getMaterialItem(materialId).then((res) => {
        const { data } = res
        this.baseInfo.name = data.materialName
        this.baseInfo.price = data.sellPrice
        this.baseInfo.desc = data.detail
        this.baseInfo.type = data.materialTypeName
        this.baseInfo.reserve = data.reserve
        this.baseInfo.stock = data.stock
        this.baseInfo.unit = data.unit
        this.baseInfo.imageList = data.imageList
      })
    }
  }
}
</script>

<style scoped lang="scss">
.detail {
  .banner {
    margin-bottom: 16px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .defaultImg {
    margin-bottom: 16px;
    padding-top: 24px;
    height: 200px;
    text-align: center;
    @include bgc_hover_color();
  }

  .firstMsg {
    padding-bottom: 16px;
  }

  .title {
    display: flex;
    justify-content: space-between;

    span:nth-child(1) {
      @include c_title_color();
    }

    span:nth-child(2) {
      @include etm-color();
    }
  }

}
</style>
