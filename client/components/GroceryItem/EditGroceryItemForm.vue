<script>
import BlockForm from '@/components/common/BlockForm.vue';
import moment from 'moment';

export default {
  name: 'EditGroceryItemForm',
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
      url: `/api/groceryItems/${this.groceryItem._id}`,
      method: 'PATCH',
      hasBody: true,
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.groceryItem.name }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: this.groceryItem.quantity, unit: this.groceryItem.unit },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: this.groceryItem.expirationDate },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: this.groceryItem.expirationDate ? Math.ceil((new Date(this.groceryItem.expirationDate) - new Date(this.groceryItem.remindDate))/ (1000 * 60 * 60 * 24)) : 0 }
      ],
      title: 'Edit Item',
      refreshGroceryItems: true,
      expires: true,
      callback: () => {
        const message = 'Successfully edited grocery item!';
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