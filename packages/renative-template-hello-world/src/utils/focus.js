export default () => {
    const spatialScript = document.createElement('script');
    spatialScript.type = 'text/javascript';
    spatialScript.src = 'https://luke-chang.github.io/js-spatial-navigation/spatial_navigation.js';

    const spatialListener = document.createElement('script');
    spatialListener.type = 'text/javascript';
    spatialListener.innerHTML = `window.addEventListener('load', function() {
    SpatialNavigation.init();
    SpatialNavigation.add({
      selector: 'a, .focusable',
      enterTo: 'last-focused'
    });
    SpatialNavigation.add({
      selector: 'a, .focusable-action-btn',
      leaveFor: {
        down: '.focusable-straight',
      }
    });
    SpatialNavigation.add({
      selector: 'a, .focusable-straight',
      straightOnly: true,
      leaveFor: {
        up: '.focusable-action-btn',
      }
    });
    SpatialNavigation.makeFocusable();
    SpatialNavigation.focus();
  });`;
    document.head.appendChild(spatialScript);
    document.head.appendChild(spatialListener);
    const focusedStyle = document.createElement('style');
    focusedStyle.type = 'text/css';
    focusedStyle.appendChild(
        document.createTextNode(`:focus {
    border: 5px solid #04fff3;
    border-radius:5px;
    }
  `),
    );

    document.head.appendChild(focusedStyle);
};
