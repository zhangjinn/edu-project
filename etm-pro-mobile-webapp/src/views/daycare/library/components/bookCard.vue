<template>
  <div class="bookCard-wrap">
    <div class="content">
      <div
        v-for="(item, index) in borrowBookData"
        :key="index"
        class="book-detail"
      >
        <div
          v-if="item.showTopOp && item.childName"
          class="child-card"
        >
          <div class="child-info">
            <div v-if="item.avatar" class="avatar">
              <img
                v-if="item.avatar"
                :src="item.avatar"
                alt=""
              >
              <img v-else :src="gender[item.gender]" alt="">
            </div>
            <div class="child-name">{{ item.childName }}</div>
          </div>
          <div class="right-renewal" @click="rightRenewal(item)">立即续借</div>
        </div>
        <div class="book-detail-top">
          <div class="cover">
            <img v-if="item.cover && item.cover[0].url" :src="item.cover[0].url" alt="">
            <img v-else :src="bookDefaultCover" alt="">
          </div>
          <div class="book-info">
            <div class="book-name">
              <div class="name">{{ item.bookManageName }}</div>
              <template v-if="!item.borrowCount">
                <div v-if="item.count || item.count === 0" class="tip">无库存</div>
              </template>
              <template v-else>
                <div class="tip borrow-count">可借数量{{ item.count }}</div>
              </template>
              <div v-if="item.flag === false" class="tip" style="color: #F53939;">已逾期</div>
            </div>
            <div v-if="item.bookTypeName" class="tag">{{ item.bookTypeName }}</div>
            <div v-if="item.author || item.author === ''" class="author">作者：{{ item.author }}</div>
            <div v-if="item.childName" class="author">学员：{{ item.childName }}</div>
            <div v-if="item.publishingHouse || item.publishingHouse === ''" class="publisher">出版社：{{ item.publishingHouse }}</div>
            <div v-if="item.borrowingDate" class="borrow-date">借阅日期：{{ parseDate(item.borrowingDate) }}</div>
            <div v-if="item.dateOfExpiry" class="expire-date">到期日期：{{ parseDate(item.dateOfExpiry) }}</div>
            <div v-if="item.duration" class="borrow-duration">借阅时长：{{ item.duration }}个月</div>
          </div>
        </div>
        <!--        <div v-if="item.count" class="book-detail-bottom" @click="rightNowBorrow(item.id)">立即借阅</div>-->
      </div>
    </div>
  </div>

</template>

<script>
/**
 * bookCard create by 油麦菜
 * createTime 2020/11/27 14:52
 */
import {
  parseTime
} from '@/utils/date'
export default {
  name: 'BookCard',
  components: {},
  filters: {},
  mixins: [],
  props: {
    borrowBookData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      bookDefaultCover: require('@/assets/images/daycare/book-cover.png'),
      gender: {
        MALE: require('@/assets/images/daycare/defaultMale.png'),
        FEMALE: require('@/assets/images/daycare/defaultFemale.png')
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    parseDate(time) {
      return parseTime(time, '{y}-{m}-{d}')
    },
    rightRenewal(item) {
      this.$emit('libraryRenewal', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.bookCard-wrap {
  .content {
    padding: 12px 12px 0;
    .book-detail {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
      padding: 20px 16px;
      width: 351px;
      //height: 187px;
      background: #fff;
      border-radius: 10px;
      .child-card {
        display: flex;
        justify-content: space-between;
        margin-bottom: 17px;
        padding-bottom: 17px;
        border-bottom: 1px solid #EEEEEE;
        .child-info {
          display: flex;
          .avatar {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .child-name {
            margin-left: 8px;
            align-self: center;
            font-size: 16px;
            font-weight: 500;
            color: #181818;
          }
        }
        .right-renewal {
          align-self: center;
          width: 76px;
          height: 30px;
          line-height: 30px;
          background: #10C2C4;
          border-radius: 15px;
          font-size: 13px;
          font-weight: 500;
          color: #FFFFFF;
        }
      }
      .book-detail-top {
        display: flex;
        .cover {
          margin-right: 17px;
          width: 74px;
          height: 105px;
          //border: 1px solid;
        }
        .book-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          text-align: left;
          //border: 1px solid;
          .book-name {
            display: flex;
            justify-content: space-between;
            .name {
              font-size: 16px;
              font-weight: 500;
              color: #181818;
            }
            .tip {
              padding: 0 3px;
              height: 19px;
              background: #F5F5F5;
              border-radius: 4px;
              text-align: center;
              font-size: 12px;
              font-weight: 400;
              color: #666666;
              line-height: 19px;
            }
            .borrow-count {
              color: #049294;
            }
          }
          .tag {
            width: 56px;
            height: 20px;
            line-height: 18px;
            border: 1px solid #10C2C4;
            border-radius: 3px;
            text-align: center;
            font-size: 12px;
            font-weight: 400;
            color: #10C2C4;
          }
          .author {
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
          .publisher {
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
          .borrow-date {
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
          .expire-date {
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
          .borrow-duration {
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
          .child-name {
            font-size: 13px;
            font-weight: 400;
            color: #181818;
          }
        }
      }
      .book-detail-bottom {
        align-self: flex-end;
        margin-top: 12px;
        width: 76px;
        height: 30px;
        line-height: 30px;
        background: #10C2C4;
        border-radius: 15px;
        font-size: 13px;
        font-weight: 400;
        text-align: center;
        color: #FFFFFF;
      }
    }
  }
}
</style>
