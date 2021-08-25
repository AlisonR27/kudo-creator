<!-- Please remove this file from your project -->
<template>
  <div>
    <span class="text-gray-700 text-lg font-bold text-center mb-4 block">Selecione o modelo</span>
      <div class="w-full flex flex-wrap pt-3">
        <label class="w-80 mx-4 flex-shrink-0 cursor-pointer float-left" v-for="image of images" @click="(e) => updateSelected(e)" :key="image.id">
          <input class="hidden" type="radio" :value="image.id" name="kudo-image" id="kudo-image">
          <img class="w-full object-contain" :src="image.src" alt="">
        </label>
      </div>
  </div>
</template>
<script>
export default {
  data(){ 
    return {
    }
  },
  mounted() {
  },
  computed: {
    images: function() {
      return this.$store.getters['models/getImages']
    }
  },
  methods: {
    updateSelected: function (e) {
      this.$store.commit('models/changeCurrent',e.target.value)
    }
  }
}
</script>
