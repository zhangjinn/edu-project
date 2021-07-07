<template>
  <div class="memberSetup">
    <structure-c>
      <template v-slot:left>
        <menu-list />
      </template>
      <template v-slot:right>
        <setting />
      </template>
    </structure-c>
    <info-dialog />
  </div>
</template>
<script>
import structureC from '../../../layout/main/structureC'
import menuList from './menuList/index'
import setting from './setting/index'
import infoDialog from './infoDialog/index'

export default {
  name: 'MemberSetup',
  components: {
    structureC,
    menuList,
    setting,
    infoDialog
  }
}
</script>

<style scoped>
</style>
