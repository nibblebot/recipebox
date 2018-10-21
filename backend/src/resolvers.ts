import mongoose from "mongoose"
import { Recipe } from "./models/Recipe"

export default {
  Query: {
    recipe: (_: any, args: { id: mongoose.Types.ObjectId }) =>
      Recipe.findById(args.id).exec(),
    recipes: () => {
      const results = Recipe.find()
        .select("name image")
        .exec()
      console.log(results)
      return results
    }
  }
}
