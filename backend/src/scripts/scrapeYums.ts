import fs from "fs"
import puppeteer from "puppeteer"

interface Recipe {
  ingredients: object[]
  title: string
  image: string
  slug: string
  originalUrl: string
}

const recipeDataDir = "/data/recipes/"
;(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
    })
    const allYumsUrl =
      "https://www.yummly.com/profile/Joshua24/collections/all-yums"
    const recipeFilenames = await fs.promises.readdir(recipeDataDir)
    console.log(`Found ${recipeFilenames.length} recipes on disk...`)

    await scrapeAllYums(browser, allYumsUrl, recipeFilenames)

    browser.close()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()

// -> goto All Yums page
// -> scrape yum urls, compare to FS cache
// -> foreach Yum Recipe Page
//    -> scrape Yum recipe to filesystem
async function scrapeAllYums(
  browser: puppeteer.Browser,
  url: string,
  filenames: string[]
) {
  const pages = await browser.pages()
  const page = pages[0]

  page.on("console", (msg) => {
    for (let i = 0; i < msg.args().length; ++i) {
      console.log(`${i}: ${msg.args()[i]}`)
    }
  })
  await page.goto(url, { waitUntil: "networkidle2" })
  console.log(`Loaded: ${url}`)

  // await page.click(".collection-banner")
  await page.keyboard.press("End")
  await page.waitFor(2000)
  await page.keyboard.press("End")
  await page.waitFor(2000)

  const yumUrls = await page.$$eval(
    ".collection-recipe-card-grid .link-overlay",
    (links: Element[]) => {
      return links.map((link) => link.getAttribute("href"))
    }
  )
  console.log(`Found ${yumUrls.length} yums...`)

  const scraping: string[] = []
  const skipped = []
  for (const yumUrl of yumUrls) {
    if (yumUrl) {
      const [recipeId] = yumUrl.split("/").slice(-1)
      // Check json filenames for pre-existing recipe
      if (recipeId && !filenames.includes(recipeId + ".json")) {
        scraping.push(recipeId)
      } else {
        skipped.push(recipeId)
      }
    }
  }
  if (skipped.length) {
    console.log(`Skipping ${skipped.length} duplicates`)
  }
  if (scraping.length) {
    const recipes = []
    const scrapers: Array<Promise<Recipe>> = []
    for (const slug of scraping) {
      const result = await scrapeRecipe(browser, "/recipe/" + slug)
      const filename = `${recipeDataDir}${slug}.json`
      await fs.promises.writeFile(filename, JSON.stringify(result), "utf8")
      console.log(`successfully saved ${filename}`)
    }
  }
}

// Load and scrape recipe from Yummly
async function scrapeRecipe(browser: puppeteer.Browser, slug: string) {
  console.log(`\nScraping ${slug}`)
  const page = await browser.newPage()
  await page.goto(`http://yummly.com${slug}`, {
    waitUntil: "networkidle2",
  })
  console.log(`Loaded ${slug}`)

  const title = await getTitle(page)
  if (!title) {
    throw new Error("No title found")
  }
  const image = await getRecipeImage(page)
  if (!image) {
    throw new Error("No image found")
  }
  const ingredients = await getIngredients(page)
  if (!ingredients || !ingredients.length) {
    throw new Error("No ingredients found")
  }
  const originalUrl = await getRecipeUrl(page)
  if (!originalUrl) {
    throw new Error("No original URL found")
  }

  page.close()

  const recipeData: Recipe = {
    ingredients,
    title,
    image,
    slug,
    originalUrl,
  }
  return recipeData
}

async function getTitle(page: puppeteer.Page) {
  const titleSelector = ".recipe .recipe-details h1"
  await page.waitForSelector(titleSelector)
  return page.$eval(
    titleSelector,
    (el) => el.textContent && el.textContent.trim()
  )
}

async function getIngredients(page: puppeteer.Page) {
  const ingredientSelector = ".recipe .IngredientLine"
  await page.waitForSelector(ingredientSelector)
  return await page.$$eval(ingredientSelector, (nodes) =>
    nodes.map((node) => {
      const amount = node.querySelector(".amount")
      const unit = node.querySelector(".unit")
      const ingredient = node.querySelector(".ingredient")
      const comment = node.querySelector(".remainder")
      const data: any = {}
      if (amount) {
        data.amount = amount.textContent && amount.textContent.trim()
      }
      if (unit) {
        data.unit = unit.textContent && unit.textContent.trim()
      }
      if (ingredient) {
        data.ingredient =
          ingredient.textContent && ingredient.textContent.trim()
      }
      if (comment) {
        data.comment = comment.textContent && comment.textContent.trim()
      }
      return data
    })
  )
}

async function getRecipeUrl(page: puppeteer.Page) {
  let originalUrl

  const readDirectionsSelector = ".recipe .recipe-show-full"
  await page.waitForSelector(readDirectionsSelector)
  const fullRecipeHref = await page.$eval(readDirectionsSelector, (el) =>
    el.getAttribute("href")
  )

  // // iframed original recipe
  // if (readDirectionsHref && readDirectionsHref.startsWith("/")) {
  //   await Promise.all([
  //     page.waitForNavigation(), // The promise resolves after navigation has finished
  //     page.click(readDirectionsSelector), // Clicking the link will indirectly cause a navigation
  //   ])
  //   const iframeSelector = "iframe.recipe-source-frame"
  //   await page.waitFor(iframeSelector)
  //   originalUrl = await page.$eval(iframeSelector, (el) =>
  //     el.getAttribute("src")
  //   )
  // }
  // // link directly to recipe
  // else {
  //   originalUrl = readDirectionsHref
  // }

  return (
    fullRecipeHref &&
    fullRecipeHref.replace(
      "?utm_campaign=yummly&utm_medium=yummly&utm_source=yummly",
      ""
    )
  )
}

// images loaded via JS
async function getRecipeImage(page: puppeteer.Page) {
  const recipeImageSelector = ".recipe-image"
  await page.waitForSelector(recipeImageSelector)
  const src = await page.$eval(recipeImageSelector, (el) =>
    el.getAttribute("src")
  )
  return src
}
