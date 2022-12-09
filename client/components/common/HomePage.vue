<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h1>Welcome @{{ $store.state.username }}!</h1>
      </header>
      <header>
        <h3 v-if="$store.state.numReminders">Reminders</h3>
        <h3 v-else><i>You currently have no reminders.</i></h3>
      </header>
      <section 
        v-if="$store.state.numReminders">
        <ReminderComponent 
          v-for="reminder in Object.values($store.state.reminders).filter(reminder => !reminder.dismissed && new Date(`${reminder.date}T00:00:00.000-05:00`) <= new Date())" 
          :key="reminder._id"
          :reminder="reminder" />
      </section>
    </section>
    <section v-else>
      <header>
        <h2 class="display-4">Welcome to GoodFood!</h2>
      </header>
      <article>
        <h3>
          <i>
            <router-link to="/login">
              Sign in
            </router-link>
            to manage your groceries.
          </i>
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import ReminderComponent from '@/components/Reminder/ReminderComponent.vue';

export default {
  name: 'HomePage',
  components: { ReminderComponent },
  mounted() {
    if (this.$store.state.username) {this.$store.commit('refreshReminders');}
  }
};
</script>