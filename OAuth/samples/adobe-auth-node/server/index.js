const express = require('express');
const app = express();
const session = require('express-session')
const request = require('request-promise');
const https = require('https');
const adobeApiKey = require('../public/config.js').adobeApiKey;
const adobeApiSecret = require('../public/config.js').adobeApiSecret;
const fs = require('fs');
const path = require('path');

/* Declare host name and port */
const hostname = 'localhost';
const port = 8000;

/* Variables needed for authorization */
const scopes = 'openid,creative_sdk,profile,address,AdobeID,email,offline_access' 
const redirect_uri = 'https://localhost:8000/callback/'

/* Middlewares */
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')
app.use(session({
	/* Change this to your own secret value */
    secret: 'this-is-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 6000000
    }
}));

/* Routes */
app.get('/', function (req, res) {
	res.render('index');
})

app.get('/login', function(req, res){
	/* This will prompt user with the Adobe auth screen */
	res.redirect(`https://ims-na1.adobelogin.com/ims/authorize/v2?client_id=${adobeApiKey}&scope=${scopes}&response_type=code&redirect_uri=${redirect_uri}`)
})

app.get('/callback', function(req, res){
	/* Retrieve authorization code from request */
	let code = req.query.code;
	/* Set options with required paramters */
	let requestOptions = {
        uri: `https://ims-na1.adobelogin.com/ims/token/v3?grant_type=authorization_code&client_id=${adobeApiKey}&client_secret=${adobeApiSecret}&code=${code}`,
        method: 'POST', 
        json: true
	}

	/* Send a POST request using the request library */
	request(requestOptions)
		.then(function (response) {
			/* Store the token in req.session.token */
			req.session.token = response.access_token;
			res.render('index', {'response':'User logged in!'});
    	})
    	.catch(function (error) {
    		res.render('index', {'response':'Log in failed!'});
    	});
})

app.get('/profile', function(req, res){
	if (req.session.token) {
		/* Grab the token stored in req.session 
		and set options with required parameters */
		let requestOptions = {
	        uri: `https://ims-na1.adobelogin.com/ims/userinfo/v2?client_id=${adobeApiKey}`,
	        headers: {
	        	Authorization: `Bearer ${req.session.token}`
	        },
	        json: true
	    };

	    /* Send a GET request using the request library */
		request(requestOptions)
			.then(function (response) {
				/* Send the received response back to the client side */
				res.render('index', {'response':JSON.stringify(response)});
	    	})
	    	.catch(function (error) {
	    		console.log(error)
	    	});

	} else {
		res.render('index', {'response':'You need to log in first'});
	}
})

app.get('/logout', function(req, res){
	if (req.session){
		req.session.destroy(err => {
			if (err){
				res.render('index', {'response': 'Unable to log out'});
			} else{
				res.render('index', {'response': 'Logout successful!'})
			}
		});
	}
})

/* Set up a HTTS server with the signed certification */
var httpsServer = https.createServer({
	key: fs.readFileSync(path.join(__dirname,'./CA/localhost/localhost.decrypted.key')),
	cert: fs.readFileSync(path.join(__dirname, './CA/localhost/localhost.crt'))
}, app).listen(port, hostname, (err) => {
	if (err) console.log(`Error: ${err}`);
	console.log(`listening on port ${port}!`);
});