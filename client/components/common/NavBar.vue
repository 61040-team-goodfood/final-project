<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <div 
    class="sidebar d-flex flex-column flex-shrink-0 p-4 text-white bg-dark" 
  >
    <router-link 
      class="text-white"
      to="/"
    >
      <h2 class="fs-4 mb-4">
        GoodFood
      </h2>
    </router-link>
    <br/>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item mb-3">
        <router-link 
          class="text-white"
          to="/"
        >
          <i class="bi bi-house mx-2"></i>
          <span class="fs-4">Home <span v-if="($store.state.username && $store.state.numReminders > 0)" class="badge badge-danger">{{$store.state.numReminders}}</span></span>
        </router-link>
      </li>
      <li class="nav-item mb-3" v-if="$store.state.username">
        <router-link 
          class="text-white"
          to="/pantry"
        >
          <i class="bi bi-bookshelf mx-2"></i>
          <span class="fs-4">Pantry</span>
        </router-link>
      </li>
      <li class="nav-item mb-3" v-if="$store.state.username">
        <router-link 
          class="text-white"
          to="/deleteditems"
        >
          <i class="bi bi-clock mx-2"></i>
          <span class="fs-4">Deleted Items</span>
        </router-link>
      </li>
      <li class="nav-item mb-3" v-if="$store.state.username">
        <router-link 
          class="text-white"
          to="/baskets"
        >
          <i class="bi bi-basket mx-2"></i>
          <span class="fs-4">Baskets</span>
        </router-link>
      </li>
      <li class="nav-item mb-3" v-if="$store.state.username">
        <router-link 
          class="text-white"
          to="/recipes"
        >
          <i class="bi bi-book mx-2"></i>
          <span class="fs-4">Recipes</span>
        </router-link>
      </li>
      <li class="nav-item mb-3">
        <router-link 
          class="text-white"
          to="/help"
        >
        <i class="bi bi-info-circle mx-2"></i>
          <span class="fs-4">Help</span>
        </router-link>
      </li>
      <li class="nav-item mb-3" v-if="$store.state.username">
        <router-link 
          class="text-white"
          to="/account"
        >
          <i class="bi bi-speedometer2 mx-2"></i>
          <span class="fs-4">Account</span>
        </router-link>
      </li>
    </ul>
    <div v-if="$store.state.username">
      <a 
        class="text-white"
        to="/"
        @click.prevent="logout"
      >
        <i class="bi bi-box-arrow-left mx-2"></i>
        <span class="fs-4">Sign Out</span>
    </a>
    </div>
    <div v-else>
      <router-link 
        class="text-white"
        to="/login"
      >
        <i class="bi bi-person-circle mx-2"></i>
        <span class="fs-4">Sign In</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  methods: {
    async logout() {
      const options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      try {
        const r = await fetch('/api/users/session', options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }
        this.$store.commit('setUsername', null);
        this.$store.commit('alert', {
          message: 'You are now signed out!',
          status: 'success'
        });
        this.$router.push({name: 'Home'});
      } catch (e) {
        this.$store.commit('alert', {
          message: e, 
          status: 'danger'
        });
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  height: 100vh;
  width: 100%;
}

a:hover {
  text-decoration: underline !important;
}
</style>