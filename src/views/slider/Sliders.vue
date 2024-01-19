<template>
  <div>
    <CCard>
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
              <p class="text-muted">{{ item.id }}</p>

            </td>

          </template>
          <template #نام="{item}">

            <td>
              <p class="text-muted">{{ item.name }}</p>

            </td>

          </template>

          <template #تعداد="{item}">

            <td>
              <p class="text-muted">{{ item.slider_count }}</p>

            </td>

          </template>


          <template #عملیات="{item,index}">
            <td class="py-2">

              <CButton
                  color="primary"
                  variant="outline"
                  square
                  size="sm"
                  @click="goSliderImages(item,index)"
              >تصاویر اسلایدر
              </CButton>
            </td>
          </template>


        </CDataTableFixed>
      </CCardBody>

    </CCard>


  </div>

</template>

<script>
import axios from "axios";

var items = [];

const fields = [
  {key: 'row', label: '#', _style: 'width:10%'},
  {key: 'نام', _style: 'width:20%'},
  {key: 'تعداد', _style: 'width:20%;'},
  {key: 'عملیات', _style: 'width:40%;'},


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
      items: items.map((item, id) => {
        return {...item, id}
      }),
      fields,
      details: [],
      collapseDuration: 0,
      status_form: 0
    }
  }, mounted() {
    this.get_categories();
  }, watch: {
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
    }, get_categories() {
      var self = this;
      console.log("route id " + this.$route.params.cat_id);
var formData = new FormData()
      axios.post('/api/admin/site/get_sliders',formData, {}).then(function (response) {

        var content_cats = response.data;

        // items = content_cats.orders;
        self.items = content_cats.orders.map((item, row_id) => {
          return {...item, row_id}
        });

      })
          .catch(function (error) {

            console.log(error);
          });

    },
    goSliderImages(item, index) {
      this.$router.push({path: '/dashboard/display/slider-images/' + this.items[index].id});
    },
  }
}


</script>
