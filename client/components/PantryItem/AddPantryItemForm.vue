<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddPantryItemForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/pantryItems',
      method: 'POST',
      hasBody: true,
      collapsible: true,
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: '', placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: '', placeholder: 'Enter number...', unit: '' },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: '', expires: true, tooltip: 'Expiration date must be in the future. If no expiration date is given, a reminder will be automatically set for a month after the date added into the pantry' },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: 3, placeholder: 'Enter number...', tooltip:'Reminders can only be set to a future date' }
      ],
      title: 'Add New Item',
      refreshPantryItems: true,
      refreshReminders: true,
      isPantry: true,
      expires: true,
      callback: () => {
        const message = 'Successfully added a pantry item!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>
