<!-- Form for deleting account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DeleteAccountForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/users',
      method: 'DELETE',
      setUsername: true,
      collapsible: false,
      title: 'Delete Account',
      fields: [],
      content: 'Deleting your account is permanent and irreversible. Proceed only if you understand these consequences.',
      callback: () => {
        this.$router.push({ name: 'Home' }); // Goes to Home page after deleting account
        this.$store.commit('alert', {
          message: 'Your account has been deleted!', status: 'success'
        });
      }
    };
  }
};
</script>

<style scoped>
button {
  border: #dc3545;
  background-color: #dc3545;
}

button:hover {
  border: #bd2130;
  background-color: #c82333;
}
</style>
