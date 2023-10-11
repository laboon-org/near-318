# NEAR-318: Backend

- Simple Api by: Cloud Functions w/ Cloudflare Workers

## Prerequisites


```sh
    node v16.18.1
    npm v8.19.2
```

## Getting Start

Step 1: Install dependencies
-------------------------------

Install all required dependencies by running:

    npm install

Step 2: Install the Workers CLI
-------------------------------

To install wrangler, ensure you have npm installed. Then run:

    npm install -g wrangler

or install with yarn:

    yarn global add wrangler

Step 3: Authenticate Wrangler
-------------------------------

To authenticate Wrangler, run wrangler login:

    wrangler login

You will be directed to a web page asking you to log in to the Cloudflare dashboard.\
After you have logged in, you will be asked if Wrangler can make changes to your Cloudflare account.\
Scroll down and select Allow to continue.

Step 4: Run a local development server
-------------------------------
To start a development server, run:

    wrangler dev --local

Then run:

    curl "http://localhost:8787/cdn-cgi/mf/scheduled"

to trigger the scheduled event.\
Go back to the console to see what your worker has logged.\
Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)

Step 5: Publish project
-------------------------

To publish worker, run:

    wrangler publish

You can preview your Worker at <YOUR_WORKER>.<YOUR_SUBDOMAIN>.workers.dev.