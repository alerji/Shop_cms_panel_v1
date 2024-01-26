<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            <CCardBody>
              <sl-vue-tree v-model="menus" @click="contextMenuIsVisible=false"
                           @drop="node_droped"
                           @nodecontextmenu="contextmenu"/>
<!--              <CDataTableFixed-->
<!--                  :items="items"-->
<!--                  :fields="fields"-->
<!--                  striped-->
<!--                  :items-per-page="20"-->
<!--                  hover-->
<!--                  sorter-->
<!--                  pagination-->
<!--              >-->
<!--                <template #row="{item}">-->

<!--                  <td>-->
<!--                    <p class="text-muted">{{ item.id }}</p>-->

<!--                  </td>-->

<!--                </template>-->
<!--                <template #نام="{item}">-->

<!--                  <td>-->
<!--                    <p class="text-muted">{{ item.title.title }}</p>-->

<!--                  </td>-->

<!--                </template>-->

<!--                <template #لینک="{item}">-->
<!--                  <td>-->
<!--                    <p class="text-muted">{{ item.url }}</p>-->
<!--                  </td>-->
<!--                </template>-->

<!--                <template #نوع="{item}">-->
<!--                  <td>-->
<!--                    <p class="text-muted">{{ types.filter(x => x.value == item.type)[0].label }}</p>-->
<!--                  </td>-->
<!--                </template>-->


<!--                <template #عملیات="{item,index}">-->
<!--                  <td class="py-2">-->

<!--                    <CButton-->
<!--                        color="primary"-->
<!--                        variant="outline"-->
<!--                        square-->
<!--                        size="sm"-->
<!--                        @click="goSubMenus(item,index)"-->
<!--                    >زیر منو ها-->
<!--                    </CButton>-->
<!--                    <CButton-->
<!--                        color="warning"-->
<!--                        variant="outline"-->
<!--                        square-->
<!--                        size="sm"-->
<!--                        @click="editDetails(item)"-->
<!--                    >-->
<!--                      <CIcon name="cil-pencil" size="sm"/>-->
<!--                    </CButton>-->
<!--                    <CButton-->
<!--                        color="danger"-->
<!--                        variant="outline"-->
<!--                        square-->
<!--                        size="sm"-->
<!--                        @click="delete_item_dialog(item)"-->
<!--                    >-->
<!--                      <CIcon name="cil-trash" size="sm"/>-->
<!--                    </CButton>-->
<!--                  </td>-->
<!--                </template>-->


<!--              </CDataTableFixed>-->
            </CCardBody>

          </CCardHeader>
        </CCard>
      </CCol>
      <CCol col="4">
        <CCard>
          <CCardHeader>
            <strong>افزودن منو</strong>

          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"

                    label="عنوان"
                    placeholder="عنوان"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol col="12">
                <CSelect
                    :value.sync="selected_type"
                    :options="types"
                    label="نوع منو"
                />
              </CCol>
              <CCol col="12">
                <CLinkSelector
                    v-model="link"
                    label="لینک"
                    placeholder="لینک"

                />
                <CIconSelector
                    label="ایکون"
                    v-model="selected_icon"
                />
                <CInput
                    v-model="link"
                    label="لینک"
                    placeholder="لینک"
                />
              </CCol>
            </CRow>


          </CCardBody>
          <CCardFooter>
            <CButton v-if="status_form ==0 "
                     @click="login()"
                     type="submit" ref="submit_form" size="sm" color="primary">
              <CIcon name="cil-check-circle"/>
              افزودن منو
            </CButton>


            <CButton v-if="status_form !=0 "
                     @click="login()"
                     type="submit" ref="submit_form" size="sm" color="warning">
              <CIcon name="cil-check-circle"/>
              ویرایش منو
            </CButton>
            <CButton v-if="status_form !=0 "
                     @click="clear_edit()"
                     type="submit" ref="submit_form" size="sm" color="warning">
              <CIcon name="cil-check-circle"/>
              انصراف
            </CButton>


          </CCardFooter>
        </CCard>
      </CCol>


    </CRow>

    <div class="contextmenu" ref="contextmenu" v-show="contextMenuIsVisible">
      <div @click="editDetails(selected_node)">ویرایش منو</div>
      <div @click="delete_item_dialog(selected_node)">حذف منو</div>
      <div @click="contextMenuIsVisible=false">انصراف</div>
    </div>


  </div>

</template>

<script>
import axios from "axios";
import {bus} from '../../main';

import '../../assets/scss/sl-vue-tree-dark.css'
import SlVueTree from 'sl-vue-tree/src/sl-vue-tree.vue'

export default {
  name: 'Login',
  components: {
    SlVueTree
  },
  data() {
    return {
      contextMenuIsVisible: false,
      menus: [ ],
      confirm_delete_name: new Date().getTime() + "_" + this.$vnode.tag,

      name: '',
      file: '',
      selected_icon: '',
      link: '',
      previewImage: '',
      description: '',
      items: [],
      selected_type: 1,
      types: [
        {label: 'معمولی', value: 1},
        {label: 'کشویی', value: 2},
        {label: 'مگامنو', value: 3}
      ],
      fields: [
        {key: 'row', label: '#', _style: 'width:10%'},
        {key: 'نام', _style: 'width:20%'},
        {key: 'لینک', _style: 'width:20%;'},
        {key: 'نوع', _style: 'width:20%;'},
        {key: 'عملیات', _style: 'width:40%;'},
      ],
      details: [],
      selected_node:{},
      collapseDuration: 0,
      status_form: 0
    }
  }, mounted() {
    this.get_categories();
    bus.$on(this.confirm_delete_name, (data) => {
      // alert(data);
      if (data == 'true') {
        this.delete_item();

      } else {
        this.status_form = 0;
      }
    });
  }, watch: {
    '$route.params.menu_id': function (id) {
      this.get_categories();
    }
  },
  methods: {

    contextmenu(node, event) {
      this.selected_node = node
      event.preventDefault();
      this.contextMenuIsVisible = true;
      const $contextMenu = this.$refs.contextmenu;
      // $contextMenu.style.left = event.clientX + 'px';
      // $contextMenu.style.top = event.clientY + 'px';
      var m = this.getMousePosition(event);
      var s = this.getScrollPosition(event);
      var client_height = document.body.clientHeight;
      var display_context = document.getElementById('context_menu');


      $contextMenu.style.left = m.x + s.x + "px";
      $contextMenu.style.top = m.y + s.y + "px";


    },
    getMousePosition(e) {
      e = e || window.event;
      var position = {
        'x': e.clientX,
        'y': e.clientY
      }
      return position;
    },
    getScrollPosition() {
      var x = 0;
      var y = 0;

      if (typeof (window.pageYOffset) == 'number') {
        x = window.pageXOffset;
        y = window.pageYOffset;
      } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        x = document.documentElement.scrollLeft;
        y = document.documentElement.scrollTop;
      } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        x = document.body.scrollLeft;
        y = document.body.scrollTop;
      }

      var position = {
        'x': x,
        'y': y
      }

      return position;
    },

    editDetails(item) {
      this.contextMenuIsVisible = false;

      console.log("edit called",item)
      this.name = item.title;
      this.selected_type = item.type;
      this.link = item.url;
      this.icon = item.icon;

      this.status_form = item.id;

    },
    clear_edit() {
      this.name = '';
      this.link = '';
      this.status_form = 0;
    },
    node_droped(data1,dat2){
      // console.log("droped",data1);
      // console.log("droped",dat2);
      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/site/arrange_menu";
      formData.append("is_mobile", this.$route.params.menu_id)
      formData.append("placement", dat2.placement)
      formData.append("parent_node", dat2.node.id)
      formData.append("node", data1[0].id)



      axios.post(url, formData, {}).then((res) => {
        console.log(res);

        self.status_form = 0;

        self.get_categories();


      })
          .catch(function (error) {

            console.log(error);
          });
    },
    delete_item_dialog(item) {
      this.contextMenuIsVisible = false;

      this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟\n در صورت حذف زیر منو ها هم حذف میشوند", ['تایید'], this.confirm_delete_name);

      this.status_form = item.id;

    }, delete_item() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/site/delete_menu";


      formData.append('row_id', this.status_form);

      axios.post(url, formData, {}).then((res) => {
        console.log(res);
        if (res.data.error == 1) {
          this.$root.modal_component.show_danger_modal('خطا', res.data.msg);

        } else {
          this.$root.modal_component.show_success_modal('تایید', res.data.msg);

        }
        self.status_form = 0;

        self.get_categories();


      })
          .catch(function (error) {

            console.log(error);
          });
    },
    get_categories() {
      var self = this;
      console.log("route id " + this.$route.params.menu_id);
      var formData = new FormData();
      formData.append("is_mobile", this.$route.params.menu_id)
      axios.post('/api/admin/site/get_menu', formData, {}).then(function (response) {

        var content_cats = response.data;

        self.menus = content_cats.menus

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    goRegister() {
      this.$router.push({path: 'register'});
    }, goSubMenus(item, index) {
      this.$router.push({path: '/dashboard/display/menus/' + this.items[index].id});
    },

    login() {


      let self = this;
      const formData = new FormData()
      let url;
      if (this.status_form == 0) {
        url = "/api/admin/site/add_menu";

      } else {
        url = "/api/admin/site/update_menu";
        formData.append('row_id', this.status_form);

      }


      // formData.append('image', this.file)
      formData.append('title', this.name);
      formData.append('url', this.link);
      formData.append('icon', this.selected_icon);
      formData.append('type', this.selected_type);
      formData.append('is_mobile', this.$route.params.menu_id)
      // formData.append('description', this.description)
      axios.post(url, formData, {}).then((res) => {
        console.log(res);


        // if(this.status_form==0){
        //     url = "/api/admin/category";
        this.$root.modal_component.show_api_response_modals(res);

        self.name = '';
        self.link = '';
        self.description = '';
        self.previewImage = '';
        self.status_form = 0;
        self.get_categories();

      })

          .catch(function (error) {

            console.log(error);
          });

    }
  }
}


</script>
<style>
.contextmenu {
  position: absolute;
  background-color: white;
  color: black;
  border-radius: 2px;
  cursor: pointer;
}

.contextmenu > div {
  padding: 10px;
}

.contextmenu > div:hover {
  background-color: rgba(100, 100, 255, 0.5);
}
</style>