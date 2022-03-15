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
                  v-model="operation.operation_name"
                />
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card">
              <div class="card-header">
                <h5>Материалы</h5>
              </div>
              <div class="card-body">
                <div v-if="operation.materials.length">
                  <div
                    v-for="(material, index) in operation.materials"
                    v-bind:key="index"
                    class="d-flex align-items-center"
                  >
                    <div>
                      <p class="my-0">{{material.material_name}}</p>
                    </div>
                    <div class="ml-auto mr-4">
                      <div class="input-group">
                        <input
                          class="form-control"
                          type="number"
                          v-model="material.amount"
                          :min="0"
                          :max="material.limit"
                          @input="$set(material, 'amount', parseInt($event.target.value))"
                        />
                        <div class="input-group-append">
                          <span class="input-group-text">{{material.unit}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="ml-auto">
                      <a href="#" class="ml-auto text-danger" @click="deleteMaterialFromOp(index)">
                        <span class="jam jam-trash"></span>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="text-center p-4 text-muted" v-else>Нет материалов</div>
                <l-chooser
                  :multiple="true"
                  :all-items-loader="loadMaterials"
                  title="Добавить материалы"
                  search-input-placeholder="Название материала"
                  :search-filter="suggestedItemsFilter"
                  :filter="materialFilter"
                  ref="itemsList"
                  @choose="materials => materials.forEach(m => operation.materials.push(Object.assign(m, {amount: 0})))"
                >
                  <template v-slot:addItemRow="{ item }">
                    <p class="my-0">{{item.material_name}}</p>
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
import Operations from "../api/operations";
import Materials from "../api/materials";
export default {
  name: "AddOperationPage",
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
            let materials = this.operation.materials,
              afterCreation = response => {
                let operationId = this.operationId
                    ? this.operationId
                    : response.data.id,
                  materialsToCreate = [];
                materials.forEach(m => {
                  if (!m.$materialInOpId) {
                    materialsToCreate.push(m);
                  } else {
                    Materials.UsedOnOperation.updateById(m.$materialInOpId, {
                      amount: m.amount
                    });
                  }
                });
                Materials.UsedOnOperation.create(
                  materialsToCreate.map(material =>
                    Object.assign(material, {
                      material: material.id,
                      amount: material.amount,
                      operation: operationId
                    })
                  )
                ).then(() => this.$router.push("/books/operations/"));
                // END Rewrite
              };
            if (this.operationId) {
              Operations.updateById(this.operationId, this.operation).then(
                afterCreation
              );
            } else {
              Operations.create(this.operation).then(afterCreation);
            }
          }
        }
      ],
      operation: {
        operation_name: null,
        materials: []
      }
    };
  },
  computed: {
    operationId() {
      let id = parseInt(this.$route.params.id);
      if (isNaN(id)) {
        return 0;
      }
      return id;
    },
    title() {
      return this.operationId ? "Редактировать операцию" : "Добавить операцию";
    }
  },
  created() {
    if (this.operationId) {
      Operations.getById(this.operationId).then(response => {
        this.$set(
          this.operation,
          "operation_name",
          response.data.operation_name
        );
        response.data.materials.forEach(materialInOp =>
          this.operation.materials.push(
            Object.assign(materialInOp.material, {
              amount: materialInOp.amount,
              $materialInOpId: materialInOp.id
            })
          )
        );
      });
    }
  },
  methods: {
    suggestedItemsFilter(item, query) {
      return item.material_name.indexOf(query) + 1;
    },
    loadMaterials() {
      return Materials.get().then(response => {
        let items = response.data.map(x => Object.assign(x, { amount: 0 }));
        return new Promise(r => r(items));
      });
    },
    deleteMaterialFromOp(index) {
      let material = this.operation.materials[index],
        deleteFromList = () => this.$delete(this.operation.materials, index);
      if ("$materialInOpId" in material) {
        Materials.UsedOnOperation.deleteById(material.$materialInOpId).then(
          deleteFromList
        );
      } else {
        deleteFromList();
      }
    },
    materialFilter(material) {
      let ret = true;
      this.operation.materials.forEach(m => {
        if (material.id === m.id) {
          ret = false;
        }
      });
      return ret;
    }
  }
};
</script>

<style>
</style>