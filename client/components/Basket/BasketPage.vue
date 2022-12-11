<template>
    <div>
        <div class="modal fade" :id="basket._id + 'confirmationModal'" tabindex="-1" role="dialog" :aria-labelledby="basket._id + 'confirmationModalLabel'" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this basket?
                </div>
                <div class="modal-footer">
                    <button 
                    type="button" 
                    class="btn btn-danger" 
                    data-dismiss="modal"
                    @click="deleteBasket"
                    >
                    Confirm
                    </button>
                    <button 
                    type="button" 
                    class="btn btn-secondary"
                    data-dismiss="modal"
                    >
                    Cancel
                    </button>
                </div>
                </div>
            </div>
            </div>
        <div v-if="fetching">
            <strong>Loading...</strong>
        </div>  
        <main v-else>
            <header>
                <h1>{{ basket.name }}</h1>
                <section>
                    <button
                        class="btn btn-danger my-2 bi bi-trash right" 
                        data-toggle="modal" 
                        :data-target="'#' + basket._id + 'confirmationModal'"
                    >
                        Delete
                    </button>
                    <button
                        v-if="!editing" 
                        class="btn btn-primary mr-2 my-2 bi bi-pencil right"
                        @click="toggleEditing"
                    >
                        Edit
                    </button>
                    <button 
                        v-else
                        class="btn btn-secondary mr-2 my-2 bi bi-x right"
                        @click="toggleEditing"
                    >
                        Stop Editing
                    </button>
                </section>
            </header>
            <section class="border rounded my-3 px-4 py-2">
                <h4 class="my-2">Basket Items</h4>
                <ul>
                    <li
                        v-for="ingredient in basket.ingredients"
                    >
                        {{ ingredient.name }} × {{ ingredient.quantity }} {{ ingredient.unit }}
                    </li>
                </ul>
                <EditBasketForm 
                    class="mt-4"
                    :basket=basket
                    :visible="editing"
                    @refreshBasketPage="fetchData"
                />
            </section>
            <button 
                class="btn btn-block btn-info my-2"
                @click="toggleAddToPantry"
            >
                    Add to Pantry
            </button>
            <section v-if="addToPantry">
                <AddFromBasketToPantryForm 
                    class="mt-4"
                    :basket=basket 
                    @refreshBasketPage="toggleAddToPantry"  
                />
            </section>
        </main>   
    </div>
</template>

<script>
import EditBasketForm from '@/components/Basket/EditBasketForm.vue';
import AddFromBasketToPantryForm from '@/components/Basket/AddFromBasketToPantryForm.vue';

export default {
    name: 'BasketPage',
    components: {EditBasketForm, AddFromBasketToPantryForm},
    data() {
        return {
            fetching: true,
            basket: null,
            editing: false,
            addToPantry: false,
        }
    },
    watch: {
        async $route() {
            await this.fetchData();
        }
    },
    async created() {
        await this.fetchData();
    },
    methods: {
        toggleAddToPantry() {
          this.addToPantry = !this.addToPantry;
          this.editing = false;
        },
        toggleEditing() {
          this.editing = !this.editing;
          this.addToPantry = false;
        },
        async fetchData() {
            this.fetching = true;

            const options = {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin'
            };

            try {
                const url = `/api/baskets/${this.$route.params.basketId}`;
                const r = await fetch(url, options);
                const res = await r.json();

                if (!r.ok) {
                    throw new Error(res.error)
                }

                this.basket = res; 
                this.fetching = false;
                this.editing = false;

            } catch (e) { 
                this.$store.commit('alert', {
                    message: e, 
                    status: 'danger'
                });
                this.$router.push({ path: '/404' });
            }
        }, 
        async deleteBasket() {
            const options = {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin'
            };

            try {
                const url = `/api/baskets/${this.$route.params.basketId}`;
                const r = await fetch(url, options);
                const res = await r.json();

                if (!r.ok) {
                    throw new Error(res.error)
                }
                
                this.$store.commit('alert', {
                    message: 'Successfully deleted basket!', 
                    status: 'success'
                });

            } catch (e) { 
                this.$store.commit('alert', {
                    message: e, 
                    status: 'danger'
                });
                this.$router.push({ path: '/404' });
            }

            this.$router.push({ path: '/baskets' });
        }
    }

}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  height: max-content;
}

.right {
  float: right;
}
</style>