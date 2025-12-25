const cors_proxy = require("cors-anywhere");
require("dotenv").config({ path: __dirname + "/.env" });

const host = "0.0.0.0"; // Listen on all network interfaces
const port = 8080; // Choose a port for the server

// Custom check function for Authorization header
const isValidAuth = (req) => {
  // Check if the Authorization header exists and matches the expected token
  const authHeader = req.headers["authorization"];
  return authHeader && authHeader === `${process.env.SECRET_TOKEN}`;
};

cors_proxy
  .createServer({
    originWhitelist: [], // You can restrict this to specific domains if needed
    requireHeader: ["origin", "x-requested-with"], // Ensure specific headers are present
    removeHeaders: ["cookie", "cookie2"], // Remove sensitive headers like cookies
    handleInitialRequest: (req, res) => {
      // Check for valid Authorization header before allowing the proxy request
      if (!isValidAuth(req)) {
        // If the token is invalid, send a 401 Unauthorized response
        res.statusCode = 401;
        res.end("Unauthorized");
        return true; // Prevent further processing of the request
      }
      return false; // Allow the request to continue if the token is valid
    },
  })
  .listen(port, host, () => {
    console.log(`CORS Anywhere is running on ${host}:${port}`);
  });
