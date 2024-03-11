require("dotenv").config();
const { MongoClient,ObjectId } = require("mongodb");

function conectar(){
    return MongoClient.connect(process.env.URL_MONGO);
    /*.then(async conexion => {
        let coleccion = conexion.db("colores").collection("colores");
        conexion.close();
    });*/
}

function getColores(){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let colores = await coleccion.find({}).toArray(); //se coloca el await ya que tiene que esperar a que busques a todos para que coloque los colores en un array

            conexion.close(); //cortamos y respondemos

            ok(colores); //cumplir la promesa
        }catch(error){//si falla al conectar se mostrara ese error.
            ko({ error : "error en base de datos"})  //si ha habido un error le pasas un objeto con el error.
        }
    });
}
//recibe un objeto color que dentro tienes (r,g,b)
function crearColor(color){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let {insertedId} = await coleccion.insertOne(color); //esperamos a inserta el color. Color ya apunta a un obejtos. El inserted lo ponemos con llaves para desestructurarlo

            conexion.close(); //cortamos y respondemos

            ok({id : insertedId}); //cumplir la promesa se mostrar el id ese el de insertID
        }catch(error){//si falla al conectar se mostrara ese error.
            ko({ error : "error en base de datos"})  //si ha habido un error le pasas un objeto con el error.
        }
    });
}

function borrarColor(id){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let {deletedCount} = await coleccion.deleteOne({_id : new ObjectId (id)}); //esperamos a le damos el idea y crea un nuevo objeto con el id

            conexion.close(); //cortamos y respondemos

            ok(deletedCount); //cumplir la promesa se mostrar el id ese el de insertID
        }catch(error){//si falla al conectar se mostrara ese error.
            ko({ error : "error en base de datos"})  //si ha habido un error le pasas un objeto con el error.
        }
    });
}

module.exports = {getColores,crearColor,borrarColor};
/*
COMPROBACION DE QUE EL SERVIDOR SE CONECTA A LA BASE DE DATOS
conectar()
.then(conexion => {
    console.log("..conectado")
})
.catch(error => { //es el fallo cuando no se ha podido conectar 
    console.log("algo fallo")
})


//COMPROBACION DE QUE LA FUNCION COLORES RETORNA LOS DATOS DE LA DB
getColores()
.then(colores => console.log(colores))
.catch(colores => console.log(colores)) //que ahi te mostrara el objeto error


COMPROBACION DE LA FUNCION DE CREAR EL COLORES
creaColor({r:23,g:54,b:23})
.then(algo => console.log(algo));

COMPROBAR PARA BORRAR
borrarColor('65eef253f6ddac0fd5fae867')
.then(algo => console.log(algo));
*/
