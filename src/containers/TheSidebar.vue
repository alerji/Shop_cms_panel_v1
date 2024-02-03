<template>
  <CSidebar
      fixed
      :minimize="minimize"
      :show="show"
 class="bg-dark-gradient"
      dropdownMode="closeInactive"
      @update:show="(value) => $store.commit('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none c-sidebar-brand-full">
      <CRow style="width: 100%">
        <CHeaderNav>

          <CImg v-show="true"  style="text-align: start;margin-right: 3px;margin-left: 3px" id="logo_image" src="/img/panel_icon.png" width="auto" height="50px"/>

                    <label id="company_name"  style="text-align: start;margin-right: 3px;margin-left: 3px">فروشگاه</label>
                    <label  @click="go_to_site()" style="cursor: pointer"><CIcon name="eye"/></label>

        </CHeaderNav>

      </CRow>
    </CSidebarBrand>


<!--    <CSidebarBrand class="d-md-down-none" style="flex: 0 0 13px;">-->
<!--      &lt;!&ndash;      <CRow>&ndash;&gt;-->
<!--      &lt;!&ndash;        <CHeaderNav>&ndash;&gt;-->

<!--      &lt;!&ndash;          <CImg :src="VUE_APP_LOGO" width="100px" height="50px"/>&ndash;&gt;-->


<!--      &lt;!&ndash;        </CHeaderNav>&ndash;&gt;-->

<!--      &lt;!&ndash;      </CRow>&ndash;&gt;-->


<!--    </CSidebarBrand>-->

    <CRenderFunction ref="sidebar_ref" flat :content-to-render="generate_nav"/>
    <!--    <CRenderFunction flat :content-to-render="$options.nav"/>-->
    <CSidebarMinimizer
        class="d-md-down-none"
        @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import nav from './_nav'
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import router from "@/router";

export default {
  name: 'TheSidebar',
  nav,
  components: {
    TheHeaderDropdownAccnt
  },
  data() {
    return {
      branch_name: localStorage.getItem("branchName"),
      sidebar_changer: null,
      side_bar_drop_downs: null,
      opened_drop_downs: '',
    }
  },
  computed: {

    show() {
      return this.$store.state.sidebarShow
    },
    minimize() {
      return this.$store.state.sidebarMinimize
    },
    go_to_site() {
window.open(localStorage.getItem("site_url"))
    },
    generate_nav() {
      var out_pot = nav;
      let permissions = localStorage.getItem("permissions");
      // console.log("sidebar generate nav called "+permissions);
      // console.log("sidebar generate nav called "+JSON.stringify(out_pot[0]._children));
      for(var oo =out_pot[0]._children.length - 1;oo>=0;oo--) {
        var val = out_pot[0]._children[oo]
        var val_index = oo;
        // }
        // out_pot[0]._children.forEach((val, val_index) => {

        if (val.items != null) {
          for (var xz = val.items.length - 1; xz >= 0; xz--) {
            var val_item = val.items[xz];
            if (val_item.role != null && !permissions.includes(val_item.role)) {
              // val_item.role = 'salam'+index;

              val.items.splice(xz, 1);

            } else if (val_item.role_access != null && !this.get_access(val_item.role_access)) {
              val.items.splice(xz, 1);

            }
          }
        }
        if (val.role_access != null && !this.get_access(val.role_access)) {
          out_pot[0]._children.splice(val_index, 1);
        }
        if (val.role != null && !permissions.includes(val.role)) {
          out_pot[0]._children.splice(val_index, 1);
        }
        // self.value_category.push(val.cat_id);
        // });
      }
      // console.log("sidebar generate nav called "+JSON.stringify(out_pot[0]._children));


      return out_pot;
      // console.log(JSON.stringify(nav));

    },

  },
  mounted() {
    var self = this;
    this.side_bar_drop_downs = this.$refs['sidebar_ref'].$children[0].$children[0].$children
    this.sidebar_changer = this.$refs['sidebar_ref'].$el;
    var CLASS_NAME_ACTIVE = 'c-active';

    var SELECTOR_NAV_LINK = '.c-xhr-link, .c-sidebar-nav-link';
    var SELECTOR_NAV_ITEM = '.c-sidebar-nav-item';
this.$router.afterEach((to, from) => {
  console.log("after each called",to.path)
  setTimeout(() => {
    // console.log('all parent clicked',e);
// var url = "http://demo.orangesoft.ir/dashboard/base/settings-list"
    var url = to.path
// console.log("var",url)
    Array.from(document.querySelectorAll(SELECTOR_NAV_LINK)).forEach(element => {
      element.classList.remove(CLASS_NAME_ACTIVE)
    })

    Array.from(document.querySelectorAll(SELECTOR_NAV_LINK)).forEach(element => {
      element.classList.remove(CLASS_NAME_ACTIVE)
    })
    // Array.from(document.querySelectorAll(CLASS_NAME_ACTIVE)).forEach(element => {
    //   element.classList.remove(CLASS_NAME_ACTIVE)
    // })


    Array.from(document.querySelectorAll(`${SELECTOR_NAV_ITEM} a[href="${url}"]`)).forEach(element => {
      element.classList.add(CLASS_NAME_ACTIVE)
    })

  }, 500);

})
//     this.sidebar_changer.addEventListener('click', function (e) {
//       setTimeout(() => {
//         // console.log('all parent clicked',e);
// // var url = "http://demo.orangesoft.ir/dashboard/base/settings-list"
//         var url = self.$route.path.replace(localStorage.getItem("website_address"), '')
// // console.log("var",url)
//         Array.from(document.querySelectorAll(SELECTOR_NAV_LINK)).forEach(element => {
//           element.classList.remove(CLASS_NAME_ACTIVE)
//         })
//
//         Array.from(document.querySelectorAll(SELECTOR_NAV_LINK)).forEach(element => {
//           element.classList.remove(CLASS_NAME_ACTIVE)
//         })
//         // Array.from(document.querySelectorAll(CLASS_NAME_ACTIVE)).forEach(element => {
//         //   element.classList.remove(CLASS_NAME_ACTIVE)
//         // })
//
//
//         Array.from(document.querySelectorAll(`${SELECTOR_NAV_ITEM} a[href="${url}"]`)).forEach(element => {
//           element.classList.add(CLASS_NAME_ACTIVE)
//         })
//
//       }, 500);
//
//     });
    for (var i = 0; i < this.side_bar_drop_downs.length; i++) {

      var self = this;
      this.side_bar_drop_downs[i].$el.getElementsByTagName('a')[0].addEventListener('click', function (e) {

        console.log("changed side bar", this.parentElement.parentElement)
// var this_el ='';
        for (var z = 0; z < self.side_bar_drop_downs.length; z++) {
          if (self.side_bar_drop_downs[z].$el.classList.contains("c-show")) {
            self.side_bar_drop_downs[z].$el.classList.remove("c-show");
            // this_el =self.side_bar_drop_downs[z].$el;
          }
        }
        // if(this_el != this){
        if (self.opened_drop_downs != this.parentElement) {
          self.opened_drop_downs = this.parentElement;
          console.log("clicked sidebar", this.parentElement)

          this.parentElement.classList.add("c-show");
          var sidenav = this.parentElement.parentElement;
          try {
            const lastChild = this.parentElement.getElementsByTagName('ul')[0].getElementsByTagName('li')[this.parentElement.getElementsByTagName('ul')[0].getElementsByTagName('li').length - 1];
            console.log("last child is ", lastChild)
            const lastChildRect = lastChild.getBoundingClientRect();
            const lastChildBottom = lastChildRect.bottom;

            const sidenavHeight = sidenav.getBoundingClientRect().bottom;

            if (lastChildBottom > sidenavHeight) {
              console.log('Scroll', sidenavHeight, lastChildBottom);
              // lastChild.scrollIntoView();


              setTimeout(function () {
                sidenav.scroll({
                  top: lastChildBottom - sidenavHeight + 100,
                  behavior: 'smooth'
                });
              }, 150);
            }
          } catch (e) {

          }

        } else {
          self.opened_drop_downs = "";
          console.log("all closed");
          var sidenav2 = this.parentElement.parentElement;
          sidenav2.scroll({
            top: -500,
            behavior: 'smooth'
          });
        }

        // }

      })


    }
  }, methods: {
    scroll_sidebar() {
      // var dropdown = document.getElementsByClassName("dropdown-btn");
      // var dropdown = this.parentElement;

      // for (var i = 0; i < dropdown.length; i++) {
      //   dropdown[i].addEventListener("click", function() {
      //     this.classList.toggle("active");
      //     var dropdownContent = this.nextElementSibling;
      //
      //     if (dropdownContent.style.display === "block") {
      //       dropdownContent.style.display = "none";
      //     } else {
      //       dropdownContent.style.display = "block";
      //     }

      // Get last-child bottom
      // });
      // }
    }
  },
  watch: {
    'sidebar_changer': function () {
      console.log("side bar changed")
    }
  }
}
</script>
