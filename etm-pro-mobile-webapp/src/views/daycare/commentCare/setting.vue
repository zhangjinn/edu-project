<template>
  <div class="setting">
    <setting-title no-setting>
      <span class="settingHeader">设置</span>
    </setting-title>
    <ul class="settingWrap">
      <li v-for="item in settingItems" :key="item.prop" @click.stop="showMenu(item.prop)">
        <div class="left">
          <span class="settingTitle">{{ item.title }}</span>
        </div>
        <div class="right">
          <span class="settingValue">{{ item.value }}</span>
          <i class="iconfont iconright1" />
        </div>
      </li>
    </ul>
    <van-action-sheet
      v-model="showFre"
      :actions="frequencyList"
      cancel-text="取消"
      close-on-click-action
      :close-on-click-overlay="false"
      @select="onSelect"
    />
    <van-action-sheet v-model="show" :close-on-click-overlay="false">
      <van-nav-bar
        :title="{school: '在园表现项', home: '在家表现项'}[state]"
        left-text="取消"
        right-text="确认"
        @click-left="show = false"
        @click-right="confirmItems"
      />
      <div class="content">
        <ul>
          <li v-for="(item, index) in behaviorList" :key="index">
            <span>{{ item.whichPerformedName || '-' }}</span>
            <i class="iconfont iconminus-circle" @click.stop="deleteItem(index, item)" />
          </li>
        </ul>
        <div class="add" @click.stop="showAdd = true">
          <i class="iconfont iconplus-circle" />
          &nbsp;添加
        </div>
      </div>
    </van-action-sheet>
    <van-popup v-model="showAdd" closeable>
      <div class="popWrap">
        <van-field v-model="addItemText" placeholder="输入表现项" />
        <div class="btns">
          <van-button type="primary" @click.stop="addItem">保存</van-button>
          <van-button type="default" @click.stop="showAdd = false; addItemText= ''">取消</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import settingTitle from './components/settingTitle'
// import {
//   queryBehaviorList,
//   removeBehaviorItem,
//   createBehaviorItem,
//   queryFrequency,
//   updateFrequency
// } from '../../../service/guardcare/comment'
import {
  queryFrequency,
  updateFrequency,
  createPerformed,
  queryTypeEnum,
  removePerformed
} from '@/service/daycare/commentCare'

export default {
  components: {
    settingTitle
  },
  data() {
    return {
      showFre: false, // 频率的下方弹窗
      show: false, // 表现项的下方弹窗
      showAdd: false,
      state: 'frequency',
      settingItems: [
        {
          prop: 'frequency',
          title: '点评频率',
          value: '每周一次'
        },
        {
          prop: 'school',
          title: '在园表现项',
          value: '已有8项'
        },
        {
          prop: 'home',
          title: '在家表现项',
          value: '已有8项'
        }
      ],
      frequencyList: [
        { name: '每天一次' },
        { name: '每周一次' },
        { name: '每月一次' }
      ],
      homeBehaviorList: [],
      schoolBehaviorList: [],
      addItemText: ''
    }
  },
  computed: {
    behaviorList() {
      return {
        home: this.homeBehaviorList,
        school: this.schoolBehaviorList
      }[this.state]
    },
    frequencyObj() {
      return this.settingItems[0]
    }
  },
  watch: {
    homeBehaviorList: {
      handler(v) {
        this.settingItems[2].value = `已有${v.length}项`
      },
      immediate: true
    },
    schoolBehaviorList: {
      handler(v) {
        this.settingItems[1].value = `已有${v.length}项`
      },
      immediate: true
    }
  },
  created() {
    this.getHomeBehaviorList()
    this.getSchoolBehaviorList()
    this.getQueryFrequency()
  },
  methods: {
    getQueryFrequency() {
      queryFrequency().then(res => {
        // console.log(res.data.data)
        this.frequencyObj.value = {
          'PER_MONTH': '每月一次',
          'WEEKLY': '每周一次',
          'DAILY': '每天一次'
        }[res.data.data.frequencyType]
        // console.log(this.frequencyObj)
      })
    },
    getHomeBehaviorList() { // 获取在园表现项
      queryTypeEnum({ whichPerformedTypeEnum: 'AT_HOME' }).then(res => {
        // console.log(res.data.data)
        this.homeBehaviorList = res.data.data
      })
    },
    getSchoolBehaviorList() { // 获取在家表现项
      queryTypeEnum({ whichPerformedTypeEnum: 'IN_THE_PARK' }).then(res => {
        // console.log(res.data.data)
        this.schoolBehaviorList = res.data.data
      })
    },
    showMenu(prop) { // 弹出下方弹窗
      this.state = prop
      if (prop === 'frequency') {
        this.showFre = true
      }
      if (prop === 'school' || prop === 'home') {
        this.show = true
      }
    },
    onSelect(item) {
      if (this.state === 'frequency') {
        updateFrequency({
          frequencyType: {
            '每月一次': 'PER_MONTH',
            '每周一次': 'WEEKLY',
            '每天一次': 'DAILY'
          }[item.name]
        }).then(res => {
          this.frequencyObj.value = item.name
        })
      }
    },
    confirmItems() {
      this.show = false
    },
    addItem() {
      this.addItemText = this.addItemText.trim()
      if (!this.addItemText.length) return this.$toast('内容不能为空')
      if (this.addItemText.length > 6) return this.$toast('最多可输入6个字')
      createPerformed({
        whichPerformedName: this.addItemText,
        whichPerformedType: { school: 'IN_THE_PARK', home: 'AT_HOME' }[this.state]
      }).then(res => {
        this.$toast('新增成功')
        this.behaviorList.push(res.data.data)
        this.showAdd = false
        this.addItemText = ''
      }).catch(err => {
        console.log(err)
        this.showAdd = false
        this.addItemText = ''
      })
    },
    deleteItem(index, item) {
      removePerformed({ whichPerformedId: item.whichPerformedId })
        .then(res => {
          this.$toast('删除成功')
          this.behaviorList.splice(index, 1)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.setting {
  .settingHeader {
    font-size: 15px;
    color: $white;
  }

  .settingWrap {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 74px;
      padding: 0 18px;
      background-color: $white;
      border-bottom: 1px solid $text-e;

      .left, .right {
        display: flex;
        align-items: center;
      }

      .right {
        i {
          font-size: 10px;
          color: #9a9a9a;
          margin-left: 9px;
          transform: translateY(2px);
        }
      }

      .settingTitle {
        font-size: 15px;
      }

      .settingValue {
        font-size: 12px;
        color: #9a9a9a;
      }

      i.logo {
        font-size: 20px;
        color: $theme;
      }
    }
  }

  .header {
    display: flex;
  }

  .content {
    padding-bottom: 50px;

    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 46px;
        padding: 0 32px;
        border-bottom: 1px solid $text-e;

        i {
          color: $red;
        }
      }
    }

    .add {
      // height: 46px;
      line-height: 46px;
      text-align: left;
      // display: flex;
      // align-items: center;
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

  ::v-deep .van-nav-bar {
    .van-nav-bar__left .van-nav-bar__text {
      color: $text-6;
    }

    .van-nav-bar__right .van-nav-bar__text {
      color: $theme;
    }
  }

  ::v-deep .van-popup--bottom.van-popup--round {
    border-radius: 0;
  }
}
</style>
