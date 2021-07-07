<template>
  <div class="headInfo">
    <div v-if="childList.length === 1" class="childWrap">
      <div class="childInfo">
        <span>{{ childName.slice(-2) }}</span>{{ childName }}
      </div>
      <div class="status">
        {{ type }}
      </div>
    </div>
    <div v-else class="childGroup">
      <div class="cg_title">
        {{ type }}
      </div>
      <div class="cg_num">
        已选{{ childList.length }}人
      </div>
    </div>
    <div>
      <div class="cross" />
      <div class="timeSelect">
        <div>记录时间</div>
        <div class="startTime" @click.stop="showPop = true">
          {{ time }} >
        </div>
      </div>
    </div>

    <van-popup v-model="showPop" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker
        v-model="time"
        type="time"
        title="请选择记录时间"
        @confirm="showPop = false"
        @cancel="showPop = false"
      />
    </van-popup>
  </div>
</template>
<script>
import transferDate from '../../../../js/date'
export default {
  props: {
    childList: {
      type: Array,
      default() {
        return []
      }
    },
    type: {
      type: String,
      default: '自定义'
    }
  },
  data() {
    return {
      showPop: false,
      time: transferDate().clock
    }
  },
  computed: {
    childName() {
      if (this.childList.length) {
        return this.childList[0].childName
      } else {
        return ''
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.headInfo {
  border-radius: 3px;
  .childWrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 13px;
    width: 351px;
    height: 66px;
    margin: 13px auto 0;
    background-color: $white;
    border-bottom: 1px solid $text-e;
    .childInfo {
      display: flex;
      align-items: center;
      line-height: 35px;
      font-size: 15px;
      span {
        display: inline-block;
        width: 35px;
        height: 35px;
        margin-right: 15px;
        border-radius: 50%;
        background-color: $theme;
        line-height: 35px;
        color: $white;
        font-size: 13px;
      }
    }
    .status {
      font-size: 15px;
    }
  }
  .childGroup {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    width: 351px;
    padding: 0 12px;
    height: 55px;
    background-color: $white;
    margin: 12px auto 0;
    border-radius: 3px;
    .cg_num {
      color: $text-9;
    }
  }
  .timeSelect {
    width: 351px;
    height: 55px;
    padding: 0 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $white;
    margin: 0 auto;
    font-size: 15px;
    .startTime, .endTime {
      color: #bbb;
    }
  }
}
</style>
