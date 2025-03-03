const { contextBridge, ipcRenderer } = require('electron');

// Expose the ipcRenderer to the renderer process
contextBridge.exposeInMainWorld('api', {
  fetchData: async (url) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return { error: 'Failed to fetch data' };
    }
  },
  // Expose method for listening to events from the main process
  listenForResults: (callback) => {
    ipcRenderer.on('setLoadingResults', (event, data) => {
      callback(data);
    });
  }
});
