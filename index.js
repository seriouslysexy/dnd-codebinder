const PORT = process.env.PORT || 5000; // get/set port

const app = require('./src/app'); // get app
require("./src/routes"); // add routes to instance of app

// start server
app.listen(PORT, () => {
	console.log("A DND Codebinder Backend has come online on port " + PORT);
});