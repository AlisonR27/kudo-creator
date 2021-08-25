
export const state = () => ({
  models : [
    {
      id: 0,
      src:'/kudo_models/1.jpg'
    }, {
      id: 1,
      src:'/kudo_models/2.jpg'
    }, {
      id: 2,
      src:'/kudo_models/3.jpg'
    }, {
      id: 3,
      src:'/kudo_models/4.jpg'
    }, {
      id: 4,
      src:'/kudo_models/5.jpg'
    },
  ],
  currentModel: 0
})

export const mutations = {
  insertImage: () => {

  },
  loadImages: (state) => {
  },
  changeCurrent: (state,payload) => {
    state.currentModel = payload;
  }
}

export const getters = {
  getImages: (state) => {
    return state.models;
  },
  currentModel: (state) => {
    return state.models[state.currentModel]
  }
}