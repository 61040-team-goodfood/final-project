<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'EditBasketForm',
  mixins: [BlockForm],
  props: {
    // Data from the stored item
    basket: {
      type: Object,
      required: true
    },
  },
  watch: {
    basket: function(newBasket, oldBasket) {
      this.fields = [
        { type: 'text', id: 'name', label: 'Name', value: newBasket.name, placeholder: 'Enter name...' }, 
        { type: 'ingredients', id: 'ingredients', label: 'Items', name: '', quantity: '', unit: '', ingredients: newBasket.ingredients },
      ];
    }
  },
  data() {
    return {
      url: `/api/baskets/${this.basket._id}`,
      method: 'PATCH',
      hasBody: true,
      collapsible: false,
      title: 'Edit Basket',
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.basket.name, placeholder: 'Enter name...' }, 
        { type: 'ingredients', id: 'ingredients', label: 'Items', name: '', quantity: '', unit: '', ingredients: this.basket.ingredients },
      ],
      refreshBaskets: true,
      callback: () => {
        const message = 'Successfully edited basket!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>
