<template>
  <etm-pop
    pop="complex"
    title="皮肤设置"
    :visible="true"
    @confirm="handleClose"
    @cancel="handleClose"
    @close="handleClose"
  >
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
          <img
            :src="theme.img"
            :alt="theme.img"
          >
        </div>
        <div class="theme-text">
          {{ theme.name }}
        </div>
      </div>
    </div>
  </etm-pop>
</template>

<script>

export default {
  name: 'Index',
  components: {
  },
  data () {
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
          name: '旭日东升',
          className: 'etm-yellow',
          img: require('../../../assets/images/themes/yellow.png')
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
    handleClose () {
      this.show = false
      this.$emit('close', false)
    },
    handleSwitchTheme (v) {
      console.log(v)
      this.value = v
      console.log(this.value)
      this.changeTheme(v)
    },
    changeTheme (className) {
      const that = this
      toggleClass(document.documentElement, className)

      function toggleClass (element, className) {
        if (!element || !className) {
          return
        }
        element.className = className
        const hostConfig = JSON.parse(localStorage.getItem('hostConfig'))
        hostConfig.themeName = className
        that.$store.dispatch('base/setThemeName', hostConfig.themeName)
        localStorage.setItem('hostConfig', JSON.stringify(hostConfig))
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../../styles/variables';
@import '../../../styles/mixin';

.switchSkin {
  display: flex;
  flex-wrap: wrap;

  .theme-item {
    align-items: center;
    cursor: pointer;
    display: flex;
    flex: 0 0 33%;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 16px;

    .img-box {
      border: 1px solid #eee;
      border-radius: 4px;
      margin-bottom: 16px;
      padding: 8px;

      > img {
        height: 90px;
        vertical-align: middle;
      }
    }

    &.active {
      .img-box {
        @include etm-bdc;

        border: 1px solid;
      }

      .theme-text {
        @include etm-color;
      }

    }
  }
}
</style>
