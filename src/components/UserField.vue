<template>
<div class="">
  <input type="text" :placeholder="`User${userID}`" v-model="name">
</div>
</template>

<script>
export default {
  name: "UserField",
  props: ['userID', 'value'],
  data: () => {
    return {
      name: ""
    }
  },
  watch: {
    name: function (val) {
      const id = this.userID;
      if (this.isInputLengthValid(val) && this.isInputsNotMach(val)) {
        const arr = [val, id];
        this.$store.dispatch('changeUser', arr);
      }else {
        const arr = ['', id];
        this.$store.dispatch('changeUser', arr);
      }
    }
  },
  methods: {
    isInputLengthValid(text) {
      return text.length > 3 && text.length < 15;
    },
    isInputsNotMach(text) {
      const users = this.$store.state.users;
      return !users.find(x => x.name === text);

    }
  },
  created() {
    // this.name = this.value;
  }
}
</script>

<style scoped>

input {
  width: 200px;
}
</style>