<template>
  <div class="detail">
    <el-carousel v-if="baseInfo.imageList.length>0" class="banner" trigger="click" height="200px">
      <el-carousel-item v-for="(item, index) in baseInfo.imageList" :key="index">
        <el-image :src="item.url" fit="contain" alt="" />
      </el-carousel-item>
    </el-carousel>
    <div v-else class="defaultImg">
      <img :src="defaultImg">
    </div>
    <div class="firstMsg">
      <etm-title :show-line="false" border>
        <div class="title">
          <span>{{ baseInfo.name }}</span>
        </div>
      </etm-title>
      <ul>
        <li>
          <etm-field-label type="left" label="菜肴分类">{{ baseInfo.type }}</etm-field-label>
          <etm-field-label type="left" label="是否开启">{{ baseInfo.enable }}</etm-field-label>
          <etm-field-label type="left" label="食材内容">
            <div v-for="(item,index) in baseInfo.ingredientsContent" :key="index">
              <span style="padding-right: 8px">{{ item.ingredientsTypeName }}--{{ item.ingredientsName }}</span>
              <span style="padding-right: 8px">{{ item.weight }}克</span>
              <span>{{ item.energy }}千卡</span>
            </div>
          </etm-field-label>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { getFoodDetail } from '@/api/newDaycare/recipesGuardManage'

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
        type: null,
        ingredientsContent: null,
        enable: null
      },
      defaultImg: require('@/assets/images/guardcare/img-jsxq.png')
    }
  },
  created() {
    this.queryDetail()
  },
  methods: {
    queryDetail() {
      getFoodDetail({
        foodId: this.itemId
      }).then((res) => {
        const { data } = res
        this.baseInfo.name = data.foodName
        this.baseInfo.type = data.typeName
        this.baseInfo.enable = data.enable ? '开启' : '关闭'
        this.baseInfo.imageList = data.imageList
        this.baseInfo.ingredientsContent = data.foodIngredientsList
      })
    }
  }
}
</script>

<style scoped lang="scss">
.detail {
  .el-image{
    width: 100%;
    height: 100%;
  }
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

  .desc {
    padding-bottom: 16px;
  }

  ::v-deep .EtmFieldLabel-wrap{
    padding-bottom: 0;
  }
}
</style>
