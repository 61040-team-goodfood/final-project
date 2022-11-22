<!-- Form for creating freets (block style) -->

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
        {id: 'name', label: 'Name', value: this.groceryItem.name},
        {id: 'quantity', label: 'Quantity', value: this.groceryItem.quantity},
        {id: 'unit', label: 'Unit', value: this.groceryItem.unit, options: [
          {id: 'count', value: 'Count'},
          {id: 'cups', value: 'Cups'},
          {id: 'ounces', value: 'Ounces'},
          {id: 'tablespoons', value: 'Tablespoons'},
          {id: 'teaspoons', value: 'Teaspoons'},
          {id: 'grams', value: 'Grams'}
        ]},
        {id: 'expiration', label: 'Expiration Date', value: this.groceryItem.expirationDate},
        {
          id: 'remindDays', 
          label: 'Remind me', 
          value: new Date(this.groceryItem.expirationDate) - new Date(this.groceryItem.remindDate),
          value: this.groceryItem.expirationDate ? Math.ceil((new Date(this.groceryItem.expirationDate) - new Date(this.groceryItem.remindDate))/ (1000 * 60 * 60 * 24)) : 0, 
          append: 'days in advance'
        }
      ],
      title: 'Save',
      // refreshGroceryItems: true,
      callback: () => {
        this.$store.commit('refreshGroceryItems', true);
        const message = 'Successfully added a grocery item!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
        this.$emit('stopEditing');
      }
    };
  }
};
</script>