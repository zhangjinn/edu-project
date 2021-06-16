<template>
  <div class="detail">
    <el-carousel
      v-if="baseInfo.imageList.length>0"
      class="banner"
      trigger="click"
      height="200px"
    >
      <el-carousel-item
        v-for="(item, index) in baseInfo.imageList"
        :key="index"
      >
        <img
          :src="item.url"
          alt=""
        >
      </el-carousel-item>
    </el-carousel>
    <div
      v-else
      class="defaultImg"
    >
      <img :src="defaultImg">
    </div>
    <div class="firstMsg">
      <etm-title
        :show-line="false"
        border
      >
        <div class="title">
          <span>{{ baseInfo.name }}</span>
          <etm-field-label label="单价 ¥">
            {{ baseInfo.unitPrice }}
          </etm-field-label>
        </div>
      </etm-title>
      <div
        v-if="baseInfo.desc"
        class="desc"
      >
        {{ baseInfo.desc }}
      </div>
    </div>
    <div class="secondMsg">
      <etm-title
        :show-line="false"
        border
      >
        <div class="title">
          <span>产品信息</span>
        </div>
      </etm-title>
      <ul>
        <li>
          <etm-field-label
            type="left"
            label="产品类型"
          >
            {{ baseInfo.type }}
          </etm-field-label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  queryProductDetail
} from '@/api/listSource/productCenter'

export default {
  name: 'Detail',
  props: {
    itemId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      baseInfo: {
        imageList: [],
        name: null,
        unitPrice: null,
        type: null,
        desc: null
      },
      defaultImg: require('@/assets/images/img-jsxq.png')
    }
  },
  created () {
    this.queryProductDetailData()
  },
  methods: {
    queryProductDetailData () {
      queryProductDetail({
        productId: this.itemId
      }).then((res) => {
        const { data } = res
        this.baseInfo.name = data.name
        this.baseInfo.unitPrice = data.unitPrice
        this.baseInfo.type = data.productTypeName
        this.baseInfo.desc = data.details
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
      height: 100%;
      width: 100%;
    }
  }

  .defaultImg {
    @include bgc_hover_color();
    height: 200px;
    margin-bottom: 16px;
    padding-top: 24px;
    text-align: center;
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

  .desc {
    padding-bottom: 16px;
  }

  ::v-deep .EtmFieldLabel-wrap {
    padding-bottom: 0;
  }
}
</style>
