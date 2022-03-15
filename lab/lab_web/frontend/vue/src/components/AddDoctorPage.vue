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
                  v-model="doctor.doctor_name"
                />
                <input
                  type="text"
                  class="form-control mb-4"
                  placeholder="Контакты"
                  v-model="doctor.contacts"
                />
                <textarea class="form-control" placeholder="Комментарий" v-model="doctor.comment" />
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5>Прайс-лист</h5>
              </div>
              <div class="card-body">
                <div v-if="doctor.price_list" class="d-flex">
                  <p class="my-0">{{doctor.price_list.price_list_name}}</p>
                  <a href="#" class="ml-auto text-danger" @click="doctor.price_list=null">
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
                  @choose="item => doctor.price_list = item"
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
import Doctors from "../api/doctors";
import Pricelists from "../api/pricelists";
import LChooser from "./blocks/LChooser";
export default {
  name: "AddDoctorPage",
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
            let doctor = Object.assign({}, this.doctor);
            if (doctor.price_list == null) {
              delete doctor.price_list;
            } else {
              doctor.price_list = doctor.price_list.id;
            }
            if (this.doctorId) {
              return Doctors.updateById(this.doctorId, doctor).then(() =>
                this.$router.push("/books/doctors/")
              );
            }
            Doctors.create(doctor).then(() =>
              this.$router.push("/books/doctors/")
            );
          }
        }
      ],
      doctor: {
        doctor_name: "",
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
  computed: {
    doctorId() {
      let id = parseInt(this.$route.params.id);
      if (isNaN(id)) {
        return 0;
      }
      return id;
    },
    title() {
      return this.clinicId ? "Редактировать врача" : "Добавить врача";
    }
  },
  created() {
    if (this.doctorId) {
      Doctors.getById(this.doctorId).then(
        response => (this.doctor = response.data)
      );
    }
  }
};
</script>

<style>
</style>