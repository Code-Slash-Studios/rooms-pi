The purpose of this repository is to run the Raspberry Pi application side of CIS Rooms. 

There is an API backend that must be connected to this application so that the database, web application, and Raspberry Pi communication can flow.

You need Node.js. Use this website for download: https://nodejs.org/en/download.

After cloning the Pi code to your Pi, run "npm install" in the /src directory.

To run the program, use "npm start" in the /src directory.

To export the app, use "npm run make" in the /src directory.

Then, on Linux, run "sudo dpkg -i cis-rooms_1.0.0_amd64.deb" to be able to run the cis-rooms application.

The following files are files of interest with descriptions attached:

index.js
   contains startup tests of resources, makes functions for all assets needed to test before displaying their resources.

   Logic here then decides whether to take the screen to the index page, where reservation data is retrieved, or to an error page
   where debugging data is displayed, such as which asset it is unable to reach, and the IP of Pi

renderer.js
   Logic for retrieving data from an asset on an interval
   This data will be displayed on index.html
