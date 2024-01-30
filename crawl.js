const { JSDOM } = require('jsdom');


async function crawlPage(baseURL, currentURL, pages) {
    const currentUrlObj = new URL(currentURL)
    const baseUrlObj = new URL(baseURL)
    if (baseUrlObj.hostname !== currentUrlObj.hostname) {
        return pages
    }

    const normalizedURL = normalizeURL(currentURL)

    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++
        return pages
    }

    if (currentURL === baseURL) {
        pages[normalizedURL] = 0
    } else {
        pages[normalizedURL] = 1
    }

    console.log(`Crawling...: ${currentURL}`)
    let htmlBody = ''

    try {
        const response = await fetch(currentURL)
        if (response.status >= 400) {
            console.log(`Status exceeds or equals 400. Status is: ${response.status}`)
            return pages
        }
        const responseHeaders = response.headers.get('content-type')
        if (!responseHeaders.includes('text/html')) {
            throw new Error(`Content type not text/html: ${responseHeaders}`)
            return pages 
        }
        htmlBody = await response.text()
    } catch (err) {
        console.log(err.message)
    }
    
    const urls = getURLsFromHTML(htmlBody, baseURL)
    for (let url of urls) {
        pages = await crawlPage(baseURL, url, pages)
    }
    return pages
}


function normalizeURL(url) {
    const urlObj = new URL(url)
    let hostname = urlObj.hostname
    let pathname = urlObj.pathname
    let normalUrl = `${hostname}${pathname}`
    
    if (normalUrl[normalUrl.length - 1] === '/') {
        normalUrl = normalUrl.slice(0, -1)
        return `${normalUrl}`
    } else {
        return `${normalUrl}`
    }
}


function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const aElements = dom.window.document.querySelectorAll('a')
    for (const aElement of aElements) {
        if (aElement.href.slice(0,1) === '/'){
            try {
                urls.push(new URL(aElement.href, baseURL).href)
            } catch (err){
                console.log(`${err.message}: ${aElement.href}`)
            }
        } else {
            try {
                urls.push(new URL(aElement.href).href)
            } catch (err){
                console.log(`${err.message}: ${aElement.href}`)
            }
        }
    }
    return urls
}


module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}





