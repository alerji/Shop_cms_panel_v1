<template>
  <div>
    <CRow>
      <CCol col="6">
        <CCard>
          <CCardHeader>
            <strong>گروه های دسترسی</strong>

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
              <template #row="{item,index}">

                <td>
                  <p class="text-muted">{{ index+1 }}</p>

                </td>

              </template>
              <template #نام="{item}">

                <td>
                  <p class="text-muted">{{ item.name }}</p>

                </td>

              </template>


              <template #عملیات="{item,index}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="editDetails(item)"
                  >
                    <CIcon name="cil-pencil" size="sm"/>
                  </CButton>

                </td>
              </template>


            </CDataTableFixed>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol col="6">
        <CCard>
          <CCardHeader>
            <strong>افزودن گروه دسترسی</strong>

          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol col="12">
                <CInput
                    v-model="name"

                    label="نام گروه"
                    placeholder="نام گروه"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol col="12">
                <CCardBody>
                  <CDataTableFixed
                      :items="role_items"
                      :fields="fields_role"

                      hover
                      sorter
                  >
                    <template #نام="{item}">

                      <td>
                        <p class="text-muted">{{ item.name }}</p>

                      </td>

                    </template>
                    <template #دسترسی="{item}">

                      <td>
                        <input type="checkbox" ref="permissions[]" v-model="role_checkbox_items" :value="item.id"/>
                      </td>

                    </template>

                  </CDataTableFixed>
                </CCardBody>


              </CCol>
            </CRow>

          </CCardBody>
          <CCardFooter>
            <CButton
                v-if="status_form == 0"
                @click="login()"
                type="submit" ref="submit_form" size="sm" color="primary">
              <CIcon name="cil-check-circle"/>
              ثبت گروه
            </CButton>
            <CButton v-if="status_form !=0 "
                     @click="login()"
                     type="submit" ref="submit_form" size="sm" color="warning">
              <CIcon name="cil-check-circle"/>
              ویرایش گروه
            </CButton>

            <CButton v-if="status_form !=0 "
                     @click="clear_edit()"
                     type="submit" ref="submit_form" size="sm" color="danger">
              <CIcon name="cil-check-circle"/>
              انصراف
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>


  </div>

</template>

<script>
import axios from "axios";

var items = [];
var items_role = [];

const fields = [
  {key: 'row', label: '#', _style: 'width:10%'},
  {key: 'نام', _style: 'width:20%'},
  {key: 'عملیات', _style: 'width:10%;'},


];

const fields_role = [
  {key: 'نام', _style: 'width:20%'},
  {key: 'دسترسی', _style: 'width:20%'},


];


export default {
  name: 'Login',
  data() {
    return {
      name: '',
      file: '',
      color: '',
      previewImage: '',
      description: '',
      items: items.map((item, row_id) => {
        return {...item, row_id}
      }),
      fields,

      role_items: items_role.map((item, row_id) => {
        return {...item, row_id}
      }),
      fields_role,
      details: [],
      role_checkbox_items: [],
      collapseDuration: 0,
      status_form: 0
    }
  }, mounted() {

    this.get_groups();
    this.get_roles();
  }, watch: {
    '$route.params.cat_id': function (id) {
      this.get_categories();
    }
  },
  methods: {

    editDetails(item) {
      this.name = item.name;
      this.role_checkbox_items =item.permissions.map((item, row_id) => {
        return item.id
      });
      this.status_form = item.id;

    }, clear_edit(item) {
      // this.$set(this.items[item.id], '_toggled', !item._toggled)
      this.name = '';
      this.role_checkbox_items = [];
      // this.description = this.items[item.id].description;
      // this.previewImage = this.items[item.id].image;
      this.status_form = 0;
      // this.$nextTick(() => {
      //     this.collapseDuration = 0
      // })
    }, get_groups() {
      var self = this;

      var formData = new FormData();

      axios.post('/api/admin/user/get_permission_group', formData, {}).then(function (response) {

        var content_cats = response.data;
        self.items = content_cats.groups.map((item, row_id) => {
          return {...item, row_id}
        });

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_roles() {
      var self = this;
      var formData = new FormData();

      axios.post('/api/admin/user/get_roles', formData, {}).then(function (response) {

        var content_cats = response.data;

        // items = content_cats.orders;
        self.role_items = content_cats.groups.map((item, row_id) => {
          return {...item, row_id}
        });
        // console.log("cats is "+items);
        // self.description = '';
        // localStorage.setItem("api_token", response.data.access_token);
        // self.$router.push({ path: 'notes' });
      })
          .catch(function (error) {

            console.log(error);
          });

    },

    login() {
      let self = this;
      let url;
      if (this.status_form == 0) {
        url = "/api/admin/user/add_permission_group";
      } else {
        url = "/api/admin/user/update_permission_group";
      }
      const formData = new FormData()
      formData.append('name', self.name)
      formData.append('roles', self.role_checkbox_items)
      formData.append('group_id', self.status_form)


      axios.post(url, formData, {}).then(function (response) {
        self.name = '';
        self.role_checkbox_items = [];
        self.get_groups();
        self.status_form = 0;
      })
          .catch(function (error) {
            console.log(error);
          });

    }
  }
}


</script>
