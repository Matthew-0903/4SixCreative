const fetch = require('node-fetch');
fetch('https://www.thedonmgmt.com/')
  .then(res => res.text())
  .then(text => {
    const matches = text.match(/alt="([^"]+)"/g);
    console.log(matches);
  });
