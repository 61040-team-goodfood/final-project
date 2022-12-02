<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddBasketForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/baskets',
      method: 'POST',
      hasBody: true,
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: '', placeholder: 'Enter name...' }, 
        { type: 'ingredients', id: 'ingredients', label: 'Items', name: '', quantity: '', unit: '', ingredients: [] },
      ],
      title: 'Add New Basket',
      refreshBaskets: true,
      callback: () => {
        const message = 'Successfully added a basket!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>
