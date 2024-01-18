<template>
  <div>
    <CRow>
      <CCol col="8">
        <CCard>
          <CCardHeader>
            لیست الگو ویژگی
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
                  <p class="text-muted">{{ item.title }}</p>

                </td>

              </template>


              <template #عملیات="{item}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="goSubCategories(item)"
                  >گروه های الگو
                  </CButton>
                  <CButton
                      color="warning"
                      variant="outline"
                      square
                      size="sm"
                      @click="editDetails(item)"
                  ><CIcon name="cil-pencil" size="sm"/>
                  </CButton>
                  <CButton
                      color="danger"
                      variant="outline"
                      square
                      size="sm"
                      @click="delete_dialog(item)"
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
            <strong>ثبت الگو ویژگی محصولات</strong>

          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"

                    label="نام الگو"
                />
              </CCol>
            </CRow>


          </CCardBody>
          <CCardFooter>
            <CButton
                @click="login()"
                type="submit" ref="submit_form" size="sm" color="primary">
              <CIcon name="cil-check-circle"/>
             {{status_form==0 ? 'ثبت الگو' : 'ویرایش الگو' }}
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
      confirm_delete_name:new Date().getTime()+"_"+this.$vnode.tag,

      name: '',
      file: '',
      color: '',
      previewImage: '',
      description: '',
      items: [],
      fields: [
        {key: 'row',label: '#', _style: 'width:10%'},
        {key: 'نام', _style: 'width:10%'},
        {key: 'عملیات', _style: 'width:40%;'},
      ],
      status_form: 0
    }
  }, mounted() {
    bus.$on(this.confirm_delete_name, (data) => {
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
    get_style(color) {
      return {
        myStyle: {
          backgroundColor: color
        }
      }
    },
    editDetails(item) {
      this.name = item.title;
      this.status_form = item.id;

    }, get_categories() {
      var self = this;
      var formData = new FormData();
      axios.post('/api/admin/product/get_properties', formData, {}).then(function (response) {

        var content_cats = response.data;

        self.items = content_cats.tags.map((item, row_id) => {
          return {...item, row_id}
        });

      })
          .catch(function (error) {

            console.log(error);
          });

    },

    goSubCategories(item) {
      this.$router.push({path: '/dashboard/products/property-groups/' + item.id});
    },
    login() {


      let self = this;
      const formData = new FormData()
      let url;
      if (this.status_form == 0) {
        url = "/api/admin/product/add_property";
      } else {
        url = "/api/admin/product/update_property";
        formData.append('id', this.status_form)

      }

      formData.append('name', this.name);

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
      this.$root.modal_component.show_confirm_modal('اخطار', "آیا مایل به حذف این ردیف هستید؟", ['تایید'], this.confirm_delete_name);
      this.status_form = item.id;

    },
    delete_item() {


      let self = this;
      const formData = new FormData()
      let url;
      url = "/api/admin/product/delete_property";


      formData.append('id', this.status_form);

      axios.post(url, formData, {}).then((res) => {
        self.$root.modal_component.show_api_response_modals(res);

        self.status_form = 0;
        self.get_categories();

      })
          .catch(function (error) {

            console.log(error);
          });
// this.get_categories();
      // this.$router.push({ path: '/posts/'});
    },


  }
}


</script>
