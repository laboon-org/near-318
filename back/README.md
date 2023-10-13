# NEAR-318: Backend

- Simple Api by: Cloud Functions w/ Cloudflare Workers

## Prerequisites


```sh
    node v16.18.1
    npm v8.19.2
```

## Getting Start

Step 0: Pre-Config
-------------------------------
PRIVATE_KEY: Define Soon!

Step 1: Install dependencies
-------------------------------

Install all required dependencies by running:

    yarn

Step 2: Install the Workers CLI
-------------------------------

To install wrangler, ensure you have npm installed. Then run:

    yarn global add wrangler

Step 3: Authenticate Wrangler
-------------------------------

To authenticate Wrangler, run wrangler login:

    wrangler login

You will be directed to a web page asking you to log in to the Cloudflare dashboard.\
After you have logged in, you will be asked if Wrangler can make changes to your Cloudflare account.\
Scroll down and select Allow to continue.

Primary Account: letronghiep1985@gmail.com

Step 4: Run a local development
-------------------------------
To start a development server, run:

    wrangler dev --local

Then run:

    curl "http://127.0.0.1:8787/cdn-cgi/mf/scheduled"

Webview:
    curl "http://192.168.68.147:8787"

to trigger the scheduled event.\
Go back to the console to see what your worker has logged.\
Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)

Step 5: Deployment
-------------------------

To deploy worker, run:

    wrangler deploy

You can preview your Worker at <YOUR_WORKER>.<YOUR_SUBDOMAIN>.workers.dev.

## Environment

### Testnet

Admin:

    https://dash.cloudflare.com/235547dc36388aaba89a83cf4149e8b7/workers/subdomain

Link-API:
    https://test-v1.near-318.workers.dev/

Cron Testing

    curl "http://localhost:8787/__scheduled?cron=0+1+2+3+4"