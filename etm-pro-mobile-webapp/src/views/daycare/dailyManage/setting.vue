<template>
  <div class="setting-wrap">
    <setting-title no-setting>
      <span class="settingHeader">设置</span>
    </setting-title>
    <div class="content">
      <ul>
        <li v-for="(item, index) in behaviorList" :key="index">
          <span>{{ item.diarySettingName || '-' }}</span>
          <div><i v-if="item.deleteFlag" class="iconfont iconminus-circle" @click.stop="deleteItem(index, item)" />
            <van-switch
              v-model="item.enable"
              active-color="#10C2C4"
              inactive-color="#F5F5F5"
              size="24px"
              @change="settingChange(item)"
            />
          </div>
        </li>
      </ul>
      <div class="add" @click.stop="showAdd = true">
        <i class="iconfont iconplus-circle" />
        &nbsp;添加
      </div>
    </div>
    <van-popup v-model="showAdd" closeable>
      <div class="popWrap">
        <van-field v-model="addItemText" placeholder="输入项目" />
        <div class="btns">
          <van-button type="primary" @click.stop="addItem">保存</van-button>
          <van-button type="default" @click.stop="showAdd = false; addItemText= ''">取消</van-button>
        </div>
      </div>
    </van-popup>
  </div>

</template>

<script>
/**
 * setting create by Administrator
 * createTime 2020/11/03 19:15
 */
import settingTitle from './components/settingTitle'
import { querySettings, createSetting, removeSetting, updateSetting } from '@/service/daycare/dailyManage'
import { Switch, Dialog } from 'vant'

export default {
  name: 'Setting',
  components: { settingTitle, 'van-switch': Switch },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      behaviorList: [],
      showAdd: false,
      addItemText: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getSetting()
  },
  mounted() {
  },
  methods: {
    getSetting() {
      querySettings().then(res => {
        console.log(res.data.data)
        this.behaviorList = res.data.data
      })
    },
    addItem() {
      this.addItemText = this.addItemText.trim()
      if (!this.addItemText.length) return this.$toast('内容不能为空')
      createSetting({ diarySettingName: this.addItemText, enable: false }).then(res => {
        // console.log(res.data.data)
        this.$toast('新增成功')
        this.behaviorList.push(res.data.data)
        this.showAdd = false
        this.addItemText = ''
      })
    },
    deleteItem(index, item) {
      Dialog.confirm({
        title: '是否删除',
        confirmButtonColor: '#10C2C4'
      }).then(() => {
        removeSetting({ diarySettingId: item.diarySettingId }).then(res => {
          this.$toast('删除成功')
          this.behaviorList.splice(index, 1)
        })
      })
        .catch(() => {
          // on cancel
        })
    },
    settingChange(item) {
      updateSetting({
        diarySettingId: item.diarySettingId,
        name: item.diarySettingName,
        enable: item.enable
      }).then(() => {
        this.$toast('更新成功')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.setting-wrap {
  .settingHeader {
    font-size: 15px;
    color: $white;
  }

  .content {
    padding-bottom: 50px;

    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 46px;
        padding: 0 20px;
        border-bottom: 1px solid $text-e;
        background-color: #fff;

        i {
          color: $red;
          display: inline-block;
          margin-right: 16px;
        }

        div {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }

    .add {
      // height: 46px;
      line-height: 46px;
      text-align: left;
      // display: flex;
      // align-items: center;
      background-color: #fff;
      padding: 0 32px;
      color: $theme;
    }
  }

  .popWrap {
    width: 300px;
    height: 180px;
    padding: 40px 16px 0;

    ::v-deep .van-cell {
      margin-bottom: 30px;
    }

    .btns {
      display: flex;
      justify-content: space-around;
    }

    ::v-deep .van-button {
      line-height: 38px;
      height: 38px;

      &.van-button--primary {
        background-color: $theme;
        border-color: $theme;
      }
    }
  }
}
</style>
