<!-- Default page that also displays freets -->

<template>
  <main>
    <h1>Deleted Items</h1>
    <p>View all your previously deleted pantry items here.</p>
    <section
      v-if="$store.state.pantryItems.length"
    >
      <PantryItemComponent
        v-for="item in $store.state.pantryItems"
        :key="item._id"
        :pantryItem="item"
        :reminder="$store.state.reminders[item._id]"
        :isPantry="false"
      />
    </section>
  </main>
</template>

<script>
import PantryItemComponent from '@/components/PantryItem/PantryItemComponent.vue';

export default {
  name: 'PantryItemsPage',
  components: {PantryItemComponent},
  mounted() {
    this.$store.commit('refreshPantryItems', false);
    this.$store.commit('refreshReminders');
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
