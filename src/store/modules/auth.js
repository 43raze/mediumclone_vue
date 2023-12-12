import authApi from '@/api/auth'
import {setItem} from '@/helpers/persistanceStorage'

const state = {
  isSubmitting: false,
  isLoggedIn: null,
  currentUser: null,
  validationErrors: null
}

// [auth] => prefix
export const MUTATION_TYPES = {
  //register
  registerStart: '[auth] registerStart',
  registerSuccess: '[auth] registerSuccess',
  registerFailure: '[auth] registerFailure',

  //login
  loginStart: '[auth] loginStart',
  loginSuccess: '[auth] loginSuccess',
  loginFailure: '[auth] loginFailure'
}

export const ACTION_TYPES = {
  //register
  register: '[auth] register',

  //login
  login: '[auth] login'
}

const mutations = {
  [MUTATION_TYPES.registerStart](state) {
    state.isSubmitting = true
    state.validationErrors = null
  },

  [MUTATION_TYPES.registerSuccess](state, payload) {
    state.isSubmitting = false
    state.isLoggedIn = true
    state.currentUser = payload
  },

  [MUTATION_TYPES.registerFailure](state, payload) {
    state.isSubmitting = false
    state.validationErrors = payload
  },

  //login
  [MUTATION_TYPES.loginStart](state) {
    state.isSubmitting = true
    state.validationErrors = null
  },
  [MUTATION_TYPES.loginSuccess](state, payload) {
    state.isSubmitting = false
    state.isLoggedIn = true
    state.currentUser = payload
  },
  [MUTATION_TYPES.loginFailure](state, payload) {
    state.isSubmitting = false
    state.validationErrors = payload
  }
}

const actions = {
  [ACTION_TYPES.register](context, credentials) {
    return new Promise(resolve => {
      context.commit(MUTATION_TYPES.registerStart)

      authApi
        .register(credentials)
        .then(response => {
          context.commit(MUTATION_TYPES.registerSuccess, response.data.user)
          setItem('accessToken', response.data.user.token)
          resolve(response.data.user)
        })
        .catch(result => {
          context.commit(
            MUTATION_TYPES.registerFailure,
            result.response.data.errors
          )
        })
    })
  },
  [ACTION_TYPES.login](context, credentials) {
    return new Promise(resolve => {
      context.commit(MUTATION_TYPES.loginStart)

      authApi
        .login(credentials)
        .then(response => {
          context.commit(MUTATION_TYPES.loginSuccess, response.data.user)
          setItem('accessToken', response.data.user.token)
          resolve(response.data.user)
        })
        .catch(result => {
          context.commit(
            MUTATION_TYPES.loginFailure,
            result.response.data.errors
          )
        })
    })
  }
}

export default {
  state,
  actions,
  mutations
  // getters
}
