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
        </div>
      </etm-title>
      <div
        v-if="baseInfo.description"
        class="description"
      >
        {{ baseInfo.description }}
      </div>
    </div>
    <div class="secondMsg">
      <etm-title
        :show-line="false"
        border
      >
        <div class="title">
          <span>菜肴信息</span>
        </div>
      </etm-title>
      <ul>
        <li>
          <etm-field-label
            type="left"
            label="菜肴类型"
          >
            {{ baseInfo.type }}
          </etm-field-label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import { queryFoodDetail } from '@/api/standardcare/listFeatures/recipesManage'

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
        type: null,
        description: null
      },
      defaultImg: require('@/assets/images/img-jsxq.png')
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      queryFoodDetail({
        foodId: this.itemId
      }).then((res) => {
        const { data } = res
        this.baseInfo.name = data.name
        this.baseInfo.type = data.typeName
        this.baseInfo.description = data.description
        this.baseInfo.imageList = []
        if (data.image) {
          this.baseInfo.imageList.push({
            url: data.image
          })
        }
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

  .description {
    padding-bottom: 16px;
  }

}
</style>
