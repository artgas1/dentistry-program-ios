<template>
  <div class="wrapper">
    <l-nav current-menu-item="books"></l-nav>
    <div class="main-panel" id="main-panel">
      <l-header :title="title" :buttons="buttons" />
      <div class="content">
        <div class="row">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5>Общая информация</h5>
              </div>
              <div class="card-body">
                <input
                  type="text"
                  class="form-control mb-4"
                  placeholder="Название"
                  v-model="clinic.clinic_name"
                />
                <input
                  type="text"
                  class="form-control mb-4"
                  placeholder="Контакты"
                  v-model="clinic.contacts"
                />
                <textarea class="form-control" placeholder="Комментарий" v-model="clinic.comment" />
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5>Прайс-лист</h5>
              </div>
              <div class="card-body">
                <div v-if="clinic.price_list" class="d-flex">
                  <p class="my-0">{{clinic.price_list.price_list_name}}</p>
                  <a href="#" class="ml-auto text-danger" @click="clinic.price_list=null">
                    <span class="jam jam-trash"></span>
                  </a>
                </div>
                <div class="text-center p-4 text-muted" v-else>Прайс-лист не выбран</div>
                <l-chooser
                  :all-items-loader="loadPricelists"
                  title="Выбрать прайс-лист"
                  add-item-input-placeholder="Название прайс-листа"
                  :search-filter="suggestedItemsFilter"
                  ref="itemsList"
                  @choose="item => clinic.price_list = item"
                >
                  <template v-slot:addItemRow="{ item }">
                    <p class="my-0">{{item.price_list_name}}</p>
                  </template>
                </l-chooser>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LNav from "./blocks/LNav";
import LHeader from "./blocks/LHeader";
import LChooser from "./blocks/LChooser";
import Clinics from "../api/clinics";
import Pricelists from "../api/pricelists";
export default {
  name: "AddClinicPage",
  components: {
    LNav,
    LHeader,
    LChooser
  },
  data() {
    return {
      buttons: [
        {
          text: "Сохранить",
          click: () => {
            let clinic = Object.assign({}, this.clinic);
            if (clinic.price_list == null) {
              delete clinic.price_list;
            } else {
              clinic.price_list = clinic.price_list.id;
            }
            if (this.clinicId) {
              return Clinics.updateById(this.clinicId, clinic).then(() =>
                this.$router.push("/books/clinics/")
              );
            }
            Clinics.create(clinic).then(() =>
              this.$router.push("/books/clinics/")
            );
          }
        }
      ],
      clinic: {
        clinic_name: "",
        contacts: "",
        comment: "",
        price_list: null
      }
    };
  },
  methods: {
    suggestedItemsFilter(item, query) {
      return item.price_list_name.indexOf(query) + 1;
    },
    loadPricelists() {
      return Pricelists.Works.get().then(
        response => new Promise(r => r(response.data))
      );
    }
  },
  created() {
    if (this.clinicId) {
      Clinics.getById(this.clinicId).then(
        response => (this.clinic = response.data)
      );
    }
  },
  computed: {
    clinicId() {
      let id = parseInt(this.$route.params.id);
      if (isNaN(id)) {
        return 0;
      }
      return id;
    },
    title() {
      return this.clinicId ? "Редактировать клинику" : "Добавить клинику";
    }
  }
};
</script>

<style>
</style>