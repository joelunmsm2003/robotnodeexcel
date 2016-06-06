var firebase = require('firebase');
var http = require('http');

firebase.initializeApp({
  serviceAccount: "/home/andiu/Escritorio/monitoreo.json",
  databaseURL: "https://monitoreo.firebaseio.com"
});

// The app only has access as defined in the Security Rules
var db = firebase.database();

var ref = db.ref("/gamarra/codigo");

id=2

function addregister(id,talla,color,modelo,ubicacion,precio,estado,fingreso){

	var refmodelo = ref.child(id);

	refmodelo.set({

	  id:id,
	  talla:talla,
	  color:color,
	  modelo:modelo,
	  precio:precio,
	  ubicacion:ubicacion,
	  fingreso:fingreso,
	  estado:estado,
	  excel:'0'

	})

}


ref.once("value", function(snapshot) {
  //console.log(snapshot.val());
});

var currentTime = new Date();


   http.get('http://localhost:8000/nuevos/', function(res){

        var str = '';

        res.on('data', function (chunk) {
              //console.log('BODY: ' + chunk);
               str += chunk;
         });

        res.on('end', function () {

            object = JSON.parse(str)

            for( var key in object ) {
 				
 				console.log(object[key])
 				addregister(object[key][0],object[key][2],object[key][3],object[key][1],object[key][4],object[key][5],object[key][6],currentTime)
 		     
 				http.get('http://localhost:8000/enventa/'+object[key][0]+'/', function(res){})

 		     }

        });

  });


    	// Retrieve new posts as they are added to our database

ref.on("child_added", function(snapshot, prevChildKey) {
  var newPost = snapshot.val();


  if(newPost['estado']=='Vendido'){

  	console.log('Vendido',newPost['id'],newPost['excel'])

  	if(newPost['excel']=='0'){

  	http.get('http://localhost:8000/vendido/'+newPost['id']+'/', function(res){})

  	}

  }

});




            
