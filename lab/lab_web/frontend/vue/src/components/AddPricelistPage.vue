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
                  v-model="pricelist.price_list_name"
                />
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5>{{itemsTitle}}</h5>
              </div>
              <div class="card-body">
                <div v-if="items.length">
                  <div
                    v-for="(item, index) in items"
                    v-bind:key="index"
                    class="d-flex align-items-center"
                  >
                    <div>
                      <p class="my-0" v-if="pricelistType === 'works'">{{item.work_name}}</p>
                      <p
                        class="my-0"
                        v-else-if="pricelistType === 'operations'"
                      >{{item.operation_name}}</p>
                    </div>
                    <div class="ml-auto mr-4">
                      <div class="input-group">
                        <input
                          class="form-control"
                          type="number"
                          :min="1"
                          v-model="item.price"
                          @input="$set(item, 'price', parseInt($event.target.value))"
                        />
                        <div class="input-group-append">
                          <span class="input-group-text">&#x20bd;</span>
                        </div>
                      </div>
                    </div>
                    <div class="ml-auto">
                      <a href="#" class="ml-auto text-danger" @click="deleteItem(index)">
                        <span class="jam jam-trash"></span>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="text-center p-4 text-muted" v-else>Нет операций</div>
                <l-chooser
                  :multiple="true"
                  :all-items-loader="pricelistType === 'works' ? loadWorks : loadOperations"
                  :title="chooserTitle"
                  :search-input-placeholder="chooserSearchInputPlaceholder"
                  :search-filter="suggestedItemsFilter"
                  ref="itemsList"
                  @choose="$items => $items.forEach(item => items.push(item))"
                >
                  <template v-slot:addItemRow="{ item }">
                    <p class="my-0" v-if="pricelistType === 'operations'">{{item.operation_name}}</p>
                    <p class="my-0" v-else-if="pricelistType === 'works'">{{item.work_name}}</p>
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
import Works from "../api/works";
import Operations from "../api/operations";
import Pricelists from "../api/pricelists";
export default {
  name: "AddWorkPage",
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
            let redirectOnSuccess = () =>
                this.$router.push(`/books/pricelists/${this.pricelistType}/`),
              afterCreation;
            if (this.pricelistType === "works") {
              afterCreation = response => {
                let id = this.pricelistId ? this.pricelistId : response.data.id,
                  items = [];
                this.items.forEach(item => {
                  if (!item.$itemInPlId) {
                    items.push(item);
                  } else {
                    Works.Prices.updateById(item.$itemInPlId, {
                      price: item.price
                    });
                  }
                });
                Works.Prices.create(
                  items.map(item => ({
                    work: item.id,
                    price: item.price,
                    price_list: id
                  }))
                ).then(redirectOnSuccess);
              };
              if (this.pricelistId) {
                Pricelists.Works.updateById(
                  this.pricelistId,
                  this.pricelist
                ).then(afterCreation);
              } else {
                Pricelists.Works.create(this.pricelist).then(afterCreation);
              }
            } else {
              afterCreation = response => {
                let id = this.pricelistId ? this.pricelistId : response.data.id,
                  items = [];
                this.items.forEach(item => {
                  if (!item.$itemInPlId) {
                    items.push(item);
                  } else {
                    Operations.Prices.updateById(item.$itemInPlId, {
                      price: item.price
                    });
                  }
                });
                Operations.Prices.create(
                  items.map(item => ({
                    operation: item.id,
                    price: item.price,
                    price_list: id
                  }))
                ).then(redirectOnSuccess);
              };
              if (this.pricelistId) {
                Pricelists.Operations.updateById(
                  this.pricelistId,
                  this.pricelist
                ).then(afterCreation);
              } else {
                Pricelists.Operations.create(this.pricelist).then(
                  afterCreation
                );
              }
            }
          }
        }
      ],
      pricelist: {
        price_list_name: null
      },
      items: []
    };
  },
  computed: {
    title() {
      return this.pricelistId
        ? "Редактировать прайс-лист"
        : "Добавить прайс-лист";
    },
    pricelistType() {
      return this.$route.params.type;
    },
    pricelistId() {
      let id = parseInt(this.$route.params.id);
      if (isNaN(id)) {
        return 0;
      }
      return id;
    },
    noItemsText() {
      if (this.pricelistType === "works") {
        return "Нет работ";
      }
      return "Нет операций";
    },
    chooserTitle() {
      if (this.pricelistType === "works") {
        return "Добавить работу";
      }
      return "Добавить операцию";
    },
    chooserSearchInputPlaceholder() {
      if (this.pricelistType === "works") {
        return "Название работы";
      }
      return "Название операции";
    },
    itemsTitle() {
      if (this.pricelistType === "works") {
        return "Работы";
      }
      return "Операции";
    }
  },
  methods: {
    suggestedItemsFilter(item, query) {
      if (this.pricelistType === "works") {
        return item.work_name.indexOf(query) + 1;
      }
      return item.operation_name.indexOf(query) + 1;
    },
    loadWorks() {
      return Works.get().then(response => {
        return new Promise(r =>
          r(response.data.map(item => Object.assign(item, { price: 1 })))
        );
      });
    },
    loadOperations() {
      return Operations.get().then(response => {
        return new Promise(r =>
          r(response.data.map(item => Object.assign(item, { price: 1 })))
        );
      });
    },
    deleteItem(index) {
      let item = this.items[index];
      if (item.$itemInPlId) {
        [
          this.pricelistType === "works" ? "Works" : "Operations"
        ].Prices.deleteById(item.$itemInPlId).then(() =>
          this.$delete(this.items, index)
        );
      } else {
        this.$delete(this.items, index);
      }
      return false;
    }
  },
  created() {
    if (this.pricelistId) {
      Pricelists[this.pricelistType === "works" ? "Works" : "Operations"]
        .getById(this.pricelistId)
        .then(response => {
          this.$set(
            this.pricelist,
            "price_list_name",
            response.data.price_list_name
          );
          let items;
          if (this.pricelistType === "works") {
            items = response.data["works"].map(workInPl =>
              Object.assign(workInPl.work, {
                price: workInPl.price,
                $itemInPlId: workInPl.id
              })
            );
          } else {
            items = response.data["operations"].map(opInPl =>
              Object.assign(opInPl.operation, {
                price: opInPl.price,
                $itemInPlId: opInPl.id
              })
            );
          }
          this.$set(this, "items", items);
        });
    }
  }
};
</script>

<style>
</style>