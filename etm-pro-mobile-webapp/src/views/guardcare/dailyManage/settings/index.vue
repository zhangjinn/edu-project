<template>
  <div class="setting">
    <setting-title no-setting>
      <span>设置</span>
    </setting-title>
    <ul class="settings">
      <li v-for="(item, index) in settingList" :key="index">
        <div>{{ item.name }}</div>
        <div class="ctl">
          <i v-show="item.type === 'CUSTOM'" class="iconfont iconminus-circle" @click="handleDelete(item)" />
          <van-switch v-model="item.enable" size="21px" active-color="#10C2C4" inactive-color="#E6E6E6" @change="handleChange(item)" />
        </div>
      </li>
    </ul>
    <div class="bottomBtn">
      <span @click.stop="showAdd = true">添加</span>
    </div>
    <van-popup v-model="showAdd" closeable>
      <div class="popWrap">
        <van-field v-model="addItemText" placeholder="请输入设置项" />
        <div class="btns">
          <van-button type="primary" @click.stop="addItem">保存</van-button>
          <van-button type="default" @click.stop="showAdd = false; addItemText= ''">取消</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Dialog } from 'vant'
import settingTitle from '../../components/settingTitle'
import {
  querySettingList,
  createSettingItem,
  updateSettingItem,
  removeSettingItem
} from '../../../../service/guardcare/dailyManage'
export default {
  components: {
    settingTitle
  },
  data() {
    return {
      settingList: [],
      showAdd: false,
      addItemText: ''
    }
  },
  created() {
    this.getSettingList()
  },
  methods: {
    getSettingList() {
      querySettingList({}).then(res => {
        this.settingList = res.data.data
      }).catch(err => {
        this.settingList = []
        console.log(err)
      })
    },
    addItem() { // 新增设置项
      this.addItemText = this.addItemText.trim()
      if (!this.addItemText.length) return this.$toast('内容不能为空')
      if (this.addItemText.length > 6) return this.$toast('最多可输入6个字')
      createSettingItem({
        name: this.addItemText,
        enable: true,
        type: 'CUSTOM'
      }).then(res => {
        this.$toast('新增成功')
        this.getSettingList()
        this.addItemText = ''
        this.showAdd = false
      }).catch(err => {
        console.log(err)
        this.addItemText = ''
        this.showAdd = false
      })
    },
    handleDelete(item) {
      Dialog.confirm({
        title: '删除设置项',
        message: '该操作执行后不能撤销'
      }).then(res => {
        removeSettingItem({ growthRecordConfigId: item.id }).then(res => {
          this.$toast('删除成功')
          this.getSettingList()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    handleChange(item) {
      updateSettingItem({
        growthRecordConfigId: item.id,
        name: item.name,
        enable: item.enable,
        type: item.type
      }).then(res => {
        this.$toast('状态更改成功')
        this.getSettingList()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.setting {
  .settings {
    background-color: $white;
    max-height: calc(100vh - 90px);
    overflow-y: auto;
    ::v-deep .van-switch {
      .van-switch__node {
        background-color: #a1a1a1;
      }
    }
    ::v-deep .van-switch.van-switch--on {
      .van-switch__node {
        background-color: $white;
      }
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 55px;
      padding: 0 20px;
      border-bottom: 1px solid #eee;
      .ctl {
        display: flex;
        align-items: center;
        i {
          display: inline-block;
          width: 18px;
          height: 18px;
          font-size: 18px;
          color: $red;
          margin-right: 16px;
        }
      }
    }
  }
  .bottomBtn {
    position: fixed;
    bottom: 6px;
    width: 100vw;
    span {
      display: block;
      width: 350px;
      height: 44px;
      line-height: 44px;
      margin: 0 auto;
      font-size: 16px;
      font-weight: bold;
      color: $white;
      text-align: center;
      border-radius: 4px;
      background-color: $theme;
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
