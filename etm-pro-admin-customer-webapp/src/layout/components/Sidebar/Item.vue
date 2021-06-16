<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render (h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<i class={`iconfont MenuItem custom-icon ${icon}`}></i>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped lang="scss">
  .MenuItem {
    display: inline-block;
    font-size: 16px;
    font-weight: normal;
    left: -5px;
    position: relative;
    vertical-align: middle;

  }

  .MenuItem.custom-icon {
    color: #9ea5b6;
    font-size: 18px;
  }

</style>
