const fs = require('fs');
const request = require('request');
const readline = require('readline');
// It should take two command line arguments:

// a URL
// a local file path
// It should download the resource at the URL to the local path on your machine. Upon completion, it should print out a message like Downloaded and saved 1235 bytes to ./index.html.
// node fetcher.js http://www.example.edu/ ./index.html
// Downloaded and saved 3261 bytes to ./index.html
// NOTE: good to know, 1 character is equal to 1 byte.

// Validate arguments given from command line.
if (process.argv.length !== 4) {
  console.log('Please input a valid website followed by a valid path.');
  process.exit();
}

const requestURL = process.argv[2];
const filePath = process.argv[3];

// Write to file path.
const writeFile = (body) => {
  fs.writeFile(filePath, body, 'utf-8', (err) => {
    if (err) {
      console.log('Error occurred while writing to file');
      console.error(err);
      process.exit();
    }

    console.log(`Downloaded and saved ${body.length} bytes to ${filePath}`);
    process.exit();
  });
};

request(requestURL, (error, response, body) => {
  // Exit if error occurred with request-response.
  if (error || response.statusCode > 400) {
    console.log(`Error occurred while requesting url with status code: ${response.statusCode}...`);
    console.error(error);
    process.exit();
  }

  // Check if object already exists at filepath.
  fs.access(filePath, fs.constants.F_OK, (err) => {
    // If error then it does not exist.
    if (err) {
      writeFile(body);
      return;
    }
    // Prompt if user wants to overwrite.
    let rl = readline.createInterface(process.stdin, process.stdout);

    rl.question('File already exists, overwrite? (Y) ', (cmd) => {
      if (cmd !== 'Y') {
        console.log('Exiting...');
        process.exit();
      }
      writeFile(body);
      rl.close();
    });
  });
});

