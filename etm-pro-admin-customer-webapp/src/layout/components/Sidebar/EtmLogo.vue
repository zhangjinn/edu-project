<template>
  <div class="etm-logo">
    <transition name="fade">
      <img
        v-if="index === 1"
        :src="config.bpcLogoLarge"
        alt=""
      >
      <div v-if="index === 2">
        早教+幼儿园+托育
      </div>
      <img
        v-if="index === 3"
        :src="config.bpcLogoLarge"
        alt=""
      >
      <div v-if="index === 4">
        早幼托一体化
      </div>
    </transition>
  </div>
</template>
<script>
import { getConfig } from '@/utils/auth'
export default {
  name: 'EtmLogo',
  data () {
    return {
      index: 1
    }
  },
  computed: {
    config () {
      return getConfig()
    }
  },
  mounted () {
    this.animation()
  },
  methods: {
    animation () {
      setInterval(() => {
        if (this.index >= 4) {
          this.index = 0
        }
        this.index++
      }, 30000)
    }
  }
}
</script>
<style lang="scss" scoped>
.etm-logo {
  color: $white;
  font-size: 16px;
  height: 56px;
  position: relative;
  width: inherit;

  .fade-enter-active,
  .fade-leave-active {
    transition: all 1s;
  }

  .fade-enter,
  .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  > div {
    align-items: center;
    display: flex;
    height: inherit;
    justify-content: center;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s;
    width: inherit;
  }

  > img {
    left: 50%;
    /*height: calc(56px * 0.7);*/
    object-fit: cover;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);

  }
}
</style>
