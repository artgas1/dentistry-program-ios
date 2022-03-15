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
                  v-model="work.work_name"
                />
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5>Операции</h5>
              </div>
              <div class="card-body">
                <div v-if="work.operations.length">
                  <div
                    v-for="(operation, index) in work.operations"
                    v-bind:key="index"
                    class="d-flex align-items-center"
                  >
                    <div>
                      <p class="my-0">{{operation.operation_name}}</p>
                    </div>
                    <div class="ml-auto">
                      <a
                        href="#"
                        class="ml-auto text-danger"
                        @click="$delete(work.operations, index)"
                      >
                        <span class="jam jam-trash"></span>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="text-center p-4 text-muted" v-else>Нет операций</div>
                <l-chooser
                  :multiple="true"
                  :all-items-loader="loadOperations"
                  title="Добавить операции"
                  search-input-placeholder="Название операции"
                  :search-filter="suggestedItemsFilter"
                  :filter="operationsFilter"
                  ref="itemsList"
                  @choose="operations => operations.forEach(m => work.operations.push(m))"
                >
                  <template v-slot:addItemRow="{ item }">
                    <p class="my-0">{{item.operation_name}}</p>
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
            let work = Object.assign({}, this.work, {
              operations: this.work.operations.map(t => t.id)
            });
            if (this.workId) {
              Works.updateById(this.workId, work).then(() =>
                this.$router.push("/books/works/")
              );
              return;
            }
            Works.create(work).then(() => this.$router.push("/books/works/"));
          }
        }
      ],
      work: {
        work_name: null,
        operations: []
      }
    };
  },
  created() {
    if (this.workId) {
      Works.getById(this.workId).then(response => {
        for (let prop in response.data) {
          this.$set(this.work, prop, response.data[prop]);
        }
      });
    }
  },
  methods: {
    suggestedItemsFilter(item, query) {
      return item.operation_name.indexOf(query) + 1;
    },
    loadOperations() {
      return Operations.get().then(response => {
        return new Promise(r => r(response.data));
      });
    },
    operationsFilter(operation) {
      let ret = true;
      this.work.operations.forEach(op => {
        if (op.id === operation.id) {
          ret = false;
        }
      });
      return ret;
    }
  },
  computed: {
    workId() {
      let id = parseInt(this.$route.params.id);
      if (isNaN(id)) {
        return 0;
      }
      return id;
    },
    title() {
      return this.workId ? "Редактировать работу" : "Добавить работу";
    }
  }
};
</script>

<style>
</style>