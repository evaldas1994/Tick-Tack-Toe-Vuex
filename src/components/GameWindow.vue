<template>
  <div class="game-window">
    <h1>game window</h1>
    <div class="widow-1">
      <div>
        <p>{{ users[0].name }} ({{ users[0].sign }})</p>
        <p v-if="!gameOver.status && turnForUser !== null && turnForUser.id === users[1].id">Your turn</p>
      </div>
      <div class="box" v-if="boxes !== null">
        <div @click="setWindow(item.id)" class="window" v-for="item in boxes" :key="item.location">
          {{ item.value }}
        </div>
      </div>
      <div>
        <p>{{ users[1].name }} ({{ users[1].sign }})</p>
        <p v-if="!gameOver.status && turnForUser !== null && turnForUser.id === users[0].id">Your turn</p>
      </div>
    </div>

    <div class="logs">
      <div>
        a
      </div>


      <LogsBox v-if="logs.length > 0" :logs="logs"/>

      <div>
        <p @click="exit">exit the game</p>
        <p @click="reset">reset</p>
      </div>
    </div>

  </div>
</template>

<script>
import LogsBox from "./LogsBox";

export default {
  name: "GameWindow",
  components: {
    LogsBox
  },
  data: () => {
    return {
      turnForUser: null,
      gameOver: [
        {
          status: false,
          winner: null,
          message: '',
          display: false
        }
      ]
    }
  },
  methods: {
    exit() {
      // jei duomenys istrinti sekmingai, routinama i home page
      if (this.$store.dispatch('deleteData')) {
        this.$router.push('/');
      }
    },
    reset() {
      this.$store.dispatch('reset');
      this.gameOver = [
        {
          status: false,
          winner: null,
          message: ''
        }
      ];

      this.turnForUser = this.getTurnForUser();
      this.$store.dispatch('postLog', `Started new Game`);
    },
    setWindow(boxID) {
      //gaunami paspausto langelio duomenys
      let box = this.$store.state.boxes.find(x => x.id === boxID);

      //tikrina ar langelis nepaspaustas && ar zaidimas dar nebaigtas
      if (box.value === null && !this.gameOver.status) {
        //gaunamas zaidejas, kurio eile
        this.turnForUser = this.getTurnForUser();

        //Siunciamas paspaudimas i db ir jei responsas === true
        if (this.$store.dispatch('setWindow', [boxID, this.turnForUser.sign])) {
          // issiuncia log i db apie mygtuko paspaudima

          this.$store.dispatch('postLog', `User ${this.getTurnForUser().name} clicked on ${box.location}.`);
          if(this.$store.dispatch('getDataByGameId')) {
            console.log('');
          }
        }
      }
    },
    checkForWin(user) {
      if (user !== null) {
        const boxes = this.$store.state.boxes;
        const filteredBySign = boxes.filter(x => x.value === user.sign);
        if ((filteredBySign.some(x => x.location === 1) && filteredBySign.some(x => x.location === 2) && filteredBySign.some(x => x.location === 3)) ||
            (filteredBySign.some(x => x.location === 7) && filteredBySign.some(x => x.location === 8) && filteredBySign.some(x => x.location === 9)) ||
            (filteredBySign.some(x => x.location === 1) && filteredBySign.some(x => x.location === 4) && filteredBySign.some(x => x.location === 7)) ||
            (filteredBySign.some(x => x.location === 3) && filteredBySign.some(x => x.location === 6) && filteredBySign.some(x => x.location === 9)) ||
            (filteredBySign.some(x => x.location === 1) && filteredBySign.some(x => x.location === 5) && filteredBySign.some(x => x.location === 9)) ||
            (filteredBySign.some(x => x.location === 3) && filteredBySign.some(x => x.location === 5) && filteredBySign.some(x => x.location === 7))) {
          this.setGameOver(user);
        }

        if (!boxes.some(x => x.value === null)) {
          this.setGameOver();
        }
      }
    },
    getTurnForUser() {
      const users = this.$store.state.users;
      const boxes = this.$store.state.boxes;
      const filteredByUser1Sign = boxes.filter(x => x.value === users[0].sign);
      const filteredByUser2Sign = boxes.filter(x => x.value === users[1].sign);

      if (filteredByUser1Sign.length === filteredByUser2Sign.length) {
        return users.find(x => x.sign === 'X');
      } else {
        return users.find(x => x.sign === 'O');
      }
    },
    setGameOver(user = null) {
      if (user === null) {
        this.$store.dispatch('postLog', 'You are bouth winners!!');
        this.gameOver.status = true;
        this.gameOver.winner = null;
        this.gameOver.display = false;
        this.gameOver.message = `You are bouth winners!!`;
      } else {
        this.$store.dispatch('postLog', `Winner is: ${user.name}!!`);
        this.gameOver.status = true;
        this.gameOver.winner = user;
        this.gameOver.display = false;
        this.gameOver.message = `Winner is: ${user.name}!!`;
      }
    }
  },
  computed: {
    boxes() {
      return this.$store.state.boxes;
    },
    users() {
      return this.$store.state.users;
    },
    game() {
      return this.$store.state.game;
    },
    logs() {
      return this.$store.state.logs;
    }
  },
  watch: {
    boxes() {
      if (this.turnForUser !== null && !this.gameOver.status) {
        this.checkForWin(this.turnForUser);
      }
    },
    game() {
      if (!this.gameOver.status) {
        // kai pasikeicia game, gaunami naujo game duomenys
        if (this.$store.dispatch('getDataByGameId')) {

          // siunciamas log i db
          this.$store.dispatch('postLog', `Game is ready!!`);
        }
      }
    },
    logs: {
      handler: function() {
        // console.log(this.gameOver.status, )
        if (this.gameOver.status === true && this.gameOver.display === false) {
          if(this.$store.dispatch('getDataByGameId')) {
            this.gameOver.display = true;
            console.log('baigta');
          }

        }
      },
      deep: true
    }
  },
  created() {
    //perkrovus puslapi atstato zaidima
    if (localStorage.getItem('game') !== null) {
      this.$store.commit('setGame', localStorage.getItem('game'))
    }
  },
  mounted() {
    //perkrovus puslapi atstatoma kurio zaidėjo ejimo eile
    if (this.turnForUser !== null) {
      this.turnForUser = this.getTurnForUser();
    }
  },
  beforeDestroy() {
    // pries perkraunant puslapi game nuresetinamas
    this.$store.commit('setGame', null);
  }
}
</script>

<style scoped>
.box {
  width: 30vw;
  height: 30vw;
  background: #c93737;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

}

.window {
  width: 10vw;
  height: 10vw;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
}

.game-window {
  display: flex;
  flex-direction: column;
}

.widow-1 {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.logs {
  display: flex;
  justify-content: space-around;
}
</style>