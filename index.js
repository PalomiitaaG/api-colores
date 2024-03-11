require("dotenv").config();
const { json } = require("body-parser");
const {getColores,crearColor,borrarColor} = require("./db_mongo");
const cors = require("cors");
const express = require("express");
const servidor = express();


servidor.use(cors());
servidor.use(json()); //cualquier cosa que venga en json sera interceptada.

//para cuando quiero hacer las pruebas de si el servidor funciona creamos una carpeta con un index que en el script hacemos las pruebas de fech. Que le damos una direccion para poner en la URL y le ponemos cual carpeta abrimos
servidor.use("/mentirillas", express.static("./pruebas"));

servidor.get("/colores", async (peticion,respuesta) => {
    try{
        let colores = await getColores();

        
        colores = colores.map(({_id,r,g,b}) => { return {id : _id,r,g,b}});
        respuesta.json(colores);

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }

});

servidor.post("/colores/nuevo",async (peticion,respuesta,siguiente) => {
    //console.log(peticion.body);
    let {r,g,b} = peticion.body;

    let valido = true;

    [r,g,b].forEach( n => valido = valido && n >= 0 && n <= 255);

    if(valido){
        try{
            let resultado = await crearColor({r,g,b});
            return respuesta.json(resultado); //te muesta el resultado que en este caso es el id que te da la base de datos.
        }catch(error){
            respuesta.status(500); //error en el servidor
            respuesta.json(error);
        }
    }

    console.log(r,g,b);

    siguiente({error : "faltan parametros"}); //por que sabes que este será el error. Si no colocamos nada en siguiente, pasa al siguiente middleware. Pero si queremos usar siguiente para que salte el error hay que colocar algo los parentesis
    
});
servidor.delete("/colores/borrar/:id([a-f0-9]{24})",async (peticion,respuesta) => {
    try{
        let cantidad = await borrarColor(peticion.params.id);

        respuesta.json({resultado : cantidad > 0 ? "ok" : "ko"});
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});


servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({error : "Error en la petición"});
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({error : "recurso no encontrado"});
});


servidor.listen(process.env.PORT);