import { series } from "async"
import mongoose from "mongoose"
import { Recipe } from "./models/Recipe"

const mongoURI = "mongodb://localhost:27017/test"
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true }
)
const insertRecipes = (cb: () => void) => {
  Recipe.insertMany(
    [
      {
        name: "Vegan Cheese"
      },
      {
        name: "Tofu Green Curry"
      },
      {
        name: "Oat Waffles"
      },
      {
        image: "/tofu-drunken-noodles.jpg",
        ingredients: [
          "8 to 10 ounces dried Chinese-style wheat noodles",
          "2 kaffir lime leaves (sliced very thinly, or cut into thin strips with scissors (remove stem))",
          "2 shallots (thinly sliced and diced)",
          "4 cloves garlic (minced)",
          "1 piece galangal (or ginger, sliced thinly)",
          "1 red chilli, sliced finely (and de-seeded if milder noodles are desired)",
          "1/2 package firm tofu (if non-vegetarian, you can substitute shrimp or bite-size pieces of chicken)",
          "3 tomatoes (cut into bite-size pieces)",
          "1 head broccoli (cut into florets, OR 1 cup bok choy or other Chinese-type cabbage)",
          "1 to 2 cups bean sprouts",
          "1/2 cup fresh coriander leaves",
          "1/2 cup fresh basil (roughly chopped if leaves are large)",
          "vegetable oil for stir-frying ",
          '1 1/2 tablespoons ground bean sauce (also called "yellow bean" - actually a soy bean sauce found in Asian food stores)',
          "1 tablespoon rice vinegar (or substitute white vinegar)",
          "1 tablespoon fish sauce OR 1 1/2 tablespoons soy sauce",
          "1 1/2 tablespoons lime juice",
          "1 tablespoon brown sugar "
        ],
        name: "Tofu Drunken Noodles"
      },
      {
        name: "Korean Braised Tofu"
      },
      {
        name: "Almond Cookies"
      },
      {
        name: "Soy Protein Pancakes"
      }
    ],
    cb
  )
}

series(
  [
    cb => mongoose.connection.once("open", cb),
    cb => insertRecipes(cb),
    cb => mongoose.connection.close(cb)
  ],
  cb => process.exit(1)
)