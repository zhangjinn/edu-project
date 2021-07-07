<template>
  <div class="headline-wrap">
    <etm-main-body>
      <etm-layout-split>
        <div v-if="listData.length" class="cardBox">
          <div v-for="(item, index) in listData" :key="index" class="card" @click="toUrl(item.linkUrl)">
            <div class="img">
              <img :src="item.image">
            </div>
            <div class="title">{{ item.title }}</div>
            <div class="introduction">{{ item.introduction || '暂无介绍' }}</div>
            <div class="footer">
              <div class="source">{{ item.source }}</div>
              <div class="createTime">{{ item.createTime }}</div>
            </div>
          </div>
        </div>
        <div v-else class="noData">
          <etm-empty />
        </div>
      </etm-layout-split>
    </etm-main-body>
  </div>

</template>

<script>/**
 * headline create by Administrator
 * createTime 2020/12/18 17:57
 */

import { queryIndustryHeadlinesList } from '@/api/base/dashboard'
import { parseTime } from '@/utils'

export default {
  name: 'Headline',
  components: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      listData: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getData()
  },
  mounted() {
  },
  methods: {
    getData() {
      queryIndustryHeadlinesList({}).then(res => {
        this.listData = res.data.content.map((item, index) => {
          item.createTime = parseTime(item.createTime, '{y}-{m}-{d}')
          return item
        })
      })
    },
    toUrl(url) {
      window.open(url, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.headline-wrap {
  .cardBox {
    display: flex;
    flex-wrap: wrap;
    padding: 24px 0 16px 44px;

    .card {
      margin: 0 40px 40px 0;
      width: 238px;
      border: 1px solid #eeeeee;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;

      &:hover {
        box-shadow: 0px 8px 20px 0px rgba(85, 85, 85, 0.1);
      }

      .img {
        width: 100%;
        height: 158px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .title {
        padding: 20px 12px 15px;
        height: 56px;
        line-height: 16px;
        font-size: 16px;
        @include c_text_color();
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .introduction {
        padding: 0 12px;
        height: 42px;
        @include c_secondary_color();
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .footer {
        display: flex;
        justify-content: space-between;
        padding: 20px 12px;

        .source {
          @include c_text_color();
        }

        .createTime {
          @include c_secondary_color();
        }
      }
    }
  }

  .noData {
    padding: 80px 0;
  }
}
</style>
