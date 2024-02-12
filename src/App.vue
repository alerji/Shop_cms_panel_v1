<template>
<!--  <keep-alive max="5">-->
<!--    <router-view>-->

<!--    </router-view>-->
<!--  </keep-alive>-->
<!--  <keep-alive max="10">-->

  <router-view v-slot="{ Component }" >
      <component :is="Component" />
  </router-view>
<!--  </keep-alive>-->

</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>

