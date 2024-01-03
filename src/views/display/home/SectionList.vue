<template>
  <div>

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
                      <p class="text-muted">{{item.section_id}}</p>

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
                          @click="goSectionRows(item)"
                      >ویرایش چیدمان
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

    const fields = [
        { key: 'ردیف', _style:'width:10%' },
        { key: 'نام', _style:'width:10%' },
        { key: 'عملیات', _style:'width:30%;' },

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
                details: [],
                collapseDuration: 0,
                status_form:0
            }
        },mounted() {
this.get_sections();
        },watch: {
            '$route.params.cat_id': function (id) {
                this.get_categories();
            }
        },
        methods: {
            get_style(color) {
                return {
                    myStyle: {
                        backgroundColor: color
                    }
                }
            },
            editDetails(item) {
                // this.$set(this.items[item.id], '_toggled', !item._toggled)
                this.name = this.items[item.id].name
                this.color = this.items[item.id].color
                this.description = this.items[item.id].description
                this.previewImage = this.items[item.id].image
                this.status_form = this.items[item.id].cat_id;
                // this.$nextTick(() => {
                //     this.collapseDuration = 0
                // })
            },get_sections(){
               var self = this;
                console.log("route id "+this.$route.params.cat_id);

                axios.get(  '/api/admin/sections', {

                }).then(function (response) {

                    var content_cats = response.data;

                    // items = content_cats.orders;
                    self.items =  content_cats.sections.map((item, id) => { return {...item, id}}),
                        fields;
                   // console.log("cats is "+items);
                    // self.description = '';
                    // localStorage.setItem("api_token", response.data.access_token);
                    // self.$router.push({ path: 'notes' });
                })
            .catch(function (error) {
                    self.message = 'Incorrect E-mail or password';
                    self.showMessage = true;
                    console.log(error);
                });

            },
            goSectionRows(item){
                this.$router.push({ path: 'section-rows/'+item.section_id });
            },goAddUser(){

                this.$router.push({ path: '/add-user'});
// this.get_categories();
                // this.$router.push({ path: '/posts/'});
            },
        }
    }


</script>
