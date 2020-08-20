This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Design decisions

I have used the Flickr `photos.search` API for the assignment, since it allows to search for public photos by tag names (documentation: https://www.flickr.com/services/api/flickr.photos.search.html). I think it's more efficient than fetching the photos first and then building a search on the client side. Since the photos are displayed in 4 column rows, I am fetching them in medium size (640px on the longest side). 50 per page, or one data call.

### Data Fetching

I am fetching the data with an asynchronous function using `axios` since it automatically handles the Json data transformation. I have never used `axios` before and took the chance to try it out. The data received is paginated and fetched one page at a time. The fetch function is called in the useEffect hook only when the search value or data page number changes to prevent unnecessary rerenders. I am using `axios CancelToken` to cancel data calls that are already in progress while the user is still typing the query, so when the user stops, only one data call is made.

An on scroll handler is checking if the user scrolled to the bottom of the page and if so, the current page number is increased by one what triggers a new data call. I am using `debounce` from `lodash` to make the scroll check every half a second. Then the newly fetched results are appended after already existing ones and the user can keep on scrolling till there are no more results available for the current search.

### Layout

The search results are displayed using `flexBox` and are completely responsive. The boxes holding the images have fixed width and height to make sure the layout does not break if some images are not fetched. They have a 1px border to make it a bit more neat since the image size is different. The images are scaled down preserving the aspect ratio, to make sure they are not stretched.

### Improvements

To improve the component I would make the data url and inner data paths into props, so the component could be reusable. The API gives an `and/or` possibility to combine search tags. I would add this option as a checkbox.
