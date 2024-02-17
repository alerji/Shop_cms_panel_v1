<template>
  <CFooter :fixed="false">
    <div>
      <a target="_blank">پنل فروشگاهی  </a>
      <span class="ml-1">{{version}}</span>
    </div>

  </CFooter>
</template>

<script>
export default {
  name: 'TheFooter',
  data(){
    return {
      version:process.env.VUE_APP_VERSION
    }
  }
}
</script>
