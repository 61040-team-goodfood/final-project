<!-- Default page that also displays freets -->

<template>
  <main>
    <h2 class="display-4">History</h2>
    <section
      v-if="$store.state.pantryItems.length"
    >
      <PantryItemComponent
        v-for="item in $store.state.pantryItems"
        :key="item.id"
        :pantryItem="item"
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
