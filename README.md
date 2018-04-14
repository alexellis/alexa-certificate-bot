# Check SSL certs with Alexa and OpenFaaS

This project contains everything you need to build and Alexa skill to check your SSL certificates.

You can ask Alexa questions like:

> Alexa ask Certificate Bot to check my blog

Example response:

> Alexa: the URL blog.alexellis.io will expire in 2 months

## Setup

* Deploy OpenFaaS and add a TLS-enabled proxy server like Nginx or Caddy

Alternatively use a temporary proxy like Ngrok which offers a quick way to get TLS for 7 hours

* Pull in the `node8-express` template:

https://github.com/openfaas-incubator/node8-express-template

* Deploy the certificate check function via the OpenFaaS store

This is used to do the checking of the cert

* Set up your Alexa skill using the Skills Kit Developer Console

https://developer.amazon.com/alexa/console/ask?

* Define your skill

Name it "certificate bot"

Give the invocation name "certificate bot"

Add a "slot type" of "website" and enter some test websites

Create an intent of "checkcert" type and make it take the "website" custom slot

```
check {site}
```

Alternatively use the JSON model.
