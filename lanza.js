var firebase = require('firebase');
var http = require('http');

firebase.initializeApp({
  serviceAccount: "/var/www/monitoreo.json",
  databaseURL: "https://monitoreo.firebaseio.com"
});

// The app only has access as defined in the Security Rules
var db = firebase.database();

var ref = db.ref("/gamarra/codigo");
var modelos = db.ref("/gamarra/modelos");

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
	  excel:'0',
    venta:true

	})

}


ref.once("value", function(snapshot) {
  //console.log(snapshot.val());
});

var currentTime = new Date();


      var agregarmodelo =function(model){

        console.log('Agregando modelo....')

        con = 0

        ref.orderByChild("modelo").equalTo(model).on("child_added", function(f) {

        con = con+1

       });



       setTimeout(function(){ 

      console.log(con)
      
      if (con == 1){

          var refmodelo = modelos.child(model);
       

          refmodelo.set({

              modelo:model
             
           
          })

      }
      else{

        console.log('Modelo existente...')
      }

      }, 5000);



       }


   http.get('http://192.241.255.109:1000/nuevos/', function(res){

        var str = '';

        res.on('data', function (chunk) {
              //console.log('BODY: ' + chunk);
               str += chunk;
         });

        res.on('end', function () {

            object = JSON.parse(str)

            for( var key in object ) {
 				
 				console.log(object[key])
        agregarmodelo(object[key][1])
 				addregister(object[key][0],object[key][2],object[key][3],object[key][1],object[key][4],object[key][5],object[key][6],currentTime)
        
 				http.get('http://192.241.255.109:1000/enventa/'+object[key][0]+'/', function(res){})

 		     }

        });

  });


    	// Retrieve new posts as they are added to our database

ref.on("child_added", function(snapshot, prevChildKey) {
  var newPost = snapshot.val();


  if(newPost['estado']=='Vendido'){

  	console.log('Vendido',newPost['id'],newPost['excel'])

  	if(newPost['excel']=='0'){

  	http.get('http://192.241.255.109:1000/vendido/'+newPost['id']+'/', function(res){})

  	}

  }

});




            
