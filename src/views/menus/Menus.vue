<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            <CCardBody>

              <CDataTable
                  :items="items"
                  :fields="fields"

                  :items-per-page="20"
                  hover
                  sorter
                  pagination
              >
                <template #ردیف="{item}">

                  <td>
                    <p class="text-muted">{{ item.id }}</p>

                  </td>

                </template>
                <template #نام="{item}">

                  <td>
                    <p class="text-muted">{{ item.title.title }}</p>

                  </td>

                </template>

                <template #لینک="{item}">
                  <td>
                    <p class="text-muted">{{ item.url }}</p>
                  </td>
                </template>

                <template #نوع="{item}">
                  <td>
                    <p class="text-muted">{{ types.filter(x=>x.value==item.type)[0].label }}</p>
                  </td>
                </template>


                <template #عملیات="{item,index}">
                  <td class="py-2">

                    <CButton
                        color="primary"
                        variant="outline"
                        square
                        size="sm"
                        @click="goSubMenus(item,index)"
                    >زیر منو ها
                    </CButton>
                    <CButton
                        color="warning"
                        variant="outline"
                        square
                        size="sm"
                        @click="editDetails(item)"
                    >ویرایش
                    </CButton>
                    <CButton
                        color="danger"
                        variant="outline"
                        square
                        size="sm"
                        @click="delete_item_dialog(item)"
                    >حذف
                    </CButton>
                  </td>
                </template>


              </CDataTable>
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


          </CCardFooter>
        </CCard>
      </CCol>

    </CRow>


  </div>

</template>

<script>
import axios from "axios";
import {bus} from '../../main';


export default {
  name: 'Login',
  data() {
    return {
      confirm_delete_name:new Date().getTime()+"_"+this.$vnode.tag,

      name: '',
      file: '',
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
        {key: 'ردیف', _style: 'width:20%'},
        {key: 'نام', _style: 'width:20%'},
        {key: 'لینک', _style: 'width:20%;'},
        {key: 'نوع', _style: 'width:20%;'},
        {key: 'عملیات', _style: 'width:40%;'},
      ],
      details: [],
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

    editDetails(item) {
      this.name = item.title.title;
      this.type = item.type;
      this.link = item.url;

      this.status_form = item.id;

    }, clear_edit() {
      this.name = '';
      this.link = '';
      this.status_form = 0;
    },
    delete_item_dialog(item) {
      this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟\n در صورت حذف زیر منو ها هم حذف میشوند", ['تایید'], this.confirm_delete_name);

      this.status_form =item.id;

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
      formData.append("menu_id", this.$route.params.menu_id)
      axios.post('/api/admin/site/get_menu',formData, {}).then(function (response) {

        var content_cats = response.data;

        self.items = content_cats.orders.map((item, row_id) => {
          return {...item, row_id}
        });

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
      formData.append('name', this.name);
      formData.append('link', this.link);
      formData.append('type', this.selected_type);
      formData.append('menu', this.$route.params.menu_id)
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
