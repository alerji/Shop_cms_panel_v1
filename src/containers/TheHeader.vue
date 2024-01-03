<template>
  <CHeader fixed with-subheader light>
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
    <CHeaderNav class="d-md-down-none mr-auto">
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
      <CHeaderNavItem class="px-3" v-if="1==0">
        <CHeaderNavLink to="/dashboard/settings">
          تنظیمات
        </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2" v-if="1==0">
        <CHeaderNavLink>
          <CIcon name="cil-bell"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2" v-if="1==0">
        <CHeaderNavLink>
          <CIcon name="cil-list"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2" v-if="1==0">
        <CHeaderNavLink>
          <CIcon name="cil-envelope-open"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <TheHeaderDropdownAccnt/>
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader>
    <CCol ref="errors_container">
      <CCard v-if="header_validate_errors.length" >
        <CCardHeader>
          <strong>خطا های زیر را برطرف کنید </strong>

        </CCardHeader>
        <CCardBody>
          <div>

            <CAlert  v-for="error in header_validate_errors"  show color="danger">{{ error }}</CAlert>

          </div>
        </CCardBody>
      </CCard>

    </CCol>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt
  },
  data() {
    return {

      header_validate_errors: [],

    }
  },mounted() {
    // this.$root.modal_component = this.$refs.modal2;
    this.$root.root_validate_errors = [] ;
    this.header_validate_errors = this.$root.root_validate_errors ;
    // this.modal2 = this.$refs.modal2;
    // console.log("alert container"+this.$refs.errors_container);
    // this.modals = this.$refs.modal2;
    // this.$refs.modal2.show_confirm_modal('اخطار',"آیا مایل به حذف این کاربر هستید؟",['تایید'],'delete_confirm');

    // this.$root.root_validate_errors = [] ;


    // console.log(this.modal2.title2);
    // console.log(this.$root.modal_component.title2+" export 2");
    // console.log(this.modals2.title2+" export");
    //If i console log this.$refs.loading i got my component
  },watch:{
    '$root.root_validate_errors.length': function () {
      console.log("alert container"+this.$root.root_validate_errors);

      this.header_validate_errors = this.$root.root_validate_errors ;
      if(this.header_validate_errors.length>0){
        setTimeout(() =>
                        this.$refs.errors_container.scrollIntoView()
                , 500);

      }
    }
  }
}
</script>
