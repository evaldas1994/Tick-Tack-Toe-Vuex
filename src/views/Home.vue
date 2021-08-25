<template>
  <div class="home d-flex justify-content-around flex-column">
    <div class="users-field d-flex justify-content-around">
      <UserField :userID="userID[0]" value="gskoma"/>
      <UserField :userID="userID[1]" value="titobu"/>
    </div>

    <div class="d-flex justify-content-around">
      <BeginButton/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import BeginButton from "../components/BeginButton";
import UserField from "../components/UserField";

export default {
  name: 'Home',
  components: {
    BeginButton,
    UserField
  },
  data: () => {
    return {
      userID: [1,2]
    }
  },
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>