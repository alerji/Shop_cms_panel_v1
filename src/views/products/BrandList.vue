<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            <strong>لیست برند</strong>

          </CCardHeader>
          <CCardBody>

            <CDataTableFixed
                :items="items"
                :fields="fields"

                :items-per-page="20"
                hover
                sorter
                pagination
            >
              <template #row="{item}">

                <td>
                  <p class="text-muted">{{ item.row_id + 1 }}</p>

                </td>

              </template>
              <template #نام="{item}">

                <td>
                  <p class="text-muted">{{ item.title.title }}</p>

                </td>

              </template>

              <template #تصویر="{item}">


                <td>
                  <CImg width="50px" height="50px" v-bind:src="item.image"/>
                </td>

              </template>

              <template #عملیات="{item,index}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      class="mr-1"
                      size="sm"
                      @click="editDetails(item)"
                  ><CIcon name="cil-pencil" size="sm"/>
                  </CButton>

                  <CButton
                      color="danger"
                      variant="outline"
                      square
                      class="mr-1"

                      size="sm"
                      @click="delete_item_dialog(item)"
                  ><CIcon name="cil-trash" size="sm"/>
                  </CButton>
                </td>
              </template>


            </CDataTableFixed>
          </CCardBody>

        </CCard>
      </CCol>
      <CCol col="4">
        <CCard>
          <CCardHeader>
            <strong>ثبت دسته بندی</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"

                    label="نام برند"
                    placeholder="نام برند"
                />
              </CCol>
              <CCol col="12">
                <CTextarea
                    v-model="description"

                    label="توضیحات برند"
                    placeholder="توضیحات"

                    rows="4"
                />

              </CCol>
              <CCol col="12">
                <ImageSelector label="تصویر"
                               :file.sync="file"
                               :preview-image="previewImage"
                />
              </CCol>
            </CRow>


          </CCardBody>
          <CCardFooter>
            <CButton
                @click="login()"
                type="submit" ref="submit_form" size="sm" color="primary">
              ثبت برند
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
      file: null,
      color: '',
      previewImage: null,
      description: '',
      items: [],
      fields: [
        {key: 'row',label: '#', _style: 'width:7%'},
        {key: 'تصویر', _style: 'width:10%;'},
        {key: 'نام', _style: 'width:20%'},
        {key: 'عملیات', _style: 'width:10%;'},

      ],

      status_form: 0,

    }
  }, mounted() {
    this.get_categories();
    bus.$on(this.confirm_delete_name, (data) => {
      // alert(data);
      if (data == "true") {
        this.delete_item();

      } else {
        this.status_form = 0;
      }
    });
  }, watch: {
    '$route.params.cat_id': function () {
      this.get_categories();
    }
  },
  methods: {

    editDetails(item) {
      this.name = item.title.title;
      this.description = item.title.summary;
      this.previewImage = item.image;

      this.status_form = item.id;

    },
    get_categories() {
      var self = this;
var formData = new FormData();
      axios.post('/api/admin/product/get_brands',formData, {}).then(function (response) {

        var content_cats = response.data;

        self.items = content_cats.orders.map((item, row_id) => {
          return {...item, row_id}
        })

      })
          .catch(function (error) {

            console.log(error);
          });

    },


    login() {


      let self = this;
      const formData = new FormData()
      let url;
      if (this.status_form == 0) {
        url = "/api/admin/product/insert_brand";
      } else {
        url = "/api/admin/product/update_brand";
        formData.append('id', this.status_form)

      }

      formData.append('image', this.file);

      formData.append('name', this.name);
      formData.append('description', this.description);
      axios.post(url, formData, {}).then((res) => {
        console.log(res)


        if (res.data.error == 0) {
          url = "/api/admin/category";
          self.name = '';
          self.color = '';
          self.description = '';
          self.previewImage = '';
          self.previewImage_header = '';
          self.status_form = 0;
          self.get_categories();
        }

      })


          .catch(function (error) {

            console.log(error);
          });

    },
    delete_item_dialog(item) {
      this.$root.modal_component.show_confirm_modal(this.$t("warning"), this.$t("deleteMessage"), [this.$t("ok")], this.confirm_delete_name);

      this.status_form = item.id;

    },
    delete_item() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/product/delete_brand";


      formData.append('id', this.status_form);

      axios.post(url, formData, {}).then((res) => {

        self.$root.modal_component.show_api_response_modals(res);
        self.status_form = 0;

        self.get_categories();


      })
          .catch(function (error) {
            console.log(error);
          });
    },
  }
}


</script>
