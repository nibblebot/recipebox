import mongoose from "mongoose"
import Promise from "promise"
import { Recipe } from "./models/Recipe"

export default {
  Query: {
    recipes: () => Recipe.find().exec()
  }
}
