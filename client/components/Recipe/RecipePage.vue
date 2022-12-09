<template>
    <div>
        <div v-if="fetching">
            <strong>Loading...</strong>
        </div>  
        <main v-else>
            <header>
                <h1>{{ recipe.name }}</h1>
                <button
                    v-if="$store.state.username === recipe.author" 
                    class="btn btn-danger my-2 bi bi-trash" 
                    @click="deleteRecipe"
                >
                    Delete
                </button>
            </header>
            <p>Recipe by @{{ recipe.author }}</p><br>
            <p class="text-secondary"><i>Cook Time:</i> {{ recipe.cookTime }} minutes</p>

            <div class="border rounded my-3 px-4 py-2">
                <div class="row">
                    <h4 class="my-2 col-10">Ingredients</h4>
                    <button 
                        class="btn btn-info btn-sm mr-2 my-2 right"
                        @click="addToBasket = !addToBasket"
                    >
                        Add to Baskets
                    </button>
                </div>
                <ul>
                    <li
                        v-for="ingredient in recipe.ingredients"
                    >
                        {{ ingredient.name }} × {{ ingredient.quantity }} {{ ingredient.unit }}
                    </li>
                </ul>
                <section v-if="addToBasket">
                <AddFromRecipeToBasketForm
                    class="mt-4"
                    :recipe=recipe
                    @refreshRecipePage="addToBasket = !addToBasket"
                />
            </section>
            </div>
            <div class="border rounded my-3 px-4 py-2">
                <h4 class="my-2">Instructions</h4>
                {{ recipe.instructions }}
            </div>
        </main>   
    </div>
</template>

<script>
import AddFromRecipeToBasketForm from '@/components/Recipe/AddFromRecipeToBasketForm.vue';

export default {
    name: 'RecipePage',
    components: {AddFromRecipeToBasketForm},
    data() {
        return {
            fetching: true,
            recipe: null,
            addToBasket: false,
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
        // toggleAddToBasket() {
        //   this.addToBasket = !this.addToBasket;
        // },
        async fetchData() {
            this.fetching = true;

            const options = {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin'
            };

            try {
                const url = `/api/recipes/${this.$route.params.recipeId}`;
                const r = await fetch(url, options);
                const res = await r.json();

                if (!r.ok) {
                    throw new Error(res.error)
                }

                this.recipe = res; 
                this.fetching = false;

            } catch (e) { 
                this.$store.commit('alert', {
                    message: e, 
                    status: 'danger'
                });
                this.$router.push({ path: '/404' });
            }
        }, 
        async deleteRecipe() {
            const options = {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin'
            };

            try {
                const url = `/api/recipes/${this.$route.params.recipeId}`;
                const r = await fetch(url, options);
                const res = await r.json();

                if (!r.ok) {
                    throw new Error(res.error)
                }
                
                this.$store.commit('alert', {
                    message: 'Successfully deleted recipe!', 
                    status: 'success'
                });

            } catch (e) { 
                this.$store.commit('alert', {
                    message: e, 
                    status: 'danger'
                });
                this.$router.push({ path: '/404' });
            }

            this.$router.push({ path: '/recipes' });
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