<template>
  <div class="wrapper">
    <l-nav current-menu-item="orders"></l-nav>
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
                <div class="form-group">
                  <label for="input-date" class="control-label">Дата наряда</label>
                  <l-date-picker v-model="order.date" :default-value="order.date" ref="datePicker" />
                </div>
                <div class="form-group">
                  <label for="input-clinic" class="control-label">Клиника</label>
                  <div class="my-0 d-flex" v-if="order.clinic">
                    <span>{{order.clinic.clinic_name}}</span>
                    <a href="#" class="ml-auto text-danger" @click="order.clinic=null">
                      <span class="jam jam-trash"></span>
                    </a>
                  </div>
                  <div class="text-center p-4 text-muted" v-else>Клиника не выбрана</div>
                  <l-chooser
                    :button-shown="!order.clinic"
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
                <div class="form-group">
                  <label for="input-doctor" class="control-label">Врач</label>
                  <div class="my-0 d-flex" v-if="order.doctor">
                    <span>{{order.doctor.doctor_name}}</span>
                    <a href="#" class="ml-auto text-danger" @click="order.doctor=null">
                      <span class="jam jam-trash"></span>
                    </a>
                  </div>
                  <div class="text-center p-4 text-muted" v-else>Врач не выбран</div>
                  <l-chooser
                    :button-shown="!order.doctor"
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
                <div class="form-group">
                  <label for="input-patient" class="control-label">Пациент</label>
                  <input
                    v-model="order.patient"
                    type="text"
                    name="patient"
                    id="input-patient"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label for="input-deadline" class="control-label">Срок выполнения</label>
                  <l-date-picker
                    v-model="order.deadline"
                    :default-value="order.deadline"
                    ref="deadlinePicker"
                  />
                </div>
                <div class="form-group">
                  <label for="input-datetime" class="control-label">Сумма наряда</label>
                  <h3>{{getTotalPrice()}}&nbsp;&#x20bd;</h3>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-8">
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h5>Работы</h5>
                  </div>
                  <div class="card-body">
                    <l-table
                      class="my-0"
                      v-if="order.works.length"
                      :columns="['ID', 'Наименование', 'Цена', 'Количество', 'Стоимость', 'Действия']"
                    >
                      <tr v-for="(work, index) in order.works" v-bind:key="index">
                        <td>{{work.id}}</td>
                        <td>{{work.work_name}}</td>
                        <td>
                          <input
                            type="number"
                            class="form-control"
                            min="1"
                            :value="work.price"
                            @input="$set(order.works, index, update(work, {'price': parseIntNaN($event.target.value)}))"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            class="form-control"
                            min="1"
                            v-model="work.amount"
                            @input="$set(order.works, index, update(work, {'amount': parseIntNaN($event.target.value)}))"
                          />
                        </td>
                        <td>{{work.price*work.amount}}</td>
                        <td>
                          <a
                            href="#"
                            class="ml-auto text-danger"
                            @click="event => {event.preventDefault(); deleteWork(index); return false}"
                          >
                            <span class="jam jam-trash"></span>
                          </a>
                        </td>
                      </tr>
                    </l-table>
                    <div class="text-center p-4 text-muted" v-else>Нет работ</div>
                    <l-chooser
                      :multiple="true"
                      :all-items-loader="loadWorks"
                      title="Добавить работу"
                      search-input-placeholder="Название работы"
                      :search-filter="(item, query) => item.work_name.indexOf(query) + 1"
                      @choose="works => addWorks(works)"
                    >
                      <template v-slot:addItemRow="{ item }">
                        <p class="my-0">{{item.work_name}}</p>
                      </template>
                    </l-chooser>
                  </div>
                </div>
                <div class="card">
                  <div class="card-header">
                    <h5>Операции</h5>
                  </div>
                  <div class="card-body">
                    <l-table
                      class="my-0"
                      v-if="order.operations.length"
                      :columns="['ID', 'Наименование', 'Техник','Цена', 'Количество', 'Стоимость', 'Выполнена', 'Действия']"
                    >
                      <tr v-for="(operation, index) in order.operations" v-bind:key="index">
                        <td>{{operation.id}}</td>
                        <td>{{operation.operation_name}}</td>
                        <td>
                          <div class="my-0 d-flex align-items-center" v-if="operation.technician">
                            <span>{{operation.technician.technician_name}}</span>
                            <a
                              href="#"
                              class="ml-auto text-danger"
                              @click="event => {event.preventDefault(); operation.technician=null; return false}"
                            >
                              <span class="jam jam-trash"></span>
                            </a>
                          </div>
                          <l-chooser
                            :button-shown="!operation.technician"
                            :all-items-loader="loadTechnicians"
                            title="Выбрать техника"
                            search-input-placeholder="ФИО техника"
                            :search-filter="(item, query) => item.technician_name.indexOf(query) + 1"
                            @choose="technician => technicianChosen(operation, technician)"
                          >
                            <template v-slot:addItemRow="{ item }">
                              <p class="my-0">{{item.technician_name}}</p>
                            </template>
                          </l-chooser>
                        </td>
                        <td>
                          <input
                            type="number"
                            class="form-control"
                            min="1"
                            :value="operation.price"
                            @input="$set(order.operations, index, update(operation, {'price': parseIntNaN($event.target.value)}))"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            class="form-control"
                            min="1"
                            :value="!orderId && operation.$parentWork && !operation.$userTouched ? operation.$parentWork.amount : operation.amount"
                            @input="$set(order.operations, index, update(operation, {'$userTouched': true, 'amount': parseIntNaN($event.target.value)}))"
                          />
                        </td>
                        <!-- TODO: a method to do that -->
                        <td>{{operation.price*(!orderId && operation.$parentWork && !operation.$userTouched ? operation.$parentWork.amount : operation.amount)}}</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="operation.is_done"
                            @change="operation.is_done = $event.target.checked"
                          />
                        </td>
                        <td>
                          <a
                            href="#"
                            class="ml-auto text-danger"
                            @click="event => {event.preventDefault(); deleteOperation(index); return false}"
                          >
                            <span class="jam jam-trash"></span>
                          </a>
                        </td>
                      </tr>
                    </l-table>
                    <div class="text-center p-4 text-muted" v-else>Нет операций</div>
                    <l-chooser
                      :multiple="true"
                      :all-items-loader="loadOperations"
                      title="Добавить операцию"
                      search-input-placeholder="Название операции"
                      :search-filter="(item, query) => item.operation_name.indexOf(query) + 1"
                      @choose="operations => addOperations(operations)"
                    >
                      <template v-slot:addItemRow="{ item }">
                        <p class="my-0">{{item.operation_name}}</p>
                      </template>
                    </l-chooser>
                  </div>
                </div>
                <div class="card">
                  <div class="card-header">
                    <h5>Файлы</h5>
                  </div>
                  <div class="card-body">
                    <fk-dropzone v-model="order.files" :multiple="true" :maxFiles="15" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <l-footer />
    </div>
  </div>
</template>

<script>
import LHeader from "./blocks/LHeader";
import LNav from "./blocks/LNav";
import LFooter from "./blocks/LFooter";
import Clinics from "../api/clinics";
import Doctors from "../api/doctors";
import Works from "../api/works";
import FkDropzone from "./blocks/FkDropzone";
import Technicians from "../api/technicians";
import Operations from "../api/operations";
import Orders from "../api/orders";
import LDatePicker from "./blocks/LDatePicker";
import LChooser from "./blocks/LChooser";
import LTable from "./blocks/LTable";
export default {
  name: "AddOrderPage",
  components: {
    LHeader,
    LNav,
    LFooter,
    FkDropzone,
    LDatePicker,
    LChooser,
    LTable
  },
  data() {
    return {
      order: {
        date: new Date(),
        clinic: null,
        doctor: null,
        patient: null,
        deadline: new Date(),
        works: [],
        files: [],
        operations: [],
        is_paid: 0
      },
      buttons: [
        {
          text: "Сохранить",
          click: () => {
            let order = Object.assign({}, this.order, {
              doctor: this.order.doctor ? this.order.doctor.id : 0,
              clinic: this.order.clinic ? this.order.clinic.id : 0
            });
            delete order.works;
            delete order.operations;
            // Until Artem fixes .progress bug
            delete order.progress;
            // End Until
            if (!order.clinic) {
              delete order.clinic;
            }
            if (!order.doctor) {
              delete order.doctor;
            }
            if (!order.deadline || !order.deadline.length) {
              delete order.deadline;
            }
            if (!order.date || !order.date.length) {
              delete order.date;
            }
            if (!order.patient || !order.patient.length) {
              delete order.patient;
            }
            let afterCreation = response => {
              let works = [],
                onOperationsProcessed = () => {
                  this.$router.push("/orders/");
                },
                onWorksProcessed = () => {
                  let operations = [];
                  this.order.operations.forEach(op => {
                    if (!op.$orderOpId) {
                      operations.push(op);
                    } else {
                      Operations.InOrders.updateById(op.$orderOpId, {
                        price: op.price,
                        amount:
                          !this.orderId && op.$parentWork && !op.$userTouched
                            ? op.$parentWork.amount
                            : op.amount,
                        deadline: op.deadline,
                        is_done: op.is_done,
                        technician: op.technician.id,
                        date: op.date
                      });
                    }
                  });
                  if (operations.length) {
                    Operations.InOrders.create(
                      operations.map(item => ({
                        date: item.date,
                        order: response.data.id,
                        price: item.price,
                        amount:
                          !this.orderId &&
                          item.$parentWork &&
                          !item.$userTouched
                            ? item.$parentWork.amount
                            : item.amount,
                        deadline: item.deadline,
                        is_done: item.is_done,
                        technician: item.technician.id,
                        operation: item.id
                      }))
                    ).then(onOperationsProcessed);
                  } else {
                    onOperationsProcessed();
                  }
                };
              this.order.works.forEach(work => {
                if (!work.$orderWorkId) {
                  works.push(work);
                } else {
                  Works.InOrders.updateById(work.$orderWorkId, {
                    price: work.price,
                    amount: work.amount
                  });
                }
              });
              if (works.length) {
                Works.InOrders.create(
                  works.map(item => ({
                    work: item.id,
                    order: response.data.id,
                    price: item.price,
                    amount: item.amount
                  }))
                ).then(onWorksProcessed);
              } else {
                onWorksProcessed();
              }
            };
            if (this.orderId) {
              Orders.updateById(this.orderId, order).then(afterCreation);
            } else {
              Orders.create(order).then(afterCreation);
            }
          }
        }
      ],
      allWorks: []
    };
  },
  computed: {
    worksPricelist() {
      if (this.order.clinic) {
        return this.order.clinic.price_list;
      } else if (this.order.doctor) {
        return this.order.doctor.price_list;
      }
      return null;
    },
    orderId() {
      let id = parseInt(this.$route.params.id);
      if (isNaN(id)) {
        return 0;
      }
      return id;
    },
    title() {
      return this.orderId
        ? `Редактировать наряд №${this.orderId}`
        : "Добавить наряд";
    }
  },
  methods: {
    loadClinics() {
      return Clinics.get().then(response => new Promise(r => r(response.data)));
    },
    loadDoctors() {
      return Doctors.get().then(response => new Promise(r => r(response.data)));
    },
    loadWorks() {
      return Works.get().then(response => new Promise(r => r(response.data)));
    },
    loadOperations() {
      return Operations.get().then(
        response => new Promise(r => r(response.data))
      );
    },
    loadTechnicians() {
      return Technicians.get().then(
        response => new Promise(r => r(response.data))
      );
    },
    reloadPrices() {
      this.order.works.forEach(work => {
        work.price = this.getWorkPrice(work);
      });
    },
    clinicChosen(clinic) {
      this.order.clinic = clinic;
      this.reloadPrices();
    },
    doctorChosen(doctor) {
      this.order.doctor = doctor;
      this.reloadPrices();
    },
    technicianChosen(operation, technician) {
      this.$set(operation, "technician", technician);
      this.$set(
        operation,
        "price",
        this.getOperationPrice(technician.price_list, operation)
      );
    },
    addWorks(works) {
      works.forEach(work => {
        this.order.works.push(
          Object.assign(work, {
            price: this.getWorkPrice(work),
            amount: 1
          })
        );
        this.addOperations(work.operations, work);
      });
    },
    addOperations(operations, parentWork) {
      operations.forEach(op => {
        this.order.operations.push(
          Object.assign(op, {
            $userTouched: false,
            $parentWork: parentWork,
            price: 0,
            amount: parentWork ? parentWork.amount : 1,
            is_done: false
          })
        );
      });
    },
    getOperationPrice(pricelist, operation) {
      if (!pricelist) {
        return 0;
      }
      let priceEntries = pricelist.operations.filter(
        item => item.operation.id == operation.id
      );
      if (priceEntries.length) {
        return priceEntries[0].price;
      }
      return 0;
    },
    getWorkPrice(work) {
      if (!this.worksPricelist) {
        return 0;
      }
      let workEntries = this.worksPricelist.works.filter(
        item => item.work.id == work.id
      );
      if (workEntries.length) {
        return workEntries[0].price;
      }
      return 0;
    },
    getTotalPrice() {
      return this.order.works.reduce(
        (sum, work) => (sum += work.price * work.amount),
        0
      );
    },
    parseIntNaN(value) {
      let ivalue = parseInt(value);
      if (isNaN(ivalue)) {
        return 0;
      }
      return ivalue;
    },
    update(obj, updates) {
      return Object.assign(obj, updates);
    },
    deleteWork(index) {
      let work = this.order.works[index],
        onDelete = () => this.$delete(this.order.works, index);
      if (work.$orderWorkId) {
        Works.InOrders.deleteById(work.$orderWorkId).then(onDelete);
      } else {
        onDelete();
      }
    },
    deleteOperation(index) {
      let op = this.order.operations[index],
        onDelete = () => this.$delete(this.order.operations, index);
      if (op.$orderOpId) {
        Operations.InOrders.deleteById(op.$orderOpId).then(onDelete);
      } else {
        onDelete();
      }
    }
  },
  created() {
    if (this.orderId) {
      Orders.getById(this.orderId).then(response => {
        for (let prop in response.data) {
          if (["works", "operations", "files"].indexOf(prop) === -1) {
            this.$set(this.order, prop, response.data[prop]);
          }
        }
        if (response.data.date !== null) {
          this.$set(
            this.order,
            "date",
            new Date(
              response.data.date
                .split(".")
                .reverse()
                .join("-")
            )
          );
        }
        if (response.data.deadline !== null) {
          this.$set(
            this.order,
            "deadline",
            new Date(
              response.data.deadline
                .split(".")
                .reverse()
                .join("-")
            )
          );
        }
        this.$refs.datePicker.$emit("value", this.order.date);
        this.$refs.deadlinePicker.$emit("value", this.order.deadline);
        this.$set(
          this.order,
          "works",
          response.data.works.map(work =>
            Object.assign(work.work, {
              price: work.price,
              amount: work.amount,
              $orderWorkId: work.id
            })
          )
        );
        this.$set(
          this.order,
          "operations",
          response.data.operations.map(operation =>
            Object.assign(operation.operation, {
              price: operation.price,
              amount: operation.amount,
              $orderOpId: operation.id,
              technician: operation.technician,
              is_done: operation.is_done
            })
          )
        );
        this.$set(
          this.order,
          "files",
          response.data.files.map(file =>
            Object.assign(file, { name: file.file.split("/").reverse()[0] })
          )
        );
      });
    }
  }
};
</script>

<style>
</style>

