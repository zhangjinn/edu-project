<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="test">
      dfdf
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="peeling">
            <span style="display:block;">Peeling</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
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
            <img :src="theme.img" :alt="theme.img">
          </div>
          <div class="theme-text">{{ theme.name }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    return {
      dialogVisible: false,
      value: window.document.documentElement.className,
      themes: [
        {
          name: '旭日东升',
          className: 'etm-yellow',
          img: require('@/assets/themes/yellow.png')
        },
        {
          name: '粉妆玉砌',
          className: 'etm-pink',
          img: require('@/assets/themes/pink.png')
        },
        {
          name: '紫气东来',
          className: 'etm-purple',
          img: require('@/assets/themes/purple.png')
        },
        {
          name: '温暖橘红',
          className: 'etm-warmOrange',
          img: require('@/assets/themes/warmOrange.png')
        },
        {
          name: '郁郁葱葱',
          className: 'etm-green',
          img: require('@/assets/themes/green.png')
        },
        {
          name: '碧空如洗',
          className: 'etm-blue',
          img: require('@/assets/themes/blue.png')
        },
        {
          name: '雨过天青',
          className: 'etm-rainBlue',
          img: require('@/assets/themes/rainBlue.png')
        },
        {
          name: '粉红少女',
          className: 'etm-girlPink',
          img: require('@/assets/themes/girlPink.png')
        },
        {
          name: '薰衣草紫',
          className: 'etm-lavenderPurple',
          img: require('@/assets/themes/lavenderPurple.png')
        }
      ]
    }
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    peeling() {
      this.dialogVisible = true
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleClose() {
      this.show = false
      this.$emit('close', false)
    },
    handleSwitchTheme(v) {
      console.log(v)
      this.value = v
      console.log(this.value)
      this.changeTheme(v)
    },
    changeTheme(className) {
      toggleClass(document.documentElement, className)

      function toggleClass(element, className) {
        if (!element || !className) {
          return
        }
        element.className = className
        const hostConfig = JSON.parse(localStorage.getItem('hostConfig'))
        hostConfig.themeName = className
        localStorage.setItem('hostConfig', JSON.stringify(hostConfig))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }

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
  .test{
    float: right;
    @include etm-color();
  }
}
</style>
