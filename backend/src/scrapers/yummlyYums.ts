import fs from "fs"
import puppeteer from "puppeteer"
import { promisify } from "util"

async function scrapeRecipe(page: puppeteer.Page, url: string) {
  await page.goto(url)

  const title = await page.$eval(
    ".recipe .recipe-details h1",
    el => el.textContent && el.textContent.trim()
  )
  await page.waitForSelector(".recipe .IngredientLine .ingredient")
  const ingredients = await page.$$eval(".IngredientLine", nodes =>
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
        data.ingredient = ingredient.textContent && ingredient.textContent.trim()
      }
      if (comment) {
        data.comment = comment.textContent && comment.textContent.trim()
      }
      return data
    })
  )

  const readDirectionsSelector = ".recipe .recipe-show-full-directions"
  await page.waitForSelector(readDirectionsSelector)
  const readDirectionsHref = await page.$eval(".recipe .recipe-show-full-directions", el =>
    el.getAttribute("href")
  )

  let originalUrl

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

  const strippedUrl =
    originalUrl &&
    originalUrl.replace("?utm_campaign=yummly&utm_medium=yummly&utm_source=yummly", "")

  const recipeData = {
    ingredients,
    title,
    recipeUrl: strippedUrl,
    yummlyUrl: url
  }

  if (recipeData.title) {
    const filename = `/data/recipes/${recipeData.title.toString().replace(/[\s\/]/g, "_")}.json`
    const writeFile = promisify(fs.writeFile)
    await writeFile(filename, JSON.stringify(recipeData), "utf8")
    console.log(`successfully saved ${filename}`)
  }
  return recipeData
}

async function scrapeAllYums(browser: puppeteer.Browser, url: string) {
  const pages = await browser.pages()
  const browserPage = pages[0]

  browserPage.on("console", msg => {
    for (let i = 0; i < msg.args().length; ++i) {
      console.log(`${i}: ${msg.args()[i]}`)
    }
  })

  await browserPage.goto(url)

  const urlsToScrape = await browserPage.$$eval(
    ".RecipeContainer .link-overlay",
    (links: Element[]) => {
      return links.map(link => link.getAttribute("href"))
    }
  )
  const recipes = []
  const scrapeUrls = urlsToScrape.slice(26)
  for (const yumUrl of scrapeUrls) {
    recipes.push(await scrapeRecipe(browserPage, `http://yummly.com${yumUrl}`))
  }
}

;(async () => {
  try {
    let browser: puppeteer.Browser
    browser = await puppeteer.launch({ headless: false })
    await scrapeAllYums(browser, "https://www.yummly.com/profile/Joshua24/collections/all-yums")
    browser.close()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
