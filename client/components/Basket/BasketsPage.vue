<!-- Default page that also displays freets -->

<template>
  <main>
    <AddBasketForm />
    <hr>
    <h1>My Baskets</h1>
    <p>Keep track of all the different buckets of items you want to buy here.</p>
    <section
      v-if="$store.state.baskets.length"
    >
      <BasketComponent
        v-for="item in $store.state.baskets"
        :key="item._id"
        :basket="item"
      />
    </section>
  </main>
</template>

<script>
import BasketComponent from '@/components/Basket/BasketComponent.vue';
import AddBasketForm from '@/components/Basket/AddBasketForm.vue';

export default {
  name: 'BasketsPage',
  components: {BasketComponent, AddBasketForm},
  mounted() {
    this.$store.commit('refreshBaskets');
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
