<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img
              v-bind:src="user_image"
            class="c-avatar-img "
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>{{user_name}}</strong>
    </CDropdownHeader>

    <CDropdownItem v-on:click="$router.push({path:'/dashboard/users/profile'})">
      <CIcon name="cil-user" /> پروفایل
      <CBadge color="success" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-task" /> Tasks
      <CBadge color="danger" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-comment-square" /> Comments
      <CBadge color="warning" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownHeader
      tag="div"
      class="text-center"
      color="light"
    >
      <strong>Settings</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-user" /> Profile
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-dollar" /> Payments
      <CBadge color="secondary" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-file" /> Projects
      <CBadge color="primary" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem>
      <CIcon name="cil-shield-alt" /> Lock Account
    </CDropdownItem>
    <CDropdownItem v-on:click="go_login()">
      <CIcon name="cil-lock-locked"  /> خروج
    </CDropdownItem>
  </CDropdown>
</template>

<script>
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return {
      itemsCount: 42,
      user_name: "",
      user_image: "/img/user.png",
    }
  },methods:{
      go_login(){

          localStorage.setItem('token','');
          this.$router.push({ path: '/dashboard/login'});
      },
        get_user_name(){


            this.user_name= localStorage.getItem("user_name")
            // this.user_image= this.$store.state.user_image;



            // alert(res.contains("Sam"));

          // this.$router.push({ path: '/login'});
      }
    },computed: {

    },mounted() {
        setTimeout(() =>
            this.get_user_name()
            , 1000);

    }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>
