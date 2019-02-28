# festival-flyers

## Summary

This is a web scraper that scans thatdrop.com for festival information and stores them in a MongoDB collection. Users can comment on each festival flyer anonymously.

## Installation

1. `git clone`
2. Run `npm install` in project directory
3. Install and run MongoDB Community Server via homebrew or other installation method
  - Mac: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
  - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
4. Once installed, run `mongod` to start mongo locally
5. Run `node server` in project directory to start the server
6. Go to `localhost:3000` in browser to view site locally

## Technologies

- Axios
- Cheerio
- MongoDB
- Mongoose
- Express
- Express Handlebars
