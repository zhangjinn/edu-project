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
          <span>课程信息</span>
        </div>
      </etm-title>
      <ul>
        <li>
          <etm-field-label type="left" label="上课课时长">{{ baseInfo.courseHour }}</etm-field-label>
        </li>
        <li>
          <etm-field-label type="left" label="适用年龄">{{ baseInfo.age }}</etm-field-label>
        </li>
        <li>
          <etm-field-label type="left" label="满班人数">{{ baseInfo.num }}</etm-field-label>
        </li>
      </ul>
    </div>
    <div class="childInfoTitle">
      <div>已报名幼儿 ({{ tableData.length }})</div>
      <el-button plain :disabled="tableData.length<1" @click="handleExport">导出Excel</el-button>
    </div>
    <childList :table-data="tableData" />
  </div>
</template>

<script>
import childList from './childList'
import { parseTime } from '@/utils'
import { downloadFileForUrl } from '@/utils/file'
import {
  getCourseSpecialItem,
  getSpecialChild,
  exportChildExcel
} from '@/api/guardcare/edu/courseManage'

export default {
  name: 'Detail',
  components: {
    childList
  },
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
        courseHour: null,
        age: null,
        num: null

      },
      tableData: [],
      defaultImg: require('@/assets/images/guardcare/img-tykc.png')
    }
  },
  created() {
    this.getCourseSpecialItemData()
  },
  methods: {
    getCourseSpecialItemData() {
      const id = this.itemId
      getCourseSpecialItem(id).then((res) => {
        const { data } = res
        this.baseInfo.imageList = data.attachment
        this.baseInfo.name = data.name
        this.baseInfo.price = data.price
        this.baseInfo.desc = data.introduction
        this.baseInfo.courseHour = data.courseHour
        this.baseInfo.age = data.age
        this.baseInfo.num = data.num
      })

      const param = {
        specialCourseId: id,
        paged: false
      }
      getSpecialChild(param).then((res) => {
        this.tableData = res.data
        this.tableData.map((val) => {
          val.gender = val.gender === 'MALE' ? '男' : '女'
          val.signDate = parseTime(val.signDate, '{y}-{m}-{d}')
        })
      })
    },
    handleExport() {
      const id = this.itemId
      const param = {
        specialCourseId: id,
        paged: false
      }

      exportChildExcel(param).then(res => {
        downloadFileForUrl(res)
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

  .childInfoTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
}
</style>
