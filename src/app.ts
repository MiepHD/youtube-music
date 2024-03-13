// utility
var console = {
  log: function () {
    var ipc = require('electron').ipcRenderer;
    var args = ['console'].concat([].slice.call(arguments));
    return ipc.sendSync.apply(ipc, args)[0];
  },
};
var quit = function () {
  var ipc = require('electron').ipcRenderer;
  return ipc.sendSync('app', 'quit')[0];
};

// server handler
window.addEventListener(
  'load',
  function () {
    var ipc = require('electron').ipcRenderer;
    ipc.on('request', function (event, req, port) {
      ipc.send(
        port,
        200,
        { 'content-type': 'text/html;charset=UTF-8' },
        doc.documentElement.outerHTML,
      );
    });
  },
  false,
);
