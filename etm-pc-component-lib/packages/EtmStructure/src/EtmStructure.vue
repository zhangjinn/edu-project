<template>
  <div class="EtmStructure">
    <div v-if="type === 'A'" class="structureA">
      <slot />
    </div>

    <div v-if="type === 'B'" class="structureB">
      <div class="up-part">
        <slot name="up" />
      </div>
      <div class="down-part">
        <div class="down-left-part">
          <slot name="left" />
        </div>
        <div class="down-right-part">
          <slot name="right" />
        </div>
      </div>
    </div>

    <div v-if="type === 'C'" class="structureC">
      <div class="left-part secondPageHeight">
        <slot name="left" />
      </div>
      <div class="right-part secondPageHeight">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EtmStructure',
  props: {
    type: {
      type: String,
      default: 'A',
      validator(value) {
        return ['A', 'B', 'C'].indexOf(value) !== -1
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/src/etm/structure.scss";
</style>
