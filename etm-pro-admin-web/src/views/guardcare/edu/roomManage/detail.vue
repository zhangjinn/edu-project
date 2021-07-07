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
          <span>可容纳{{ baseInfo.capacity }}人</span>
        </div>
      </etm-title>
      <div v-if="baseInfo.desc" class="desc">
        {{ baseInfo.desc }}
      </div>
    </div>
    <div class="secondMsg">
      <etm-title :show-line="false" border>
        <div class="title">
          <span>场地信息</span>
        </div>
      </etm-title>
      <ul>
        <li>
          <etm-field-label type="left" label="场所类型">{{ baseInfo.type }}</etm-field-label>
        </li>
        <li>
          <etm-field-label type="left" label="负责人">{{ baseInfo.principal }}</etm-field-label>
        </li>
        <!--      <li><etm-field-label label="员工可预定">{{ baseInfo.inStock }}</etm-field-label></li>-->
      </ul>
    </div>
  </div>
</template>

<script>
import {
  getRoomItem
} from '@/api/guardcare/edu/roomManage'

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
        capacity: null,
        type: null,
        principal: null,
        desc: null
        // enable: null
      },
      defaultImg: require('@/assets/images/guardcare/img-jsxq.png')
    }
  },
  created() {
    this.getRoomItemData()
  },
  methods: {
    getRoomItemData() {
      const id = this.itemId
      getRoomItem(id).then((res) => {
        const { data } = res
        this.baseInfo.name = data.name
        this.baseInfo.capacity = data.num
        this.baseInfo.type = data.roomType
        this.baseInfo.principal = data.employeeName
        this.baseInfo.desc = data.description
        this.baseInfo.imageList = data.attachment
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

  .desc {
    padding-bottom: 16px;
  }

}
</style>
