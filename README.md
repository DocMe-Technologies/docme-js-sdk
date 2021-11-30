# docme-sdk

> This SDK implementation requires you to enter your API key to connect to DocMe servers, for more information [click here](https://docme-ai.atlassian.net/wiki/spaces/DA/pages/81592321/API+Key).

## Install

Install using NPM or Yarn

```bash
# NPM
$ npm install docme-sdk

# Yarn
$ yarn add docme-sdk
```

## Usage

#### Node.js

Measure from a video saved in the system

```js
const fs = require('fs');
const getDocMe = require('docme-sdk');

// get version 1
const DocMe = getDocMe(1);

const docMeInstance = new DocMe('<your-api-token-here>');

const video = fs.readFileSync('/path/to/video.mp4');

// option 1
docMeInstance
  .measureFromVideo(video)
  .then(measurement => measurement.getDetails())
  .then(details => console.log(details))
  .catch(e => console.error(e));

// option 2
docMeInstance
  .measureFromVideo(video, true)
  .then(measurement => console.log(measurement.details))
  .catch(e => console.error(e));
```

#### Browser

Measure from webcam

```js
import getDocMe from 'docme-sdk';

// get version 1
const DocMe = getDocMe(1);

const docMeInstance = new DocMe('<your-api-token-here>');

// get webcam
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then(stream => {
    // this will record the stream and then return the completed measurement
    return docMeInstance.measureFromMediaStream(stream, true);
  })
  .then(measurement => console.log(measurement.details))
  .catch(e => console.error(e));
```
