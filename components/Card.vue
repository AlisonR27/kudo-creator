<template>
 <div class="container mx-auto shadow p-5 mt-5 h-full">
    <div class="w-10/12 mx-auto px-6 justify-center">
      <a href=""><img class="inline" src="https://d29fhpw069ctt2.cloudfront.net/icon/image/39092/preview.png" height="20px" width="20px" alt="">Return</a>
      <SelectModelVue v-if="!isHidden(0)"/>
      <CustomizeVue v-if="!isHidden(1)"/>
      <a v-if="!isHidden(0)" href="#" class="btn-1" @click="nextPage">
        Próximo
      </a>
    </div>
  </div>
</template>
<script>
import html2canvas from "html2canvas"
import SelectModelVue from './SelectModel.vue'
import CustomizeVue from './Customize.vue'
export default {
  data(){ 
    return {
      currentSlide: 0,
    }
  },
  components: {
    CustomizeVue,
    SelectModelVue,
  },
  computed: {
    images: function() {
      console.log(this.$store)
      return this.$store.getters['images/getImages']
    }
  },
  methods: {
    isHidden(index) {
      if (index != this.currentSlide) return true
      return false
    },
    nextPage: function() {
      this.currentSlide++;
      this.$store.commit('models/changeCurrent',this.currentSlide)
    },
    saveKudo: () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      html2canvas(document.querySelector(".kudo-card")).then(canvas => {
        document.body.appendChild(canvas)
      });
    }
  }
}
</script>

<style lang="scss">
@use 'sass:math';

$btn-width: 250px !default;
$btn-height: 80px !default;

[class^="btn-"] {
  position: relative;
  display: flex;
  overflow: hidden;
  height: $btn-height;
  max-width: $btn-width;
  margin: 1rem auto;
  text-transform: uppercase;
  border: 1px solid currentColor;
  justify-content: center;
  align-items: center;
}
.btn-1 {
  color:#b7b862;
  transition:0.5s ease-in-out;
}
.btn-1:hover {
  color: #f7f7e9;
}
.btn-1:hover:before {
    transform: translateX(0);
}
.btn-1:before {
  transition:0.5s ease-in-out;
  content: "";
  position: absolute;
  top: 0;
  right: -50px;
  bottom: 0;
  left: 0;
  border-right: 50px solid transparent;
  border-bottom: 80px solid #66672a;
  transform: translateX(-100%);
  mix-blend-mode: color-dodge;
}

</style>