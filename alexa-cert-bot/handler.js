"use strict"

const fs = require('fs');
const contentType = "application/json; charset=utf-8";
const request = require('request');
const moment = require('moment');

const siteURLMap = {
    "my blog": "blog.alexellis.io",
    "blog": "blog.alexellis.io",
    "homepage": "www.alexellis.io",    
    "openfaas": "www.openfaas.io",
    "project": "www.openfaas.io",
    "the project": "www.openfaas.io",
    "docker blog": "blog.docker.com",
    "amazon": "www.amazon.com"
};

module.exports = (event, context) => {

    if(event.body.request.type == "LaunchRequest") {
        return launchRequest(context);
    }

    fs.readFile("./function/response.json", "utf8", (err, val) => {
        if(err) {
            return context.fail(err);
        }
    
        if(event.body.request.intent && event.body.request.intent.name == "checkcert"
            && event.body.request.intent.slots 
            && event.body.request.intent.slots.site
            && event.body.request.intent.slots.site.value
            && siteURLMap[event.body.request.intent.slots.site.value]) {

                let url = siteURLMap[event.body.request.intent.slots.site.value];

                if(!url.length) {                    
                    const response = JSON.parse(val);
                    response.response.outputSpeech.text = "I'm sorry I don't have a URL for that site";        
                    return context
                        .status(200)
                        .headers({"Content-Type": contentType})
                        .succeed(response);
                }
            
                const req = {
                    uri: process.env.gateway_url + "function/certinfo?output=json",
                    body: url,
                };

                request.post(req, (err, res, body) => {

                    const response = JSON.parse(val);
                    if(err) {
                        response.response.outputSpeech.text = "Had an error fetching the cert. " + err;
                        return context
                        .status(200)
                        .headers({"Content-Type": contentType})
                        .succeed(response);
                    }

                    const certRes = JSON.parse(body);
                    const notAfter = moment(certRes.NotAfter).fromNow();

                    response.response.outputSpeech.text = "The URL " + url + " expires " + notAfter;                    
                    return context
                        .status(200)
                        .headers({"Content-Type": contentType})
                        .succeed(response);
                });
            } else {

                const response = JSON.parse(val);
                response.response.outputSpeech.text = "I could not recognise that site";        
                context
                    .status(200)
                    .headers({"Content-Type": contentType})
                    .succeed(response);
            }
    });
}

let launchRequest = (context) => {
    fs.readFile("./function/response.json", "utf8", (err, val) => {
        if(err) {
            return context.fail(err);
        }
    
        const response = JSON.parse(val);
        response.response.outputSpeech.text = "Which site should I check? You can say check OpenFaaS or check my blog";
        response.response.shouldEndSession = false;

        context
            .status(200)
            .headers({"Content-Type": contentType})
            .succeed(response);
    });
};
