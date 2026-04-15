const https = require('https');
https.get('https://www.thedonmgmt.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const matches = data.match(/alt="([^"]+)"/g);
    console.log(matches);
  });
});
