# Description
Substrate Scanner is a tool to explore block events on substrate-based chains.

It consists of a frontend component that runs in the browser and a backend server that password protects the tool. Check the [demo](https://subscanner.onrender.com/) here using `admin` for the username and `password` for the password.

Features include
- Accessible components
- Sort events by block #, section, or method
- Filtering of events by method
- Pagination of results
- Validations for all fields
- JSON viewer for some data w/ copy functionality
- Efficient querying of blockchain via async parallel
- Mobile friendly interface

# Getting started
The project is built using `create-react-app` and packages are managed via `yarn`. You can clone the repo and install dependencies:
```
yarn install
```
Then start the local development server:
```
yarn start
```
Woot! 🚀 You can visit `localhost:3000` to play with the application. Updates during development are hot reloaded via webpack.

# Deploying
The [website](https://subscanner.onrender.com/) is configured in `Render` to deploy automatically from Github when the `main` branch is updated.

If you want to locally build the app for production usage, you can run:
```
yarn build
```
The corresponding files will be in the `build` directory. To start the backend server for password protection, you can run:
```
yarn build-backend
```
Then start the node server:
```
yarn start-backend
```
Congrats! Your production ready app is being served on `localhost:4000`

# Future Improvements
## UX
- Robust search so you can search through any field
- Easily fetch latest block number. Currently, the app initially fetches it when a user updates the URL, but they may want to re-fetch the latest.
- Copy account numbers to clipboard
- Make form fields sticky even after you close the browser
- Be able to close the tab and come back with all data still visible
- Autosuggest common URLs that people use
- Better null state for filters
- Favicons and logo work better at different resolutions
- Some validations could be more real-time rather than `onSubmit`
- Help text for the user to explain how to use the app
- Minor scrolling issue for filters when table is too large
- Show histogram counts for each filter
## Scale
- Potentially cache data so we won't need to requery old information
- Currently, the app may not be able to handle very large amounts of data. Fundamental architecture changes could happen where we store more data on the server and query that. Another option is to store data locally on the client rather than in memory (e.g. using PouchDB).
- Optimize max number of API requests the app sends off using async. Currently, set to 50.

## Dev
- Potentially write code in a more functional style
- Add comprehensive unit tests and integration tests
- Add test runs per PR in Github
- Clean up API connections more elegantly if they fail
- Cleanup validations on forms so they're more structured (e.g. use Yup or immutable arrays)
- Stronger typing. Really think through the types that we're using and clean up how their definitions are scattered throughout.
- Create a better dev environment for server. Currently, it consists of a manual build process with no automatic re-compile.
- Linting test prior to automatic deploy
- Clean up dependency warnings when installing packages.
- Make app more robust by handling errors better
- If other people run into errors, log them to a central service.