<template>
    <main>
      <section>
        <header>
          <h1>About GoodFood</h1>
        </header>
        <article>
          <br/>
          <p>Each year, 108 billion pounds of food are wasted in the United States, much of which is attributable to wasted groceries. Enter GoodFood, an app that encourages people to use their groceries before they expire.</p>
          <p>Select a section below to learn more.</p>
          <section class="border rounded p-4">
            <button @click="pantryCollapsed = !pantryCollapsed" class="btn btn-link btn-block text-left p-0" type="button" data-toggle="collapse" data-target="#pantry-and-reminders" aria-expanded="false">
              <h3>
                Pantry & Reminders
                <i v-if="pantryCollapsed" class="bi bi-caret-left-fill right"></i>
                <i v-else class="bi bi-caret-down-fill right"></i>
              </h3>
            </button>
            <section class="collapse pb-3" id="pantry-and-reminders">
              <p class="mt-3">We provide users with a convenient, expedited way to keep track of all their groceries. On the Pantry page, you can add items to your pantry:</p>
              <img src="@/public/addPantryItem.png" class="col-9 ml-2 border-left border-5"/>
              <p class="mt-5">When adding items to the pantry, you only need to specify the item name, quantity and unit. If you choose to add an expiration date, you will be allowed to decide when to be reminded about the item. The default date is three days before the expiration date. Else, if no expiration date is provided, we will remind you about the item a month later. The reminders will appear on the Home page once logged in along with a badge indicating how many reminders you have. You will have the option to dismiss the reminder or view recipes that can help you use up the item:</p>
              <img src="@/public/reminders.png" class="col-9 ml-2 border-left border-5"/>
              <p class="mt-5">After adding the items, you will see them listed in the Pantry page, where you can edit or delete the items as they are being used. Pantry items are displayed by ascending expiration date. If no expiration dates are provided, the items will be displayed by ascending date added after the items with expiration dates. </p>
              <img src="@/public/pantryPage.png" class="col-9 ml-2 border-left border-5"/>
            </section>
          </section>
          <section class="border rounded p-4">
            <button @click="deletedCollapsed = !deletedCollapsed" class="btn btn-link btn-block text-left p-0" type="button" data-toggle="collapse" data-target="#deleted-items" aria-expanded="false">
              <h3>
                Deleted Items
                <i v-if="deletedCollapsed" class="bi bi-caret-left-fill right"></i>
                <i v-else class="bi bi-caret-down-fill right"></i>
              </h3>
            </button>
            <section class="collapse pb-3" id="deleted-items">
              <p class="mt-3">Once the items are deleted from the pantry, they will appear on the Deleted Items page:</p>
              <img src="@/public/deletedItems.png" class="col-9 ml-2 border-left border-5"/>
              <p class="mt-5">This page provides an easy way to add items back into the pantry:</p>
              <img src="@/public/addToPantry.png" class="col-9 ml-2 border-left border-5"/>
              <p class="mt-5">Both items in the pantry and in the deleted items page also has an option to add to baskets:</p>
              <img src="@/public/addToBaskets.png" class="col-9 ml-2 border-left border-5"/>
            </section>
          </section>
          <section class="border rounded p-4">
            <button @click="basketsCollapsed = !basketsCollapsed" class="btn btn-link btn-block text-left p-0" type="button" data-toggle="collapse" data-target="#baskets" aria-expanded="false">
              <h3>
                Baskets
                <i v-if="basketsCollapsed" class="bi bi-caret-left-fill right"></i>
                <i v-else class="bi bi-caret-down-fill right"></i>
              </h3>
            </button>
            <section class="collapse pb-3" id="baskets">
              <p class="mt-3">Baskets are a way of keeping track of different sets of items you want to buy. On the baskets page, you can see the list of baskets as well as the items in each:</p>
              <img src="@/public/basketsPage.png" class="col-9 ml-2 border-left border-5"/>
              <p class="mt-5">When creating baskets, you first need to name it and optionally, populate it with items, one at a time:</p>
              <img src="@/public/createBasket.png" class="col-9 ml-2 border-left border-5"/>
              <p class="mt-5">Once on an individual baskets page, you can modify/delete the basket. When you've bought items in a basket, you can also express add it to the pantry:</p>
              <img src="@/public/basketPage.png" class="col-9 ml-2 border-left border-5"/>
            </section>
          </section>
          <section class="border rounded p-4">
            <button @click="recipesCollapsed = !recipesCollapsed" class="btn btn-link btn-block text-left p-0" type="button" data-toggle="collapse" data-target="#recipes" aria-expanded="false">
              <h3>
                Recipes
                <i v-if="recipesCollapsed" class="bi bi-caret-left-fill right"></i>
                <i v-else class="bi bi-caret-down-fill right"></i>
              </h3>
            </button>
            <section class="collapse" id="recipes">
              <p class="mt-3">You can explore existing recipes:</p>
              <img src="@/public/recipesPage.png" class="col-9 ml-2 border-left border-5"/>
              <p class="mt-5">You can also upload your own recipes:</p>
              <img src="@/public/addRecipe.png" class="col-9 ml-2 border-left border-5"/>
              <p class="mt-5">Or filter through already uploaded recipes for ones that contain both the inputted keyword and ingredients: </p>
              <img src="@/public/filterRecipe.png" class="col-9 ml-2 border-left border-5"/>
            </section>
        </section>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  
  export default {
    name: 'AboutPage',
    data() {
      return {
        pantryCollapsed: true,
        deletedCollapsed: true,
        basketsCollapsed: true,
        recipesCollapsed: true
      }
    }
  };
  </script>


<style scoped>
.btn-info {
  width: 100%;
}

.btn-link {
  color: inherit;
}

.right {
  float: right;
}
</style>
