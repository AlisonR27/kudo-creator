<template>
   <div class="container mx-auto shadow p-5 mt-5 h-full">
    <div class="w-10/12 mx-auto px-6 justify-center">
      <span class="text-gray-700 text-lg font-bold text-center mb-4 block">Sua imagem está pronta!</span>
      <img class="mx-auto" :src="outputImage" alt="" srcset="">
    </div>
  </div>
</template>
<script>
export default {
  data(){ 
    return {
      outputImage: window.localStorage.getItem('kudoOutput')
    }
  },
  mounted() {
    this.outputImage = window.localStorage.getItem('kudoOutput')
  },
  computed: {
  },
}
</script>
