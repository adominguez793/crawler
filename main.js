const { crawlPage } = require('./crawl.js')
const { printReport, sortPages } = require('./report.js')

async function main() {
    if (process.argv.length > 3) {
        console.log('No website detected')
    } else if (process.argv.length < 3) {
        console.log('No website detected')
    } 
    
    const baseURL = process.argv[2]
    
    console.log(`Crawler is starting at: ${baseURL}`)

    
    const pages = await crawlPage(baseURL, baseURL, {})
    printReport(pages)
}

main()