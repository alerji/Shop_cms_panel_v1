<template>
  <div>

    <CCard>
      <CCardHeader>
        نظرات کاربران
        <strong>{{ product_title }}</strong>
        <CButton
            @click="import_comment_modal=true"
            color="primary" size="sm" v-if="product_title!=''">
          <CIcon name="cil-plus"/>
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTabs>
          <CTab :title="'منتشر شده'+' ('+items_active.length+')'">

            <CDataTableFixed
                :items="items_active"
                :fields="fields"

                :items-per-page="20"
                hover
                sorter
                pagination
            >
              <template #row="{item}">

                <td>
                  <p class="text-muted">{{ item.id }}</p>

                </td>

              </template>
              <template #کاربر="{item}">
                <td>
                  <p class="text-muted" >{{ item.name }}</p>
                </td>
              </template>

              <template #product="{item}">
                <td>
                  <p class="text-muted">{{ item.product.title.title }}</p>
                </td>
              </template>
              <template #دیدگاه="{item}">

                <td>
                  <p class="text-muted">{{ item.summary }}</p>

                </td>

              </template>
              <template #تاریخ="{item}">

                <td>
                  <p class="text-muted">{{ get_date_time(item.created_at) }}</p>

                </td>

              </template>

              <template #عملیات="{item,index}">
                <td class="py-2">
                  <CButton
                      color="warning"
                      variant="outline"
                      square
                      size="sm"
                      @click="change_status(item,'0')"
                  >عدم انتشار
                  </CButton>
                  <CButton
                      color="danger"
                      variant="outline"
                      square
                      size="sm"
                      @click="change_status(item,'2')"
                  >
                    <CIcon name="cil-trash" size="sm"/>
                  </CButton>
                </td>
              </template>


            </CDataTableFixed>

          </CTab>

          <CTab :title="'منتشر نشده'+' ('+items_deactive.length+')'">
            <CDataTableFixed
                :items="items_deactive"
                :fields="fields"

                :items-per-page="20"
                hover
                sorter
                pagination
            >
              <template #row="{item}">

                <td>
                  <p class="text-muted">{{ item.id }}</p>

                </td>

              </template>
              <template #کاربر="{item}">
                <td>
                  <p class="text-muted" >{{ item.name }}</p>
                </td>
              </template>

              <template #product="{item}">
                <td>
                  <p class="text-muted">{{ item.product.title.title }}</p>
                </td>
              </template>
              <template #دیدگاه="{item}">

                <td>
                  <p class="text-muted">{{ item.summary }}</p>

                </td>

              </template>
              <template #تاریخ="{item}">

                <td>
                  <p class="text-muted">{{ get_date_time(item.created_at) }}</p>

                </td>

              </template>


              <template #عملیات="{item,index}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="change_status(item,'1')"
                  >انتشار
                  </CButton>
                  <CButton
                      color="danger"
                      variant="outline"
                      square
                      size="sm"
                      @click="change_status(item,'2')"
                  >
                    <CIcon name="cil-trash" size="sm"/>
                  </CButton>


                </td>
              </template>


            </CDataTableFixed>

          </CTab>
          <CTab :title="'حذف شده'+' ('+items_deleted.length+')'">

            <CDataTableFixed
                :items="items_deleted"
                :fields="fields"

                :items-per-page="20"
                hover
                sorter
                pagination
            >
              <template #row="{item}">
                <td>
                  <p class="text-muted">{{ item.id }}</p>
                </td>
              </template>
              <template #کاربر="{item}">
                <td>
                  <p class="text-muted" >{{ item.name }}</p>
                </td>
              </template>

              <template #product="{item}">
                <td>
                  <p class="text-muted">{{ item.product.title.title }}</p>
                </td>
              </template>
              <template #دیدگاه="{item}">
                <td>
                  <p class="text-muted">{{ item.summary }}</p>
                </td>
              </template>
              <template #تاریخ="{item}">
                <td>
                  <p class="text-muted">{{ get_date_time(item.created_at) }}</p>
                </td>
              </template>


              <template #عملیات="{item,index}">
                <td class="py-2">
                  <CButton
                      color="primary"
                      variant="outline"
                      square
                      size="sm"
                      @click="change_status(item,'1')"
                  >انتشار
                  </CButton>

                </td>
              </template>


            </CDataTableFixed>

          </CTab>
        </CTabs>
      </CCardBody>

    </CCard>

    <CModal
        :show.sync="import_comment_modal"
        :no-close-on-backdrop="false"
        color="transparent"
        size="lg"
        border-color="primary"
    >

      <CRow>
        <CCol col="12">
          <CInput v-if="import_comments.length==0" v-model="site_link"
                  label="لینک محصول"
          />
        </CCol>
        <CCol col="12">
          <CDataTableFixed
              v-if="import_comments.length>0"
              :items="import_comments"
              :fields="import_comments_field"

              :items-per-page="20"
              hover
              sorter
              pagination
          >
            <template #row="{item,index}">
              <td>
                <input type="checkbox" v-model="import_comment_checkbox" :value="index"/>
              </td>
            </template>

            <template #کاربر="{item}">
              <td>
                <CInput v-model="item.author"/>
              </td>
            </template>
            <template #تاریخ="{item}">
              <td>
                <CInput v-model="item.datePublished"/>
              </td>
            </template>

            <template #متن="{item}">
              <td>
                <CTextarea v-model="item.description"/>
              </td>
            </template>

          </CDataTableFixed>

        </CCol>

      </CRow>

      <template #footer>
        <CButton @click="import_comment_data()" v-if="import_comments.length==0" color="dark">دریافت کامنت ها</CButton>
        <CButton @click="insert_imported_comment()" v-if="import_comments.length!=0" color="dark">افزودن کامنت ها
        </CButton>
        <CButton @click="import_comment_modal = false,import_comments=''" color="dark">انصراف</CButton>

      </template>
    </CModal>

  </div>

</template>

<script>
import axios from "axios";

var items_active = [];
var items_deactive = [];
var items_deleted = [];


const fields = [
  {key: 'row', label: '#', _style: 'width:5%'},
  {key: 'کاربر', _style: 'width:10%'},
  {key: 'product', label: 'محصول', _style: 'width:15%'},
  {key: 'دیدگاه', _style: 'width:20%;'},
  {key: 'تاریخ', _style: 'width:10%;'},
  {key: 'عملیات', _style: 'width:10%;'},

];


export default {
  name: 'Login',
  components: {
    // Use the <ckeditor> component in this view.
  },
  data() {
    return {
      import_comment_modal: false,
      site_link: '',
      import_comments: [],
      import_comments_field: [
        {key: 'row', label: '#', _style: 'width:5%'},
        {key: 'کاربر', _style: 'width:10%'},
        {key: 'متن', _style: 'width:30%'},
        {key: 'تاریخ', _style: 'width:10%'}
      ],
      import_comment_checkbox: [],

      name: '',
      product_title: '',
      file: '',
      color: '',
      previewImage: '',
      description: '',
      items_active: items_active.map((item, id) => {
        return {...item, id}
      }),
      fields,
      items_deactive: items_deactive.map((item, id) => {
        return {...item, id}
      }),
      items_deleted: items_deleted.map((item, id) => {
        return {...item, id}
      }),


      details: [],
      collapseDuration: 0,
      status_form: 0
    }
  }, mounted() {
    this.get_comments();
  }, watch: {
    '$route.params.cat_id': function (id) {
      this.get_comments();
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
    import_comment_data() {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
      let formData = new FormData();
      formData.append("site_link", this.site_link)

      axios.post('/api/admin/product/get_comment_other_site', formData, {}).then(function (response) {

        var contents = response.data;
        self.import_comment_checkbox = []
        self.import_comments = contents;
        // items = content_cats.orders;

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    insert_imported_comment() {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
      let formData = new FormData();
      var json = [];
      this.import_comments.forEach(function (val, index) {
        if (self.import_comment_checkbox.includes(index)) {
          json.push(val)
        }
      })
      formData.append("comments", JSON.stringify(json))
      formData.append("product_id", this.$route.params.product_id)

      axios.post('/api/admin/product/insert_imported_comment', formData, {}).then(function (response) {
        self.import_comment_modal = false
        self.get_comments()

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    get_comments() {
      var self = this;
      // console.log("route id "+this.$route.params.cat_id);
      let formData = new FormData();
      if (this.$route.params.product_id != null) {
        formData.append("product_id", this.$route.params.product_id)
      }
      axios.post('/api/admin/product/product_comments', formData, {}).then(function (response) {

        var contents = response.data;

        // items = content_cats.orders;

        self.items_active = contents.comments_active
        self.items_deactive = contents.comments_deactive
        self.items_deleted = contents.comments_deleted

        if (contents.product != null) {
          self.product_title = contents.product.title.title
        }
      })
          .catch(function (error) {

            console.log(error);
          });

    },
    change_status(item, status) {
      let self = this;
      const formData = new FormData();
      let url;
      url = "/api/admin/product/change_product_comment_status";

      formData.append('comment_id', item.id);
      formData.append('comment_status', status);

      axios.post(url, formData, {}).then((res) => {

        self.get_comments();

      })

          .catch(function (error) {

            console.log(error);
          });


    },
  }
}


</script>
