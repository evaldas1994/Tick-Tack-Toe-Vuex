<template>
  <div class="">
    <div class="begin">
      <p class="m-0" @click="start">START</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BeginButton",
  methods: {
    start() {
      if (this.isAllowedToContinue) {
        if (this.$store.dispatch(`postUsersToDatabase`)) {
          this.$router.push('/game');
        } else {
          this.$router.push('/');
        }
      }

    }
  },
  computed: {
    isAllowedToContinue() {
      if (this.$store.state.users[0].name !== "" &&
          this.$store.state.users[1].name !== "" &&
          this.$store.state.users[0].name !== this.$store.state.users[1].name) {
        return true;
      } else {
        return false;
      }
    },
  }
}
</script>

<style scoped>
  .begin {
    color: silver;
    width: max-content;
    padding: 10px 40px;
    font-size: 2rem;
    border: 1px solid green;
  }

  .begin:hover {
    color: green;
  }
</style>