// import { createMemoryHistory } from 'history';

/*const history = createMemoryHistory({
    basename: '', // The base URL of the app (see below)
    initialEntries: ['/'], // The initial URLs in the history stack
    initialIndex: 0, // The starting index in the history stack
    keyLength: 6, // The length of location.key
    // A function to use to confirm navigation with the user. Required
    // if you return string prompts from transition hooks (see below)
    getUserConfirmation: null
});


// Get the current location.
const location = history.location;

// test


// Listen for changes to the current location.
const unlisten = history.listen((location, action) => {
    // location is an object like window.location
    console.log(action, location.pathname, location.state);
});

// Use push, replace, and go to navigate around.
history.push('/home', { some: 'state' });

// To stop listening, call the function returned from listen().
unlisten();*/

export { default as History } from 'history';
