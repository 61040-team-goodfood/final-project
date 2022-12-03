<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddToPantryForm',
  mixins: [BlockForm],
  props: {
    // Data from the stored item
    pantryItem: {
      type: Object,
      required: true
    },
    reminder: {
      type: Object,
      required: true
    }
  },
  watch: {
    pantryItem: function(newItem, oldItem) {
      this.fields = [
        { type: 'text', id: 'name', label: 'Name', value: newItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: newItem.quantity, placeholder: 'Enter number...', unit: newItem.unit },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: newItem.expirationDate, expires: newItem.expirationDate !== '' },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: newItem.expirationDate ? Math.ceil((new Date(newItem.expirationDate) - new Date(reminder.date))/ (1000 * 60 * 60 * 24)) : 3, placeholder: 'Enter number...' }
      ];
    }
  },
  data() {
    return {
      url: '/api/pantryItems',
      method: 'POST',
      hasBody: true,
      collapsible: false,
      title: 'Add to Pantry',
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.pantryItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: this.pantryItem.quantity, placeholder: 'Enter number...', unit: this.pantryItem.unit },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: this.pantryItem.expirationDate, expires: this.pantryItem.expirationDate !== '' },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: this.pantryItem.expirationDate ? Math.ceil((new Date(this.pantryItem.expirationDate) - new Date(reminder.date))/ (1000 * 60 * 60 * 24)) : 3, placeholder: 'Enter number...' }
      ],
      refreshPantryItems: true,
      refreshReminders: true,
      isPantry: false,
      expires: true,
      callback: () => {
        const message = 'Successfully added pantry item!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>