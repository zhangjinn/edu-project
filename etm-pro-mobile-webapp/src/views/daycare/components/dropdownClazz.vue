<template>
  <!-- eslint-disable -->
  <div class="dropdownMenu" :class="size">
    <div class="dropdown">
      <van-dropdown-menu>
        <van-dropdown-item
          ref="gradeDrop"
          v-model="value"
          :options="list"
          get-container="#app"
          @change="handleSelect"
          @close="onClose"
        />
      </van-dropdown-menu>
    </div>
    <div class="switch">
      <div class="box" @click.stop="openDropdown">
        <span class="name van-ellipsis" :class="showDrop ? 'mainColor' : ''">{{
          gradeName
        }}</span>
        <template v-if="list.length > 1">
          <span v-if="showDrop" class="mainColor iconfont iconarrow-up"></span>
          <span v-else class="iconfont iconarrow-down"></span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { queryCourseSummary } from "@/service/daycare/attendanceCare";

export default {
  name: "Dropdown",
  props: {
    size: {
      type: String,
      default() {
        return null;
      },
    },
    type: {
      type: String,
      default() {
        return "DAY";
      },
    },
    date: {
      type: String,
      default() {
        return DateFormat(new Date(), 'yyyy-MM-dd');
      }
    },
    val: {
      type: [String, Number],
      default() {
        return '';
      },
    }
  },
  data() {
    return {
      value: 0,
      list: [],
      gradeName: "",
      showDrop: false
    };
  },
  watch: {
    date: {
      handler(v) {
        if (v !== undefined) {
          this.queryData();
        }
      },
      immediate: true
    },
    val: {
      handler(nV) {
        if (nV) {
          this.value = nV
          if(this.list.length !==0 ){
            this.gradeName = (this.list.find(v => v.value === nV) || {}).text
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    openDropdown(val) {
      if (val === false) {
        this.$refs.gradeDrop.toggle(val);
      } else {
        if (this.list.length > 1) {
          this.showDrop = !this.showDrop;
          this.$refs.gradeDrop.toggle(this.showDrop);
        }
        this.$emit("open", this.showDrop);
      }
    },
    handleSelect(value) {
      this.list.filter(v => v.value === value);
      this.list.forEach(item => {
        if (item.value === value) {
          this.gradeName = item.text;
          this.$emit("select", item);
        }
      });
    },
    onClose() {
      this.showDrop = false;
    },
    queryData() {
      let date = this.date
      if(date.length < 8) date += '-01'
      queryCourseSummary({ date: date, type:this.type }).then(res => {
        this.list = res.data.data.map(it => {
          const item = {
            text: it.courseName + '  ' + it.clazzName
          }

          if(this.type === 'DAY'){
            item.value = it.courseManagementId
          }else if(this.type === "MONTH"){
            item.value = (it.courseId || '') + '-' + (it.clazzId || '')
          }

          return item

        });

        this.list.unshift({
          text: "全部班级",
          value: '',
        });
        this.gradeName = (this.list.find(v => v.value === this.value) || this.list[0]).text
        this.$emit("select", (this.list.find(v => v.value === this.value) || this.list[0]));
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdownMenu {
  position: relative;
  overflow: hidden;

  &.normal {
    .dropdown {
      /deep/ .van-dropdown-menu {
        .van-dropdown-menu__title {
          font-size: 15px;
        }

        .van-cell__title {
          font-size: 15px;
        }
      }
    }

    .switch {
      .box {
        .name {
          font-size: 15px;
        }
      }
    }
  }

  .dropdown {
    display: inline-block;
    height: 45px;
    line-height: 45px;

    /deep/ .van-dropdown-menu {
      height: 45px;

      &::after {
        border: none;
      }

      .van-dropdown-item {
        border-top: 0.5px solid $text-e;
      }

      .van-dropdown-menu__title {
        padding-left: 0;
        font-size: 14px;
        color: $text-2;
      }

      .van-dropdown-menu__title--active {
        color: $theme;
      }

      .van-cell__title {
        font-size: 14px;
      }
    }
  }

  .switch {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 45px;
    font-size: 0;
    line-height: 45px;
    background-color: $white;

    .box {
      display: inline-block;

      .name {
        display: inline-block;
        max-width: 90px;
        font-size: 14px;
        vertical-align: middle;
      }

      .iconfont {
        display: inline-block;
        margin-left: 6px;
        font-size: 12px;
        color: $text-5;
        vertical-align: middle;
      }
    }
  }
}
</style>
