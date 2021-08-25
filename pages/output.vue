<template>
   <div class="container mx-auto shadow p-5 mt-5 h-full">
    <div class="w-10/12 mx-auto px-6 justify-center">
      <span class="text-gray-700 text-lg font-bold text-center mb-4 block">Sua imagem está pronta!</span>
      <img class="mx-auto" :src="outputImage" alt="" srcset="">
    </div>
    <a class="btn-1 cursor-pointer" @click="saveImage">
      Salvar Imagem
    </a> 
    <NuxtLink class="block mx-auto text-center hover:underline" to="/">Voltar a página inicial</NuxtLink>
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
  methods: {
    saveImage: function() {
      var image = this.outputImage.replace("image/png", "image/octet-stream");  
      window.open(image, '_blank').focus();
    }
  }
}
</script>
