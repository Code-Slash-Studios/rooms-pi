// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  fetchData: async (url) => {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return { error: 'Failed to fetch data' };
    }
  }
});
