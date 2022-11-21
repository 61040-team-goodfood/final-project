<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
    <div class="sidebar">
      <div class="page">
        <router-link to="/reminders"
          :style="{ 'font-weight': $route.name === 'Reminders' ? 'bold': 'normal' }">
          Reminders
        </router-link>
      </div>
      <template v-if="$store.state.username">
        <div class="page">
          <router-link to="/pantry"
            :style="{ 'font-weight': $route.name === 'Pantry' ? 'bold': 'normal' }">
            My Pantry
          </router-link>
        </div>
        <div class="page">
            <router-link to="/history"
              :style="{ 'font-weight': $route.name === 'History' ? 'bold': 'normal' }">       
              History
            </router-link>
        </div>
        <div class="page">
            <router-link to="/recipes"
            :style="{ 'font-weight': $route.name === 'Recipes' || $route.name === 'Recipe' ? 'bold': 'normal' }">
            Recipes
          </router-link>
        </div>    
        <div class="page">
            <router-link to="/baskets"
            :style="{ 'font-weight': $route.name === 'Baskets' ? 'bold': 'normal' }">
            Baskets
          </router-link>
        </div>
  
      </template>
      <template v-else>
        <div class="page">
          <router-link to="/login"
            :style="{ 'font-weight': $route.name === 'Login' ? 'bold': 'normal' }">
            Login
          </router-link>
        </div>
      </template>
    </div>
  </template>
  
  <style scoped>
  .sidebar {
      height:100%;
      width:280px;
      position: fixed;
      z-index: 0;
      top: 0;
      left: 0;
      background-color: rgb(224, 242, 255);
      overflow-x: hidden;
      padding-top: 80px;
      text-align: center;
  }
  
  .sidebar a {
    text-decoration: none;
    color: black;
    font-size: 28px;
  }
  
  .page {
    margin: 20px;
  }
  </style>