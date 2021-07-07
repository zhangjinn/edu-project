<template>
  <div class="detail">
    <ul>
      <li>
        <el-carousel :interval="5000">
          <el-carousel-item v-for="it in dishes.image" :key="it.url">
            <el-image :src="it.url" style="width: 100%; height: 100%" />
          </el-carousel-item>
        </el-carousel>
      </li>
      <li>
        <div class="foodName">{{ dishes.foodName }}</div>
        <el-divider />
        <div class="text">{{ dishes.description }}</div>
      </li>
      <li>
        <div>菜肴信息</div>
        <!--        <etm-title :border="false" title="菜肴信息" />-->
        <el-divider />
        <etm-field-label label="菜肴类型">
          {{ dishes.foodTypeName }}
        </etm-field-label>
      </li>
    </ul>
  </div>
</template>

<script>
import { queryDaycareDishes } from '@/api/newDaycare/recipesManage'

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
      dishes: {}
    }
  },
  created() {
    this.getFoodDetailData()
  },
  methods: {
    getFoodDetailData() {
      queryDaycareDishes(this.itemId).then((res) => {
        this.dishes = res.data
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.detail {
  ul {
    li {
      margin-bottom: 20px;

      .foodName {
        @include etm-color();
        font-size: 18px;
      }

      .el-divider--horizontal {
        margin: 0 0 14px;
      }

      // todo 改为image
      .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 100px;
        margin: 0;
      }

      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
      }

      .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
      }

      // todo
    }
  }

}
</style>
