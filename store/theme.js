export const state = () => ({
  isDark: false,
})

export const mutations = {
  toggleDark : (state,payload) => {
    state.isDark = !state.isDark;
  }
}

export const getters = {
  isDark: (state) => {
    return state.isDark;
  }
}