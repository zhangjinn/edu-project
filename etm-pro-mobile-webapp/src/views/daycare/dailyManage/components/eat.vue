<template>
  <div class="eat-wrap">
    <div class="wrapper">
      <div class="title">食谱内容</div>
      <ul class="recipeList">
        <li
          v-for="(item, index) in recipeList"
          :key="index"
          :class="{active: checkedRecipe === index}"
          @click.stop="checkedRecipe = index"
        >
          <span>{{ item.timeQuantumName }} &nbsp;(&nbsp;{{ item.foodName }}&nbsp;)</span>
          <img v-show="checkedRecipe === index" src="../../../../assets/images/checked.png" alt="checked">
        </li>
      </ul>
    </div>
    <div class="wrapper">
      <div class="title">宝宝感受</div>
      <ul class="feelings">
        <li
          v-for="(item, index) in feelingsList"
          :key="index"
          @click.stop="checkedFeeling = index"
        >
          <img v-if="checkedFeeling !== index" :src="item.icon" :alt="item.name">
          <img v-else :src="item.active" :alt="item.name">
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
/**
 * eat create by Administrator
 * createTime 2020/11/09 16:57
 */
import { queryRecipe } from '@/service/daycare/dailyManage'
import { DateFormat } from '@/js/rules'

export default {
  name: 'Eat',
  components: {},
  filters: {},
  mixins: [],
  props: {
    updateList: {
      type: Object,
      default() {
        return {}
      }
    },
    way: {
      type: String,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      recipeList: [],
      feelingsList: [
        {
          name: '讨厌',
          active: require('../../../../assets/images/baby-feelings/hate_a.png'),
          icon: require('../../../../assets/images/baby-feelings/hate.png')
        },
        {
          name: '不太喜欢',
          active: require('../../../../assets/images/baby-feelings/notlike_a.png'),
          icon: require('../../../../assets/images/baby-feelings/notlike.png')
        },
        {
          name: '一般',
          active: require('../../../../assets/images/baby-feelings/normal_a.png'),
          icon: require('../../../../assets/images/baby-feelings/normal.png')
        },
        {
          name: '喜欢',
          active: require('../../../../assets/images/baby-feelings/like_a.png'),
          icon: require('../../../../assets/images/baby-feelings/like.png')
        },
        {
          name: '很喜欢',
          active: require('../../../../assets/images/baby-feelings/verylike_a.png'),
          icon: require('../../../../assets/images/baby-feelings/verylike.png')
        }
      ],
      checkedRecipe: undefined,
      checkedFeeling: undefined,
      newDate: '',
      childId: this.$route.query.childId,
      eatFeel: {
        'HATE': 0,
        'DONT_LIKE': 1,
        'GENERAL': 2,
        'LIKE': 3,
        'LIKE_MUCH': 4
      }
    }
  },
  computed: {},
  watch: {
    // checkedFeeling() {
    //   console.log(this.checkedFeeling)
    // },
    updateList: {
      deep: true,
      handler(n) {
        this.updateList = n
        this.getUpdateFood()
        this.getDate()
      }
    }
  },
  created() {
  },
  mounted() {
    this.getFood()
    // console.log(this.childId)
    // this.getDate()
  },
  methods: {
    getFood() {
      if (this.way !== 'update') {
        this.newDate = new Date()
        const data = DateFormat(this.newDate, 'yyyy-MM-dd')
        queryRecipe({ date: data, childIdList: this.childId }).then(res => {
          // console.log(res.data.data)
          this.recipeList = res.data.data
        })
      }
    },
    getDate() {
      this.checkedFeeling = this.eatFeel[this.updateList.contentObject.feel]
      this.getFood()
    },
    getUpdateFood() {
      this.newDate = this.updateList.startTime
      const data = DateFormat(this.newDate, 'yyyy-MM-dd')
      queryRecipe({ date: data, childIdList: this.childId }).then(res => {
        // console.log(res.data.data)
        this.recipeList = res.data.data
        for (let i = 0; i < this.recipeList.length; i++) {
          if (this.recipeList[i].recipeItemId === this.updateList.contentObject.recipeItemId) {
            this.checkedRecipe = i
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.eat-wrap {
  .wrapper {
    width: 351px;
    padding: 20px 16px 0;
    margin: 15px auto 0;
    border-radius: 3px;
    background-color: $white;
    text-align: left;

    .title {
      font-size: 15px;
    }

    .recipeList {
      padding: 20px 0 15px;

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 44px;
        border-radius: 4px;
        border: 1px solid $text-e;
        color: $text-9;
        line-height: 44px;
        text-indent: 12px;

        img {
          display: inline-block;
          width: 16px;
          height: 16px;
        }

        span {
          width: 319px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        & + li {
          margin-top: 12px;
        }

        &.active {
          color: $text-2;
          border-color: $theme;
          padding-right: 12px;

          span {
            width: 290px;
          }
        }
      }
    }

    .feelings {
      display: flex;
      justify-content: space-around;
      padding: 30px 0 17px;

      li {
        text-align: center;

        img {
          display: inline-block;
          width: 45px;
          height: 45px;
        }

        p {
          font-size: 12px;
          color: $text-9;
        }
      }
    }
  }
}
</style>
