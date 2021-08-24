<!-- Please remove this file from your project -->
<template>
  <div class="flex  flex-wrap container mx-auto shadow p-5">
    <div class="w-5/12">
      <div class="kudo-card">
        <div class="kudo-head p-4 w-full text-center" :style="style.kudoHead">
          <span contenteditable="true">
            Editable
          </span>
        </div>
        <div class="kudo-body flex">
          <div class="w-4/12">
            <img class="mt-12 h-40 w-40 object-contain " :src="customization.image" alt="">
          </div>
          <textarea class="w-8/12 resize-none leading-10 pt-3 px-5" name="" id="" cols="30" rows="6">
          </textarea>
        </div>
      </div>
    </div>
    <div class="w-7/12 ml-auto px-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="background">
        Header's Background: 
        <input class="shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="background" :value="style.kudoHead.backgroundColor" @input="(e)=>{ style.kudoHead.backgroundColor=e.target.value }" type="color" placeholder="Username">
      </label>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="foreground">
        Header's Text Color: 
        <input class="shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="foreground" :value="style.kudoHead.color" @input="(e)=>{ style.kudoHead.color=e.target.value }" type="color" placeholder="Username">
      </label>
      <span class="text-gray-700 text-sm font-bold">Image:</span>
      <div class="w-full flex">
        <label class="w-20 h-20 cursor-pointer" v-for="image of images" :key="image">
          <input class="hidden" type="radio" name="kudo-image" id="kudo-image">
          <img class="h-full w-full object-contain" :src="image" @click="(e) => { customization.image = e.target.src }" alt="">
        </label>
      </div>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5" @click="saveKudo()">
        Salvar
      </button>
    </div>
  </div>
</template>
<script>
import html2canvas from "html2canvas"
export default {
  data(){ 
    return {
      style: {
        kudoHead: {
          backgroundColor: '#000000',
          color: '#ffffff'
        },
        kudoBody: {
          background: '#f9f9f9',
          color: '#202020'
        } 
      },
      customization: {
        image: 'https://i.pinimg.com/originals/21/d8/c8/21d8c866ec919e430a7b208b831086f2.png'
      },
    }
  },
  computed: {
    images: function() {
      console.log(this.$store)
      return this.$store.getters['images/getImages']
    }
  },
  methods: {
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
