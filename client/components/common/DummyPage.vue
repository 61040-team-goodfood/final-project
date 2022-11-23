<!-- Dummy default page -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <DummyForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to GoodFood!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to manage your groceries.
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import DummyForm from '@/components/common/DummyForm.vue';

export default {
  name: 'DummyPage',
  components: {DummyForm},
};
</script>