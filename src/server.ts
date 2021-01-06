import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

    // endpoint to filter an image from a public url.
  app.get('/filteredimage', async ( req, res ) => {
    try{
      //Get image_url query param
      const image_url = req.query.image_url;

      // check image URL is valid
      if (!image_url) {
        return res.status(400).send({ message: 'image_url is required' });
      }

      //Filter Image from the URL using util method
      await filterImageFromURL(image_url)
        .then((outputImage) => {
          //Send filtered image as the response
          res.status(200).sendFile(outputImage, {}, (err) => {
            //After the image is sent, the file is removed from the server
            var values: Array<string> = [outputImage];
            deleteLocalFiles(values);
          })
        })
    } catch (e) {
      return res.status(422).send({ message: 'There was an error: ' + e.getMessage() });
    }
});
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();