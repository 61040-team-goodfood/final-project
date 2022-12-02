<!-- Default page that also displays freets -->

<template>
  <main>
    <h2 class="display-4">History</h2>
    <section
      v-if="$store.state.groceryItems.length"
    >
      <GroceryItemComponent
        v-for="item in $store.state.groceryItems"
        :key="item.id"
        :groceryItem="item"
        :isPantry="false"
      />
    </section>
  </main>
</template>

<script>
import GroceryItemComponent from '@/components/GroceryItem/GroceryItemComponent.vue';

export default {
  name: 'GroceryItemsPage',
  components: {GroceryItemComponent},
  mounted() {
    this.$store.commit('refreshGroceryItems', false);
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
