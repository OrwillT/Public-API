/**
 * Proxy Github API request and add addition headers if you can't.
 * @param {Request} request 
 * @param {String} prefix 
 */

export async function githubApiHandler(request, prefix) {
    const url = new URL(request.url)
    const apiUrl = 'https://api.github.com' + url.pathname.replace(prefix,'')
    const basicHeaders = {
        'User-Agent': 'cloudflare',
        'Accept': 'application/vnd.github.v3+json'
    }

    const { headers } = request
    const contentType = headers.get('content-type')
    const contentTypeUsed = !(!contentType)

    if (contentTypeUsed) {
        if (contentType.includes('application/json')) {
            var body = await request.json()

            if ('additionHeaders' in body) {
                var additionHeaders = body.additionHeaders
                delete body.additionHeaders
            }

        } else {
            let errorResponse = {'error': 'content-type must be application/json'}
            return new Response(errorResponse, {status: 403, headers: {'Content-Type': 'application/json; charset=utf-8'}})
        }

        let apiRequest = new Object
        apiRequest.headers = Object.assign(basicHeaders, additionHeaders)
        apiRequest.body = JSON.stringify(body)

        const newRequest = new Request(apiUrl, new Request(request, apiRequest))

        try {
            let response = await fetch(newRequest)
            return response
        } catch (e) {
            return new Response(JSON.stringify({error: e.message}), {status: 500})
        }

    } else {
        let apiRequest = new Object
        apiRequest.headers = basicHeaders
        const newRequest = new Request(apiUrl, new Request(request, apiRequest))
        let response = await fetch(newRequest)
        return response
    }
}
