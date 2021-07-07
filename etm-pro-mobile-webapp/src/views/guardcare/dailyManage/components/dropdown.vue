<template>
  <div class="dropdownMenu" :class="size">
    <div v-if="type === 'grade'" class="dropdown">
      <van-dropdown-menu>
        <van-dropdown-item
          ref="gradeDrop"
          v-model="gradeValue"
          :options="gradeList"
          get-container="#app"
          @change="selectGrade"
          @close="onClose"
        />
      </van-dropdown-menu>
    </div>
    <div v-else class="dropdown">
      <van-dropdown-menu>
        <van-dropdown-item
          ref="clazzDrop"
          v-model="clazzValue"
          :options="clazzList"
          get-container="#app"
          @change="selectClazz"
          @close="onClose"
        />
      </van-dropdown-menu>
    </div>
    <div class="switch">
      <div class="box" @click.stop="opendropdown">
        <span class="name van-ellipsis" :class="showDrop ? 'mainColor' : ''">{{ type === 'grade' ? gradeName : clazzName }}</span>
        <template
          v-if="(type === 'grade' && gradeList.length > 1) || (type === 'clazz' && clazzList.length > 1)"
        >
          <span v-if="showDrop" class="mainColor iconfont iconarrow-up" />
          <span v-else class="iconfont iconarrow-down" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getGradeList, getClazzList } from '../../../../service/guardcare'
export default {
  name: 'Dropdown',
  props: {
    size: {
      type: String,
      default() {
        return null
      }
    },
    type: {
      type: String,
      default() {
        return null
      }
    },
    gradeId: {
      type: Number,
      default() {
        return null
      }
    },
    clazzId: {
      type: Number,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      gradeValue: 0,
      gradeList: [],
      gradeName: '',
      clazzValue: 0,
      clazzList: [],
      clazzName: '',
      showDrop: false
    }
  },
  watch: {
    gradeId: {
      handler() {
        if (this.type === 'clazz') { // 年级修改，重新请求班级下拉列表
          this.getClazz()
        }
      }
    }
  },
  created() {
    if (this.type === 'grade') { // 年级下拉
      this.getGrade()
    } else if (this.type === 'clazz') { // 班级下拉
      if (this.gradeId) {
        this.getClazz()
      }
    }
  },
  methods: {
    getGrade() {
      this.gradeList = []
      const param = {
        paged: false
      }
      getGradeList(param).then(res => {
        const list = res.data.data
        list.forEach(item => {
          const data = {
            text: item.name,
            value: item.id
          }
          this.gradeList.push(data)
        })
        // if (this.gradeList.length !== 1) {
        //   const all = {
        //     text: '全部年级',
        //     value: 0
        //   }
        //   this.gradeList.unshift(all)
        // }
        if (this.gradeId) {
          this.gradeValue = this.gradeId
        } else {
          this.gradeValue = this.gradeList[0].value
        }
        this.gradeList.forEach(list => {
          if (list.value === this.gradeValue) {
            this.gradeName = list.text
            this.$emit('select', list, 'load')
            return
          }
        })
      })
    },
    getClazz() {
      this.clazzList = []
      if (!this.gradeId) {
        this.clazzList = [
          {
            text: '全部班级',
            value: 0
          }
        ]
        this.clazzValue = this.clazzList[0].value
        this.clazzName = this.clazzList[0].text
        this.$emit('select', this.clazzList[0])
      } else {
        const param = {
          gradeId: this.gradeId,
          paged: false
        }
        getClazzList(param).then(res => {
          const list = res.data.data
          list.forEach(item => {
            const data = {
              text: item.name,
              value: item.id
            }
            this.clazzList.push(data)
          })
          // if (this.clazzList.length !== 1) {
          //   const all = {
          //     text: '全部班级',
          //     value: 0
          //   }
          //   this.clazzList.unshift(all)
          // }
          if (this.clazzId) {
            this.clazzValue = this.clazzId
          } else {
            this.clazzValue = this.clazzList[0].value
          }
          this.clazzList.forEach(list => {
            if (list.value === this.clazzValue) {
              this.clazzName = list.text
              this.$emit('select', list)
              return
            }
          })
        })
      }
    },
    opendropdown(val) {
      if (val === false) {
        if (this.type === 'grade') {
          this.$refs.gradeDrop.toggle(val)
        } else {
          this.$refs.clazzDrop.toggle(val)
        }
      } else {
        if (this.type === 'grade') {
          if (this.gradeList.length > 1) {
            this.showDrop = !this.showDrop
            this.$refs.gradeDrop.toggle(this.showDrop)
          }
        } else {
          if (this.clazzList.length > 1) {
            this.showDrop = !this.showDrop
            this.$refs.clazzDrop.toggle(this.showDrop)
          }
        }
        this.$emit('open', this.showDrop)
      }
    },
    selectGrade(value) {
      this.gradeList.forEach(item => {
        if (item.value === value) {
          this.gradeName = item.text
          this.$emit('select', item)
        }
      })
    },
    selectClazz(value) {
      this.clazzList.forEach(item => {
        if (item.value === value) {
          this.clazzName = item.text
          this.$emit('select', item)
        }
      })
    },
    onClose() {
      this.showDrop = false
    }
  }
}
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
                    border-top: .5px solid $text-e;
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
