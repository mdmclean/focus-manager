const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let message: string = 'Hello World';
console.log(message);


//https://github.com/GoogleCloudPlatform/nodejs-getting-started/tree/fae958d885396dd2414ef9a35ae31f733ab148b2/bookshelf
//https://cloud.google.com/nodejs/getting-started
//https://github.com/expressjs/express/tree/master/examples/auth
