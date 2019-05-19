const express = require( "express" ),
      http = require( "http" ),
      path = require( "path" );

const app = express(),
      server = http.Server( app );

const port = process.env.PORT || 3000;

app.use( express.static( __dirname + "/public" ));

const routes = {
  "/": "index.html"
};

//  Routing
app.get( /^\//, function( req, res ) {
  if( routes.hasOwnProperty( req.originalUrl ) ) {
    res.sendFile( path.join( __dirname, routes[ req.originalUrl ] ) );
  } else {
    res.status( 404 ).send( "Sorry, I didn't find the page you were looking for :(" );
  }
});

// Start the server.
server.listen( port, function() {
  console.log( "Starting server on port: " + port );
});
