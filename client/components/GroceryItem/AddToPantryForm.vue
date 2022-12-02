<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddToPantryForm',
  mixins: [BlockForm],
  props: {
    // Data from the stored item
    groceryItem: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      url: '/api/groceryItems',
      method: 'POST',
      hasBody: true,
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.groceryItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: this.groceryItem.quantity, placeholder: 'Enter number...', unit: this.groceryItem.unit },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: '', expires: true },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: 3, placeholder: 'Enter number...' }
      ],
      title: 'Add to Pantry',
      refreshGroceryItems: true,
      isPantry: false,
      expires: true,
      callback: () => {
        const message = 'Successfully added grocery item!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
        if (!this.alerts.length) {
          this.$emit('stopEditing');
        }
      }
    };
  }
};
</script>