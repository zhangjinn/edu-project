<template>
  <div class="custom">
    <setting-title no-setting>
      <span>填写记录</span>
    </setting-title>

    <div class="scrollWrap">
      <head-info ref="head" :type="type" :child-list="childList" />
      <!-- <div class="customize-wrap">
        <div class="name">
          <div>记录名称</div>
          <span>*</span>
        </div>
        <div class="text">
          <van-field
            v-model="record"
            maxlength="14"
            placeholder="请输入记录名称"
            show-word-limit
            readonly
          />
        </div>
      </div> -->
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
      type: this.$route.query.name,
      childList: this.$store.state.guardcare.dm_child,
      record: ''
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      const id = this.$route.query.id
      if (!id) return
      queryRecordItemDetail({ growthRecordId: id }).then(res => {
        const { textDesc, imageList, recordTime } = res.data.data
        this.$refs.text.imgUrl = imageList
        this.$refs.text.commentText = textDesc || ''
        this.$refs.head.time = transferDate(recordTime).clock
      }).catch(err => {
        console.log(err)
      })
    },
    async handleSubmit() { // 提交
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
            pArr.push(uploadFile(v.file, `guardcare/dailyManage/${this.type}`, 'image'))
          })
          await Promise.all(pArr).then(res => {
            res.forEach(v => {
              imageList.push({
                name: `guardcare/dailyManage/${this.type}` + Date.now(),
                url: v.data.key
              })
            })
          }).catch(err => {
            console.log(err)
          })
        }
      }

      if (this.$route.query.id) { // 存在id，修改
        updateRecordItem({
          recordIds: [this.$route.query.id],
          name: this.type,
          recordTime: (this.$route.query.date || transferDate().time) + ` ${this.$refs.head.time}:00`,
          textDesc: this.$refs.text.commentText,
          imageList,
          type: 'CUSTOM'
        }).then(res => {
          this.$toast('修改成功')
          this.$router.go(-1)
        })
      } else { // 不存在id，新增
        createRecordItem({
          childIds,
          name: this.type,
          recordTime: (this.$route.query.date || transferDate().time) + ` ${this.$refs.head.time}:00`,
          textDesc: this.$refs.text.commentText,
          imageList,
          type: 'CUSTOM'
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
.custom {
  .scrollWrap {
    height: calc(100vh - 84px);
    overflow-y: auto;
    padding-bottom: 16px;
  }
  .customize-wrap {
    margin: 13px auto 0;
    width: 351px;
    background-color: #fff;
    border-radius: 3px;
    .name {
      padding: 20px 12px;
      font-size: 15px;
      color: #222222;
      display: flex;
      align-items: center;
      border-bottom: #EEEEEE solid 1px;

      span {
        color: red;
      }
    }

    .text {
      ::v-deep .van-field__value {
        display: flex;
        justify-content: space-between;
      }
      border-radius: 4px;
      padding: 8px 0;
      ::v-deep .van-cell::after{
        display: none;
      }
    }
  }
}
</style>
