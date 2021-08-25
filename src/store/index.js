import Vue from 'vue'
import Vuex from 'vuex'
import VueSession from 'vue-session'

Vue.use(Vuex)
Vue.use(VueSession)

function get(url) {
  return new Promise(resolve => {
    return fetch(url).then(res => res.json()).then(data => resolve(data))
  })
}

export default new Vuex.Store({
  state: {
    game: null,
    boxes: [],
    users: [
      {
        id: 1,
        name: ''
      },
      {
        id: 2,
        name: ''
      },
    ],
    logs: []
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setGame(state, game) {
      state.game = game;
    },
    setBoxes(state, boxes) {
      state.boxes = boxes;
    },
    setLogs(state, logs) {
      state.logs = logs;
    },
  },
  actions: {
    changeUser({commit, state}, arr) {
        console.log(arr[0], arr[1]);
        let users = state.users;
        users[arr[1]-1].name = arr[0];
        commit('setUsers', users);
    },
    async postUsersToDatabase({commit, state}) {

      const users = state.users;
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user1_name: users[0].name,
          user2_name: users[1].name
        })
      };
      const response = await fetch("http://127.0.0.1:8000/api/game", requestOptions);
      const data = await response.json();

      if (data.success) {
        //save to local storage
        localStorage.setItem('game', data.game.id);
        commit('setGame', data.game.id);
        return true;
      }else {
        return false;
      }
    },
    async getDataByGameId({commit}) {
      // gaunamas game id
      const gameID = localStorage.getItem('game');

      // jei game egzistuoja, gaunami visi duomenys
      if (gameID !== null) {
        const game = await get(`http://127.0.0.1:8000/api/game/${gameID}`);
        const users = await get(`http://127.0.0.1:8000/api/getUsersByGame/${gameID}`);
        const boxes = await get(`http://127.0.0.1:8000/api/getBoxesByGame/${gameID}`);
        const logs = await get(`http://127.0.0.1:8000/api/logsByGame/${gameID}`);

        // jei responsai === true
        if (game.success && users.success && boxes.success && logs.success) {

          // sucomitinami visi gauti duomenys
          commit('setGame', game.game.id);
          commit('setUsers', users.users);
          commit('setBoxes', boxes.boxes);
          commit('setLogs', logs.logs);

          return true;
        } else {
          return false;
        }
      }
    },
    async deleteData({commit}) {
      // trinami duomenys is db
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify("")
      };
      const response = await fetch(`http://127.0.0.1:8000/api/game/${localStorage.getItem('game')}`, requestOptions);
      const data = await response.json();

      // jei responsas === true
      if (data.success) {
        // trinamas localstoragas
        localStorage.removeItem('game');

        //nuresetinami visi duomenys
        commit('setGame', null);
        commit('setUsers', [{id: 1, name: ''}, {id: 2, name: ''}]);
        commit('setBoxes', null);
        commit('setLogs', []);

        return true;
      }else {
        return false;
      }
    },
    async reset({commit}) {
      const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify()
      };
      const response = await fetch(`http://127.0.0.1:8000/api/reset/${localStorage.getItem('game')}`, requestOptions);
      const data = await response.json();

      if (data.success) {
        commit('setBoxes', data.boxes);
        commit('setLogs', [])
        return true;
      }else {
        return false;
      }
    },
    async setWindow({commit, state}, arr) {
      //issiuncia duomenis
      const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: arr[1]
        })
      };
      const response = await fetch("http://127.0.0.1:8000/api/box/"+arr[0], requestOptions);
      const data = await response.json();



      if (data.success) {
        //commitina duomenis
        const boxes = state.boxes;

        for (let i = 0; i<boxes.length; i++) {
          if(boxes[i].id === arr[0]) {
            boxes[i].value = arr[1];
          }
        }
        commit('setBoxes', boxes);
        return true;
      }else {
        return false;
      }
    },
    async postLog({commit, state}, message) {

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: localStorage.getItem('game'),
          message: message
        })
      };
      const response = await fetch("http://127.0.0.1:8000/api/log", requestOptions);
      const data = await response.json();


      if (data.success) {

        let logs = state.logs;
        logs[logs.length] = data.log;
        commit('setLogs' ,logs);
        return true;
      }else {
        return false;
      }
    },
  },
  modules: {
  }
})
