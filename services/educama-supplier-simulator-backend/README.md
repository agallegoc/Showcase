# EventSimulator (Backend)

## Development server

To run it locally, before start the server it is necessary to create the environment variables:
SUPPLIER_SIMULATOR_QUEUE: contains the url to access rabbitMQ (this url contains login and password).
SUPPLIER_SIMULATOR_DATABASE: contains the url to access MongoDB (this url contains login and password).

Run `node server.js` for a dev server. Navigate to `http://localhost:8080/`.

