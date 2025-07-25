# Installation

1. Clone this repo to a directory of your choice.
2. In the repo directory install dependencies using NPM:

   `npm install`

## Run the server

After installation is complete, the server can be started using the following command:

`npm run dev`

## Run the tests

After installation is complete, the test suite can with the following command:

`npm test`

## Notes

The data for the chart & table loads asynchronously. This is to prevent a long page load for the user while the data is fetched.

I have tried to keep dependencies on the NextJS framework separate from components, for testability & potential future re-use. This is why the URL pathname & search params are passed as parameters.

NextJS was chosen as a recommended framework for a new React project, as well as aligning with existing usage.

Issues were encountered unit test the chart create in Recharts. With more time a workaround would be found.

No E2E/integration tests are present due to time constraints.

Error handling for the case of the data not being available is also not present due to time constraints.