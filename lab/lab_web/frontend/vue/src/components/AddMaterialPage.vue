<template>
  <div class="wrapper">
    <l-nav current-menu-item="books"></l-nav>
    <div class="main-panel" id="main-panel">
      <l-header :title="title" :buttons="buttons" />
      <div class="content">
        <div class="row">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card">
              <div class="card-body">
                <input
                  type="text"
                  class="form-control mb-4"
                  placeholder="Название"
                  v-model="material.material_name"
                />
                <label for="material-unit-select">Единица измерения</label>
                <select class="form-control mb-4" id="material-unit-selec" v-model="material.unit">
                  <option value="gr">Грамм</option>
                  <option value="sht">Штука</option>
                </select>
                <input
                  type="number"
                  class="form-control mb-4"
                  placeholder="Минимальное количество"
                  v-model="material.limit"
                />
                <textarea class="form-control" placeholder="Комментарий" v-model="material.comment"></textarea>
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
import Materials from "../api/materials";
export default {
  name: "AddMaterialPage",
  components: {
    LNav,
    LHeader
  },
  data() {
    return {
      buttons: [
        {
          text: "Сохранить",
          click: () => {
            if (this.materialId) {
              return Materials.updateById(this.materialId, this.material).then(
                () => this.$router.push("/books/materials/")
              );
            }
            Materials.create(this.material).then(() =>
              this.$router.push("/books/materials/")
            );
          }
        }
      ],
      material: {
        material_name: null,
        unit: null,
        limit: null,
        comment: ""
      }
    };
  },
  computed: {
    materialId() {
      let id = parseInt(this.$route.params.id);
      if (isNaN(id)) {
        return 0;
      }
      return id;
    },
    title() {
      return this.materialId ? "Редактировать материал" : "Добавить материал";
    }
  },
  created() {
    if (this.materialId) {
      Materials.getById(this.materialId).then(response => {
        for (let prop in response.data) {
          this.$set(this.material, prop, response.data[prop]);
        }
      });
    }
  }
};
</script>

<style>
</style>