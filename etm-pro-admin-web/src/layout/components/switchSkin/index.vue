<template>
  <etm-pop pop="complex" title="皮肤设置" :visible="true" @confirm="handleConfirm" @cancel="handleClose" @close="handleClose">
    <div class="switchSkin">
      <div
        v-for="(theme,index) of themes"
        :key="index"
        :class="[
          'theme-item',
          value === theme.className ? 'active': ''
        ]"
        @click="handleSwitchTheme(theme.className)"
      >
        <div
          class="img-box"
        >
          <img :src="theme.img" :alt="theme.img">
        </div>
        <div class="theme-text">{{ theme.name }}</div>
      </div>
    </div>
  </etm-pop>
</template>

<script>

export default {
  name: 'Index',
  components: {
  },
  data() {
    return {
      show: true,
      value: window.document.documentElement.className,
      themes: [
        {
          name: '青出于蓝',
          className: 'etm-rainBlue',
          img: require('../../../assets/images/themes/rainBlue.png')
        },
        {
          name: '粉妆玉砌',
          className: 'etm-pink',
          img: require('../../../assets/images/themes/pink.png')
        },
        {
          name: '紫气东来',
          className: 'etm-purple',
          img: require('../../../assets/images/themes/purple.png')
        },
        {
          name: '温暖橘红',
          className: 'etm-warmOrange',
          img: require('../../../assets/images/themes/warmOrange.png')
        },
        {
          name: '尊贵黑金',
          className: 'etm-blackGold',
          img: require('../../../assets/images/themes/blackGold.png')
        },
        {
          name: '碧空如洗',
          className: 'etm-blue',
          img: require('../../../assets/images/themes/blue.png')
        },
        {
          name: '郁郁葱葱',
          className: 'etm-green',
          img: require('../../../assets/images/themes/green.png')
        },
        {
          name: '粉红少女',
          className: 'etm-girlPink',
          img: require('../../../assets/images/themes/girlPink.png')
        },
        {
          name: '薰衣草紫',
          className: 'etm-lavenderPurple',
          img: require('../../../assets/images/themes/lavenderPurple.png')
        }
      ]
    }
  },
  methods: {
    handleClose() {
      const oldClassName = JSON.parse(localStorage.getItem('hostConfig')).themeName
      this.changeTheme(oldClassName)
      this.show = false
      this.$emit('close', false)
    },
    handleConfirm() {
      const hostConfig = JSON.parse(localStorage.getItem('hostConfig'))
      hostConfig.themeName = this.value
      this.$store.dispatch('base/setThemeName', hostConfig.themeName)
      localStorage.setItem('hostConfig', JSON.stringify(hostConfig))
      this.show = false
      this.$emit('confirm', false)
    },
    handleSwitchTheme(v) {
      this.value = v
      console.log(this.value)
      this.changeTheme(v)
    },
    changeTheme(className) {
      // const that = this
      toggleClass(document.documentElement, className)

      function toggleClass(element, className) {
        if (!element || !className) {
          return
        }
        element.className = className
        // const hostConfig = JSON.parse(localStorage.getItem('hostConfig'))
        // hostConfig.themeName = className
        // that.$store.dispatch('base/setThemeName', hostConfig.themeName)
        // localStorage.setItem('hostConfig', JSON.stringify(hostConfig))
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../../styles/variables.scss";
@import "../../../styles/mixin.scss";

.switchSkin {
  display: flex;
  flex-wrap: wrap;

  .theme-item {
    flex: 0 0 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    cursor: pointer;

    .img-box {
      padding: 8px;
      border: 1px solid #eee;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      margin-bottom: 16px;

      > img {
        vertical-align: middle;
        height: 90px;
      }
    }

    &.active {

      .img-box {

        border: 1px solid;
        @include etm-bdc;
      }

      .theme-text {
        @include etm-color;
      }

    }
  }
}
</style>
