const http = require('http');
const fs = require('fs');
const json = require('./data.json');
var file;


const server = http.createServer(function(req, res){
	let file

	try{
		file = fs.readFileSync('./index.html');
	}
	catch(e){
		res.writeHead(404, {'content-type': 'text/plain'});
		res.write('404 File Not Found!');
		res.end();
		return;
	}

	if(file){
		res.writeHead(200, {'content-type': 'text/html'});
		res.write(file);
		res.end();
	}

	req.on('data', (data)=>{
		// console.log(decodeURIComponent(data));
  	var arr = decodeURIComponent(data).replace(/\+/g, ' ').replace('UserName=', '')
			.replace('Email=', '').replace('message=', '').split('&');
	  // console.log(arr);
    var addUser = (uname,email,msg) => {
  		var users=[];
  		var user = {
  	    uname,
  	    email,
  	    msg
  	  };
  		try {
  		  var userString = fs.readFileSync('data.json');
      	users = JSON.parse(userString);
  		} catch (e) {
				
  	  }
  		var duplicateUsers = users.filter((user) => (user.uname === arr[0] && user.email === arr[1]));
  		if(duplicateUsers.length === 0){
  		users.push(user);
  	  fs.writeFileSync('data.json', JSON.stringify(users));
  	  return user;
  		}
  	};
  	var details = addUser(arr[0], arr[1], arr[2]);
    if (details) {
      console.log('User Info created');
  		console.log('--');
  	  console.log(`uname: ${arr[0]}`);
  	  console.log(`email: ${arr[1]}`);
  		console.log(`msg: ${arr[2]}`);
    } else {
      console.log('User name taken');
    }

	});

}).listen(8080, ()=>{console.log('Server running on 8080');});
