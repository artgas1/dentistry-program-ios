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
                  placeholder="ФИО"
                  v-model="technician.technician_name"
                />
                <input
                  type="text"
                  class="form-control mb-4"
                  placeholder="Контакты"
                  v-model="technician.contacts"
                />
                <textarea
                  class="form-control"
                  placeholder="Комментарий"
                  v-model="technician.comment"
                />
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5>Прайс-лист</h5>
              </div>
              <div class="card-body">
                <div v-if="technician.price_list" class="d-flex">
                  <p class="my-0">{{technician.price_list.price_list_name}}</p>
                  <a href="#" class="ml-auto text-danger" @click="technician.price_list=null">
                    <span class="jam jam-trash"></span>
                  </a>
                </div>
                <div class="text-center p-4 text-muted" v-else>Прайс-лист не выбран</div>
                <l-chooser
                  :all-items-loader="loadPricelists"
                  title="Выбрать прайс-лист"
                  search-input-placeholder="Название прайс-листа"
                  :search-filter="suggestedItemsFilter"
                  ref="itemsList"
                  @choose="item => technician.price_list = item"
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
import Technicians from "../api/technicians";
import Pricelists from "../api/pricelists";
export default {
  name: "AddTechnicianPage",
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
            let technician = Object.assign({}, this.technician);
            if (technician.price_list == null) {
              delete technician.price_list;
            } else {
              technician.price_list = technician.price_list.id;
            }
            if (this.technicianId) {
              return Technicians.updateById(this.technicianId, technician).then(
                () => this.$router.push("/books/technicians/")
              );
            }
            Technicians.create(technician).then(() =>
              this.$router.push("/books/technicians/")
            );
          }
        }
      ],
      technician: {
        technician_name: null,
        contacts: "",
        price_list: null,
        comment: ""
      }
    };
  },
  methods: {
    suggestedItemsFilter(item, query) {
      return item.price_list_name.indexOf(query) + 1;
    },
    loadPricelists() {
      return Pricelists.Operations.get().then(response => {
        return new Promise(r => r(response.data));
      });
    }
  },
  computed: {
    technicianId() {
      let id = parseInt(this.$route.params.id);
      if (isNaN(id)) {
        return 0;
      }
      return id;
    },
    title() {
      return this.technicianId ? "Редактировать техника" : "Добавить техника";
    }
  },
  created() {
    if (this.technicianId) {
      Technicians.getById(this.technicianId).then(
        response => (this.technician = response.data)
      );
    }
  }
};
</script>

<style>
</style>