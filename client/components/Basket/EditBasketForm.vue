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
    visible: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    basket: function(newBasket, oldBasket) {
      this.fields = [
        { type: 'text', id: 'name', label: 'Name', value: newBasket.name, placeholder: 'Enter name...' }, 
        { type: 'ingredients', id: 'ingredients', label: 'Items', name: '', quantity: '', unit: '', ingredients: [...newBasket.ingredients] },
      ];
    }, 
    visible: function(newValue, oldValue) {
      if (newValue === false) {
        this.fields = [
          { type: 'text', id: 'name', label: 'Name', value: this.basket.name, placeholder: 'Enter name...' }, 
          { type: 'ingredients', id: 'ingredients', label: 'Items', name: '', quantity: '', unit: '', ingredients: [...this.basket.ingredients] },
        ];
      }
    }
  },
  data() {
    return {
      url: `/api/baskets/${this.basket._id}`,
      method: 'PATCH',
      hasBody: true,
      collapsible: false,
      dismissible: true,
      title: 'Edit Basket',
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.basket.name, placeholder: 'Enter name...' }, 
        { type: 'ingredients', id: 'ingredients', label: 'Items', name: '', quantity: '', unit: '', ingredients: [...this.basket.ingredients] },
      ],
      refreshBaskets: true,
      callback: () => {
        const message = 'Successfully edited basket!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
        this.$emit('refreshBasketPage');
      }
    };
  }
};
</script>
