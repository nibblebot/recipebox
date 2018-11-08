import { promises } from "fs"
import request from "superagent"

const { readdir, readFile, writeFile } = promises
;(async () => {
  const recipeDir = "/data/recipes/"
  const imagesDir = "/data/images/"

  try {
    const recipes = await readdir(recipeDir)
    const images = new Set()
    for (const recipeFilename of recipes) {
      const data = await readFile(recipeDir + recipeFilename, {
        encoding: "utf8"
      })
      const recipe = JSON.parse(data)
      if (recipe.image.startsWith("http")) {
        images.add(recipe.image)
      }
    }
    console.log(`Found ${images.size} images`)
    for (const imageUrl of images) {
      const res = await request.get(imageUrl)
      const [slug] = imageUrl.split("/").slice(-1)
      const filename = imagesDir + slug + ".jpg"
      await writeFile(filename, res.body)
      console.log(`saved ${filename}`)
    }
  } catch (err) {
    console.error(err)
  }
})()
