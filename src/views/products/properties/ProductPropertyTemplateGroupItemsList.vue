<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            لیست آیتم ویژگی
          </CCardHeader>
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
                  <p class="text-muted">{{ item.row_id + 1 }}</p>

                </td>

              </template>
              <template #نام="{item}">

                <td>
                  <p class="text-muted">{{ item.title.title }}</p>

                </td>

              </template>


              <template #عملیات="{item}">
                <td class="py-2">
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
                      @click="delete_dialog(item)"
                  >حذف
                  </CButton>
                </td>
              </template>


            </CDataTable>
          </CCardBody>

        </CCard>
      </CCol>
      <CCol col="4">
        <CCard>
          <CCardHeader>
            <strong>ثبت ایتم ویژگی محصولات</strong>

          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"

                    label="نام ایتم"
                />
              </CCol>
            </CRow>


          </CCardBody>
          <CCardFooter>
            <CButton
                @click="login()"
                type="submit" ref="submit_form" size="sm" color="primary">
              {{ status_form == 0 ? 'ثبت ویژگی' : 'ویرایش ویژگی' }}

            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>


  </div>

</template>

<script>
import axios from "axios";
import {bus} from "../../../main";


export default {
  name: 'Login',
  data() {
    return {
      name: '',
      file: '',
      color: '',
      previewImage: '',
      description: '',
      items: [],
      fields: [
        {key: 'ردیف', _style: 'width:10%'},
        {key: 'نام', _style: 'width:10%'},

        {key: 'عملیات', _style: 'width:40%;'},


      ],
      status_form: 0
    }
  }, mounted() {
    bus.$on('delete_confirm', (data) => {
      // alert(data);
      if (data == 'true') {
        this.delete_item();

      } else {
        this.status_form = 0;
      }
    });
    this.get_categories();
  }, watch: {},
  methods: {

    editDetails(item) {
      this.name = item.title.title;

      this.status_form = item.id;

    }, get_categories() {
      var self = this;
      var formData = new FormData();
      formData.append("id", +this.$route.params.group_id)
      axios.post('/api/admin/product/get_property_items', formData, {}).then(function (response) {

        var content_cats = response.data;

        self.items = content_cats.tags.map((item, row_id) => {
          return {...item, row_id}
        });

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    goRegister() {
      this.$router.push({path: 'register'});
    },

    login() {


      let self = this;
      const formData = new FormData()
      let url;
      if (this.status_form == 0) {
        url = "/api/admin/product/add_property_item";
      } else {
        url = "/api/admin/product/update_property_item";
        formData.append('id', this.status_form)

      }

      formData.append('name', this.name);
      formData.append('group_id', this.$route.params.group_id);

      axios.post(url, formData, {}).then((res) => {

        self.$root.modal_component.show_api_response_modals(res);

          self.status_form = 0;
          self.name = '';

          self.get_categories();


      })


          .catch(function (error) {

            console.log(error);
          });

    },
    delete_dialog(item) {
      this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟", ['تایید'], 'delete_confirm');


      this.status_form = item.id;
      // this.$nextTick(() => {
      //     this.collapseDuration = 0
      // })
    },
    delete_item() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/product/delete_property_item";


      formData.append('id', this.status_form);

      axios.post(url, formData, {}).then((res) => {
        console.log(res);
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
