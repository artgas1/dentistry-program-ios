<template>
  <div class="wrapper">
    <l-nav current-menu-item="books"></l-nav>
    <div class="main-panel" id="main-panel">
      <l-header title="Добавить платеж" :buttons="buttons" />
      <div class="content">
        <div class="row">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5>Общая информация</h5>
              </div>
              <div class="card-body">
                <div class="form-group">
                  <label for="input-date" class="control-label">Дата платежа</label>
                  <l-date-picker v-model="payment.date" />
                </div>
                <div class="form-group">
                  <label for="input-datetime" class="control-label">Сумма платежа</label>
                  <div>
                    <div class="input-group">
                      <input
                        class="form-control"
                        type="number"
                        :min="1"
                        v-model="payment.amount"
                        @input="$set(payment, 'amount', parseInt($event.target.value))"
                      />
                      <div class="input-group-append">
                        <span class="input-group-text">&#x20bd;</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label for class="control-label">Способ оплаты</label>
                  <select class="form-control mb-4" v-model="payment.payment_form">
                    <option value="N">Наличные</option>
                    <option value="B">Безналичная оплата</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for class="control-label">Комментарий</label>
                  <textarea class="form-control" v-model="payment.comment" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5>Заказчик</h5>
              </div>
              <div class="card-body">
                <div class="form-group" v-if="!payment.doctor">
                  <label for="input-clinic" class="control-label">Клиника</label>
                  <div class="my-0 d-flex" v-if="payment.clinic">
                    <span>{{payment.clinic.clinic_name}}</span>
                    <a href="#" class="ml-auto text-danger" @click="payment.clinic=null">
                      <span class="jam jam-trash"></span>
                    </a>
                  </div>
                  <div class="text-center p-4 text-muted" v-else>Клиника не выбрана</div>
                  <l-chooser
                    :button-shown="!payment.clinic"
                    :all-items-loader="loadClinics"
                    title="Выбрать клинику"
                    search-input-placeholder="Название клиники"
                    :search-filter="(item, query) => item.clinic_name.indexOf(query) + 1"
                    @choose="clinic => clinicChosen(clinic)"
                  >
                    <template v-slot:addItemRow="{ item }">
                      <p class="my-0">{{item.clinic_name}}</p>
                    </template>
                  </l-chooser>
                </div>
                <div class="form-group" v-if="!payment.clinic">
                  <label for="input-doctor" class="control-label">Врач</label>
                  <div class="my-0 d-flex" v-if="payment.doctor">
                    <span>{{payment.doctor.doctor_name}}</span>
                    <a href="#" class="ml-auto text-danger" @click="payment.doctor=null">
                      <span class="jam jam-trash"></span>
                    </a>
                  </div>
                  <div class="text-center p-4 text-muted" v-else>Врач не выбран</div>
                  <l-chooser
                    :button-shown="!payment.doctor"
                    :all-items-loader="loadDoctors"
                    title="Выбрать врача"
                    search-input-placeholder="ФИО врача"
                    :search-filter="(item, query) => item.doctor_name.indexOf(query) + 1"
                    @choose="doctor => doctorChosen(doctor)"
                  >
                    <template v-slot:addItemRow="{ item }">
                      <p class="my-0">{{item.doctor_name}}</p>
                    </template>
                  </l-chooser>
                </div>
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
import Doctors from "../api/doctors";
import Payments from "../api/payments";
import LDatePicker from "./blocks/LDatePicker";
export default {
  name: "AddClinicPage",
  components: {
    LNav,
    LHeader,
    LChooser,
    LDatePicker
  },
  data() {
    return {
      buttons: [
        {
          text: "Сохранить",
          click: () => {
            let payment = Object.assign({}, this.payment);
            if (payment.clinic == null) {
              delete payment.clinic;
            } else {
              payment.clinic = payment.clinic.id;
            }
            if (payment.doctor == null) {
              delete payment.doctor;
            } else {
              payment.doctor = payment.doctor.id;
            }
            Payments.create(payment).then(() =>
              this.$router.push(
                `/finance/${this.payment.clinic ? "clinics" : "doctors"}/${
                  this.payment.clinic
                    ? this.payment.clinic.id
                    : this.payment.doctor.id
                }/`
              )
            );
          }
        }
      ],
      payment: {
        date: new Date(),
        clinic: null,
        doctor: null
      }
    };
  },
  methods: {
    suggestedItemsFilter(item, query) {
      return item.price_list_name.indexOf(query) + 1;
    },
    loadClinics() {
      return Clinics.get().then(response => new Promise(r => r(response.data)));
    },
    loadDoctors() {
      return Doctors.get().then(response => new Promise(r => r(response.data)));
    },
    clinicChosen(clinic) {
      this.payment.clinic = clinic;
      this.payment.doctor = null;
    },
    doctorChosen(doctor) {
      this.payment.doctor = doctor;
      this.payment.clinic = null;
    }
  },
  created() {
    if (this.$route.query.customer) {
      let [customerType, customerId] = this.$route.query.customer.split("-");
      (customerType == "clinics" ? Clinics : Doctors)
        .getById(parseInt(customerId))
        .then(response => {
          if (customerType == "clinics") {
            this.payment.clinic = response.data;
          } else {
            this.payment.doctor = response.data;
          }
        });
    }
  }
};
</script>

<style>
</style>