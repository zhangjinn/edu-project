<template>
  <div>
    <playerMode
      v-if="mode==='playerMode'"
      @handleChangeToAlbumMode="handleChangeToAlbumMode"
    />
    <expertMode
      v-if="mode==='expertMode'"
      @handleChangeToPlayerMode="handleChangeToPlayerMode"
    />
  </div>
</template>

<script>
import playerMode from './playerMode'
import expertMode from './expertMode'
export default {
  name: 'Index',
  components: {
    playerMode,
    expertMode
  },
  data () {
    return {
      mode: 'playerMode'
    }
  },
  created () {

  },
  methods: {
    handleChangeToAlbumMode () {
      this.mode = 'expertMode'
    },
    handleChangeToPlayerMode () {
      this.mode = 'playerMode'
    }
  }
}
</script>

<style scoped>

</style>
