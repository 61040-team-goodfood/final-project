<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'EditPantryItemForm',
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
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    pantryItem: function(newItem, oldItem) {
      this.fields = [
        { type: 'text', id: 'name', label: 'Name', value: newItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: newItem.quantity, placeholder: 'Enter number...', unit: newItem.unit },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: newItem.expirationDate ? newItem.expirationDate : ' ', tooltip: 'Expiration date must be in the future. If no expiration date is given, a reminder will be automatically set for a month after the date added into the pantry' },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: newItem.expirationDate ? Math.ceil((new Date(newItem.expirationDate) - new Date(this.reminder.date))/ (1000 * 60 * 60 * 24)) : 3, placeholder: 'Enter number...', tooltip:'Reminders can only be set to a future date' }
      ];
      this.expires = newItem.expirationDate !== '';
    },
    visible: function(newValue, oldValue) {
      // If form visibility changes (i.e. user clicks stop editing), re-populate fields back to saved values. 
      if (newValue === false) {
        this.fields = [
          { type: 'text', id: 'name', label: 'Name', value: this.pantryItem.name, placeholder: 'Enter name...' }, 
          { type: 'quantity', id: 'quantity', label: 'Quantity', value: this.pantryItem.quantity, placeholder: 'Enter number...', unit: this.pantryItem.unit },
          { type: 'date', id: 'expiration', label: 'Expiration Date', value: this.pantryItem.expirationDate ? this.pantryItem.expirationDate : ' ', tooltip: 'Expiration date must be in the future. If no expiration date is given, a reminder will be automatically set for a month after the date added into the pantry' },
          { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: this.pantryItem.expirationDate ? Math.ceil((new Date(this.pantryItem.expirationDate) - new Date(this.reminder.date))/ (1000 * 60 * 60 * 24)) : 3, placeholder: 'Enter number...', tooltip:'Reminders can only be set to a future date' }
        ];
        this.expires = this.pantryItem.expirationDate !== '';
      }
    }
  },
  data() {
    return {
      url: `/api/pantryItems/${this.pantryItem._id}`,
      method: 'PATCH',
      hasBody: true,
      collapsible: false,
      dismissible: true,
      title: 'Edit Item',
      submitText: 'Done Editing',
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.pantryItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: this.pantryItem.quantity, placeholder: 'Enter number...', unit: this.pantryItem.unit },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: this.pantryItem.expirationDate ? this.pantryItem.expirationDate : ' ', tooltip: 'Expiration date must be in the future. If no expiration date is given, a reminder will be automatically set for a month after the date added into the pantry' },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: this.pantryItem.expirationDate ? Math.ceil((new Date(this.pantryItem.expirationDate) - new Date(this.reminder.date))/ (1000 * 60 * 60 * 24)) : 3, placeholder: 'Enter number...', tooltip:'Reminders can only be set to a future date' }
      ],
      refreshPantryItems: true,
      refreshReminders: true,
      isPantry: true,
      expires: this.pantryItem.expirationDate !== '',
      callback: () => {
        const message = 'Successfully edited pantry item!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>