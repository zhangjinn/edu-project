<template>
  <div class="eat">
    <setting-title no-setting>
      <span>填写记录</span>
    </setting-title>

    <div class="scrollWrap">
      <head-info ref="head" type="进食" :child-list="childList" />
      <div class="wrapper">
        <div class="title">食谱内容（必填）</div>
        <ul class="recipeList">
          <li
            v-for="item in recipeList"
            :key="item.recipeItemId"
            :class="{active: checkedRecipe === item.recipeItemId}"
            @click.stop="checkedRecipe = item.recipeItemId; foodContent = item.text"
          >
            <span>{{ item.text }}</span>
            <img v-show="checkedRecipe === item.recipeItemId" src="../../../../../assets/images/checked.png" alt="checked">
          </li>
        </ul>
      </div>
      <div class="wrapper">
        <div class="title">宝宝感受</div>
        <ul class="feelings">
          <li
            v-for="item in feelingsList"
            :key="item.prop"
            @click.stop="checkedFeeling = item.prop"
          >
            <img v-if="checkedFeeling !== item.prop" :src="item.icon" :alt="item.name">
            <img v-else :src="item.active" :alt="item.name">
            <p>{{ item.name }}</p>
          </li>
        </ul>
      </div>
      <text-des ref="text" />
    </div>
    <bottom-btn @finish="handleSubmit" />
  </div>
</template>
<script>
import settingTitle from '../../../components/settingTitle'
import headInfo from '../../components/headInfo'
import textDes from '../../components/textDes'
import bottomBtn from '../../components/bottomBtn'
import {
  createRecordItem,
  queryRecipeList,
  updateRecordItem,
  queryRecordItemDetail
} from '../../../../../service/guardcare/dailyManage'
import { uploadFile } from '../../../../../service/upload'
import { transferDate } from '../../../../../js/rules'
export default {
  components: {
    settingTitle,
    headInfo,
    textDes,
    bottomBtn
  },
  data() {
    return {
      recipeList: [],
      feelingsList: [
        { name: '讨厌', prop: 'hate', active: require('../../../../../assets/images/baby-feelings/hate_a.png'), icon: require('../../../../../assets/images/baby-feelings/hate.png') },
        { name: '不太喜欢', prop: 'not_really_like', active: require('../../../../../assets/images/baby-feelings/notlike_a.png'), icon: require('../../../../../assets/images/baby-feelings/notlike.png') },
        { name: '一般', prop: 'general', active: require('../../../../../assets/images/baby-feelings/normal_a.png'), icon: require('../../../../../assets/images/baby-feelings/normal.png') },
        { name: '喜欢', prop: 'like', active: require('../../../../../assets/images/baby-feelings/like_a.png'), icon: require('../../../../../assets/images/baby-feelings/like.png') },
        { name: '很喜欢', prop: 'very_like', active: require('../../../../../assets/images/baby-feelings/verylike_a.png'), icon: require('../../../../../assets/images/baby-feelings/verylike.png') }
      ],
      checkedRecipe: undefined,
      checkedFeeling: undefined,
      foodContent: '',
      childList: this.$store.state.guardcare.dm_child
    }
  },
  created() {
    this.getInfo()
    if (this.childList.length) {
      queryRecipeList({ childId: this.childList[0].childId }).then(res => {
        const { data } = res.data
        data.forEach(v => {
          let text = v.timeQuantumName
          if (Array.isArray(v.foodVOList) && v.foodVOList.length) {
            text += '('
            v.foodVOList.forEach(food => {
              text += food.foodName + ' '
            })
            text = text.slice(0, -1)
            text += ')'
          }
          v.text = text
        })
        this.recipeList = data
      }).catch(err => {
        console.log(err)
      })
    } else {
      this.recipeList = []
    }
  },
  methods: {
    getInfo() {
      const id = this.$route.query.id
      if (!id) return
      queryRecordItemDetail({ growthRecordId: id }).then(res => {
        const { textDesc, imageList, recordTime, dining: { babyFeelingType, recipeItemId, recipeContent }} = res.data.data
        this.$refs.text.imgUrl = imageList
        this.$refs.text.commentText = textDesc || ''
        this.$refs.head.time = transferDate(recordTime).clock
        this.checkedFeeling = babyFeelingType
        this.checkedRecipe = recipeItemId
        this.foodContentv = recipeContent
      }).catch(err => {
        console.log(err)
      })
    },
    async handleSubmit() { // 提交
      // if (!this.checkedFeeling) return this.$toast('请选择宝宝感受')
      if (!this.checkedRecipe) return this.$toast('请选择食谱内容')
      // 处理childIds
      const childIds = []
      this.childList.forEach(v => {
        childIds.push(v.childId)
      })

      let imageList = []
      if (this.$refs.text.imgUrl.length) { // 需要上传图片
        if (this.$route.query.id) {
          imageList = this.$refs.text.imgUrl
        } else {
          const pArr = []
          this.$refs.text.imgUrl.forEach(v => {
            pArr.push(uploadFile(v.file, 'guardcare/dailyManage/eat', 'image'))
          })
          await Promise.all(pArr).then(res => {
            res.forEach(v => {
              imageList.push({
                name: 'guardcare/dailyManage/eat' + Date.now(),
                url: v.data.key
              })
            })
          }).catch(err => {
            console.log(err)
          })
        }
      }

      if (this.$route.query.id) {
        updateRecordItem({
          recordIds: [this.$route.query.id],
          name: '进食',
          recordTime: (this.$route.query.date || transferDate().time) + ` ${this.$refs.head.time}:00`,
          textDesc: this.$refs.text.commentText,
          imageList,
          type: 'DINING',
          dining: {
            babyFeelingType: this.checkedFeeling,
            recipeItemId: this.checkedRecipe,
            recipeContent: this.foodContent
          }
        }).then(res => {
          this.$toast('修改成功')
          this.$router.go(-1)
        })
      } else {
        createRecordItem({
          childIds,
          name: '进食',
          recordTime: (this.$route.query.date || transferDate().time) + ` ${this.$refs.head.time}:00`,
          textDesc: this.$refs.text.commentText,
          imageList,
          type: 'DINING',
          dining: {
            babyFeelingType: this.checkedFeeling,
            recipeItemId: this.checkedRecipe,
            recipeContent: this.foodContent
          }
        }).then(res => {
          this.$toast('新增成功')
          this.$router.go(-1)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.eat {
  .scrollWrap {
    height: calc(100vh - 84px);
    overflow-y: auto;
    padding-bottom: 16px;
  }
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
