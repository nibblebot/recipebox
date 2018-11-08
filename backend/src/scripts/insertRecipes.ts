import fs from "fs"
import mongoose from "mongoose"
import { Recipe } from "../models/Recipe"

const mongoURI = "mongodb://localhost:27017/test"
;(async () => {
  try {
    mongoose.connect(
      mongoURI,
      { useNewUrlParser: true }
    )
    const db = mongoose.connection
    db.on("error", err => {
      throw err
    })
    db.once("open", async () => {
      console.log(`connected to ${mongoURI}`)
      const recipesDir = "/data/recipes/"
      const filenames = await fs.promises.readdir(recipesDir)
      console.log(`Found ${filenames.length} recipes on disk`)
      for (const filename of filenames) {
        const jsonData = await fs.promises.readFile(recipesDir + filename, {
          encoding: "utf8"
        })
        console.log(`Loaded Recipe From Disk: ${filename}`)
        const recipeData = JSON.parse(jsonData)
        const recipe = new Recipe(recipeData)
        console.log(`created new recipe, saving...`)
        await recipe.save()
        console.log(`Recipe Saved to DB: ${filename}`)
      }
      db.close()
      process.exit(0)
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
