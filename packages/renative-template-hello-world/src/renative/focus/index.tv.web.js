export default (style) => {
    const spatialScript = document.createElement('script');
    spatialScript.type = 'text/javascript';
    spatialScript.src = 'https://luke-chang.github.io/js-spatial-navigation/spatial_navigation.js';

    const spatialListener = document.createElement('script');
    spatialListener.type = 'text/javascript';
    spatialListener.innerHTML = `window.addEventListener('load', function() {
    SpatialNavigation.init();

  });`;
    document.head.appendChild(spatialScript);
    document.head.appendChild(spatialListener);
    const focusedStyle = document.createElement('style');
    focusedStyle.type = 'text/css';
    focusedStyle.appendChild(
        document.createTextNode(`:focus {
          ${'border: 5px solid #FF00FF; border-radius:5px; background-color: #00FFFF'}
    }
  `),
    );

    document.head.appendChild(focusedStyle);
};
