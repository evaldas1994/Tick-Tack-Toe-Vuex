<template>
<div>
  <div>
    <div v-if="logs !== null">
      <div v-for="item in logs" :key="item.id">
        <SingleLog :log="item"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SingleLog from "./SingleLog";

export default {
  name: "LogsBox",
  props: ['logs'],
  components: {
    SingleLog
  }
}
</script>

<style scoped>

</style>