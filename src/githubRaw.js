/**
 * Browse contents from Github repository directly.
 * @param {Request} request 
 * @param {String} prefix 
 */

export async function githubRawHandler(request, prefix) {
    const url = new URL(request.url)
    const apiUrl = 'https://raw.githubusercontent.com' + url.pathname.replace(prefix,'')
    const levelCount = (apiUrl.split('/')).length - 1

    if (levelCount < 6) {
        let jsonResponse = {'usage':'/{owner}/{repos}/{branch}/{path}'}
        return new Response(JSON.stringify(jsonResponse), {status: 200, headers: {"Content-Type": "application/json; charset=utf-8"}})  
    } else {
        const response = await fetch(apiUrl)
    }

    let apiHeaders = new Headers(response.headers)
    apiHeaders.set('Access-Control-Allow-Origin', '*')

    let ext = apiUrl.split('.').pop().toLowerCase();
    let contentType = new String
    switch (ext) {
        case "svg":
            contentType = "image/svg+xml";
            break;
        case "js":
            contentType = "application/javascript";
            break;
        case "css":
            contentType = "text/css";
            break;
    }
    if (contentType) {
        apiHeaders.set("Content-Type", contentType)
    }
    return new Response(response.body, {status: response.status,headers:apiHeaders})
}