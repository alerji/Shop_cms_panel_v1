<template>
  <div>
    <CRow>
      <CCol col="6">
        <CCard>
          <CCardHeader>
            <strong>گروه دسترسی</strong>
            <div class="card-header-actions">
              <a
                href="https://coreui.io/vue/docs/components/form-components"
                class="card-header-action"
                rel="noreferrer noopener"
                target="_blank"
              >
                <small class="text-muted"></small>
              </a>
            </div>
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

                      <CDataTable
                          :items="role_items"
                          :fields="fields_role"

                          hover
                          sorter
                      >
                          <template #نام="{item}">

                              <td>
                                  <p class="text-muted">{{item.name}}</p>

                              </td>

                          </template>
                          <template #دسترسی="{item}">

                              <td>
<input type="checkbox" ref="permissions[]"  v-model="role_checkbox_items" :value="item.role_id"/>
                              </td>

                          </template>

                      </CDataTable>
                  </CCardBody>


              </CCol>
            </CRow>

          </CCardBody>
            <CCardFooter>
                <CButton
                    v-if="status_form == 0"
                    @click="login()"
                    type="submit" ref="submit_form" size="sm" color="primary"><CIcon name="cil-check-circle"/> ثبت گروه
                </CButton>
            <CButton v-if="status_form !=0 "
                    @click="login()"
                    type="submit" ref="submit_form" size="sm" color="warning"><CIcon name="cil-check-circle"/> ویرایش گروه
            </CButton>

            <CButton v-if="status_form !=0 "
                    @click="clear_edit()"
                    type="submit" ref="submit_form" size="sm" color="danger"><CIcon name="cil-check-circle"/>انصراف </CButton>
            </CCardFooter>
        </CCard>
      </CCol>
    </CRow>

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
                      <p class="text-muted">{{item.group_id}}</p>

                  </td>

              </template>
              <template #نام="{item}">

                  <td>
                      <p class="text-muted">{{item.name}}</p>

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
                      >ویرایش
                      </CButton>

                  </td>
              </template>



          </CDataTable>
          </CCardBody>


  </div>

</template>

<script>
    import axios from "axios";

    var items = [

    ];
 var items_role = [

    ];

    const fields = [
        { key: 'ردیف', _style:'width:20%' },
        { key: 'نام', _style:'width:20%' },
        { key: 'عملیات', _style:'width:40%;' },


    ];

    const fields_role = [
        { key: 'نام', _style:'width:20%' },
        { key: 'دسترسی', _style:'width:20%' },


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
                items: items.map((item, id) => { return {...item, id}}),
                fields,

                role_items: items_role.map((item, id) => { return {...item, id}}),
                fields_role,
                details: [],
                role_checkbox_items: [],
                collapseDuration: 0,
                status_form:0
            }
        },mounted() {

this.get_groups();
this.get_roles();
        },watch: {
            '$route.params.cat_id': function (id) {
                this.get_categories();
            }
        },
        methods: {

            editDetails(item) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.name = this.items[item.id].name;
                this.role_checkbox_items = this.items[item.id].permissions;
                // this.description = this.items[item.id].description;
                // this.previewImage = this.items[item.id].image;
                this.status_form = this.items[item.id].group_id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },clear_edit(item) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.name = '';
                this.role_checkbox_items = [];
                // this.description = this.items[item.id].description;
                // this.previewImage = this.items[item.id].image;
                this.status_form = 0;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },get_groups(){
               var self = this;
                console.log("route id "+this.$route.params.cat_id);

            var formData = new FormData();

            axios.post('/api/admin/get_role-groups',formData, {}).then(function (response) {
                    console.log("cats is "+response.data.groups);
                    console.log("cats is "+items);

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items =  content_cats.groups.map((item, id) => { return {...item, id}}),
                        fields;
                   // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
            .catch(function (error) {

                    console.log(error);
                });

            },
            get_roles(){
                var self = this;
                console.log("route id "+this.$route.params.cat_id);
              var formData = new FormData();

                axios.post(  '/api/admin/roles',formData, {

                }).then(function (response) {
                    console.log("cats is "+response.data.groups);
                    console.log("cats is "+items);

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.role_items =  content_cats.permissions.map((item, id) => { return {...item, id}}),
                        fields_role;
                    // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
                    .catch(function (error) {

                        console.log(error);
                    });

            },
            goRegister(){
                this.$router.push({ path: 'register' });
            },goSubCategories(item,index){

                this.$router.push({ path: '/categories/'+this.items[index].cat_id});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
            login() {
                let self = this;
                let url;
                if(this.status_form==0){
                    url = "/api/admin/role-groups";
                }else{
                    url = "/api/admin/role-groups/update";
                }
                const formData = new FormData()
                formData.append('name', self.name)
                formData.append('roles', self.role_checkbox_items)
                formData.append('group_id', self.status_form)


                axios.post(  url,formData, {}).then(function (response) {
                    self.name = '';
                    self.role_checkbox_items=[];
                    self.get_groups();
                    self.status_form=0;
                })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    }


</script>
