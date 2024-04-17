<template>
  <CHeader class="header " fixed with-subheader light>
    <CToggler
        in-header
        class="ml-3 d-lg-none"
        @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
        in-header
        class="ml-3 d-md-down-none"
        @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <CIcon name="logo" height="48" alt="Logo"/>
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none ml-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          داشبورد
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard/users/admins" exact>
          کاربران
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard/settings">
          تنظیمات
        </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderNav class="mr-4 " style="position: absolute;left: 0">
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CDropdown
              inNav
              class="c-header-nav-items"
              placement="bottom-end"
              add-menu-classes="pt-0"
          >
            <template #toggler>
              <CHeaderNavLink>
                <div class="c-avatar">
                  <CIcon name="cil-bell"/>
                  <CBadge color="danger" class="ml-auto">{{ unread_data.orders+unread_data.product_comments+unread_data.blog_comments }}</CBadge>

                </div>
              </CHeaderNavLink>
            </template>
            <CDropdownHeader tag="div" class="text-center" color="light">
              <strong>یاد آوری ها</strong>
            </CDropdownHeader>
            <CDropdownItem v-on:click="$router.push({path:'/dashboard/orders/list'})">
              <CIcon name="cil-list" />
              سفارشات تایید نشده
              <CBadge color="danger" style="position: static" class="ml-auto">{{ unread_data.orders }}</CBadge>
            </CDropdownItem>

            <CDropdownItem v-on:click="$router.push({path:'/dashboard/products/comments'})">
              <CIcon name="cil-comment-square"/>
              دیدگاه محصولات
              <CBadge color="danger" style="position: static" class="ml-auto">{{ unread_data.product_comments }}</CBadge>
            </CDropdownItem>

            <CDropdownItem  v-on:click="$router.push({path:'/dashboard/news/comments'})">
              <CIcon name="cil-comment-square"/>
              دیدگاه بلاگ
              <CBadge color="danger" style="position: static" class="ml-auto">{{ unread_data.blog_comments }}</CBadge>
            </CDropdownItem>


          </CDropdown>

        </CHeaderNavLink>
      </CHeaderNavItem>
      <!--      <CHeaderNavItem class="d-md-down-none mx-2" >-->
      <!--        <CHeaderNavLink>-->
      <!--          <CIcon name="cil-list"/>-->
      <!--        </CHeaderNavLink>-->
      <!--      </CHeaderNavItem>-->
      <!--      <CHeaderNavItem class="d-md-down-none mx-2">-->
      <!--        <CHeaderNavLink>-->
      <!--          <CIcon name="cil-envelope-open"/>-->
      <!--          -->
      <!--        </CHeaderNavLink>-->
      <!--      </CHeaderNavItem>-->
      <TheHeaderDropdownAccnt/>
    </CHeaderNav>
    <!--    <CSubheader class="px-3">-->
    <!--      <CBreadcrumbRouter class="border-0 mb-0"/>-->
    <!--    </CSubheader>-->
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import axios from "axios";

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt
  },
  data() {
    return {

      header_validate_errors: [],
      unread_data: {},

    }
  }, mounted() {
    //
    this.unread_notifications();
    this.$root.root_validate_errors = [];
    this.header_validate_errors = this.$root.root_validate_errors;

  }, watch: {
    '$root.root_validate_errors.length': function () {
      console.log("alert container" + this.$root.root_validate_errors);

      this.header_validate_errors = this.$root.root_validate_errors;
      if (this.header_validate_errors.length > 0) {
        setTimeout(() =>
                this.$refs.errors_container.scrollIntoView()
            , 500);

      }
    }
  },
  methods: {
    unread_notifications() {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
      var formData = new FormData();

      axios.post('/api/admin/unread_notifications', formData, {}).then(function (response) {

        var contents = response.data;

        self.unread_data = contents;

      })
          .catch(function (error) {
            console.log(error);
          });

    },

  }
}
</script>
