import fs from "fs"
import puppeteer from "puppeteer"
import { promisify } from "util"

async function getTitle(page: puppeteer.Page) {
  const titleSelector = ".recipe .recipe-details h1"
  await page.waitForSelector(titleSelector)
  return page.$eval(
    titleSelector,
    el => el.textContent && el.textContent.trim()
  )
}

async function getIngredients(page: puppeteer.Page) {
  const ingredientSelector = ".recipe .IngredientLine"
  await page.waitForSelector(ingredientSelector)
  return await page.$$eval(ingredientSelector, nodes =>
    nodes.map(node => {
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

  const readDirectionsSelector = ".recipe .recipe-show-full-directions"
  await page.waitForSelector(readDirectionsSelector)
  const readDirectionsHref = await page.$eval(readDirectionsSelector, el =>
    el.getAttribute("href")
  )

  // iframed original recipe
  if (readDirectionsHref && readDirectionsHref.startsWith("/")) {
    await Promise.all([
      page.waitForNavigation(), // The promise resolves after navigation has finished
      page.click(readDirectionsSelector) // Clicking the link will indirectly cause a navigation
    ])
    const iframeSelector = "iframe.recipe-source-frame"
    await page.waitFor(iframeSelector)
    originalUrl = await page.$eval(iframeSelector, el => el.getAttribute("src"))
  }
  // link directly to recipe
  else {
    originalUrl = readDirectionsHref
  }

  return (
    originalUrl &&
    originalUrl.replace(
      "?utm_campaign=yummly&utm_medium=yummly&utm_source=yummly",
      ""
    )
  )
}

async function getRecipeImage(page: puppeteer.Page) {
  const recipeImageSelector = ".recipe-image"
  await page.waitForSelector(recipeImageSelector)
  // style gets changed by JS code
  await page.waitFor(1000)
  const style = await page.$eval(recipeImageSelector, el =>
    el.getAttribute("style")
  )
  return (
    style &&
    style
      .replace('background-image: url("', "")
      .replace('");', "")
      .trim()
  )
}

async function scrapeRecipe(page: puppeteer.Page, url: string) {
  await page.goto(url)

  const recipeData: {
    ingredients: object[]
    title: string | null
    image: string | null
    yummlyUrl: string
    recipeUrl?: string | null
  } = {
    ingredients: await getIngredients(page),
    title: await getTitle(page),
    image: await getRecipeImage(page),
    yummlyUrl: url
  }
  recipeData.recipeUrl = await getRecipeUrl(page)
  console.log("recipe image: ", recipeData.image)
  console.log("recipe url: ", recipeData.recipeUrl)

  if (recipeData.title) {
    const filename = `/data/recipes/${recipeData.title
      .toString()
      .replace(/[\s\/]/g, "_")}.json`
    const writeFile = promisify(fs.writeFile)
    await writeFile(filename, JSON.stringify(recipeData), "utf8")
    console.log(`successfully saved ${filename}`)
  }
  return recipeData
}

async function scrapeAllYums(browser: puppeteer.Browser, url: string) {
  const pages = await browser.pages()
  const page = pages[0]

  page.on("console", msg => {
    for (let i = 0; i < msg.args().length; ++i) {
      console.log(`${i}: ${msg.args()[i]}`)
    }
  })

  await page.goto(url)
  const urlsToScrape = await page.$$eval(
    ".RecipeContainer .link-overlay",
    (links: Element[]) => {
      return links.map(link => link.getAttribute("href"))
    }
  )
  console.log(urlsToScrape.length)
  const recipes = []
  for (const yumUrl of urlsToScrape) {
    recipes.push(await scrapeRecipe(page, `http://yummly.com${yumUrl}`))
  }
}

;(async () => {
  try {
    let browser: puppeteer.Browser
    browser = await puppeteer.launch({ headless: false })
    await scrapeAllYums(
      browser,
      "https://www.yummly.com/profile/Joshua24/collections/all-yums"
    )
    browser.close()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
