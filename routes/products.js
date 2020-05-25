const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const multer = require('multer') //subir archivos
const fs = require('fs') //borrar archivos

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})



//GET ALL
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (err) {
        res.json({ message: err })
    }
})//Get_all

//SUBMITS A PRODUCT
router.post('/', upload.single('productImage'), async (req, res) => {
    try {
        console.log("Archivo: " + req.file)
        const product = new Product({
            instrumento: req.body.instrumento,
            marca: req.body.marca,
            modelo: req.body.modelo,
            precio: req.body.precio,
            costoEnvio: req.body.costoEnvio,
            cantidadVendida: req.body.cantidadVendida,
            descripcion: req.body.descripcion,
            imagenPath: req.file.path
        })

        const savedProd = await product.save()
        res.json(savedProd)
    } catch (err) {
        res.json({ message: err })
    }

})//POST

//GET ONE
router.get('/:prodId', async (req, res) => {
    try {
        const prod = await Product.findById(req.params.prodId)
        res.json(prod)
    } catch (err) {
        res.json({ message: err })
    }
})//GET_ONE

//Delete Product
router.delete('/:prodId', async (req, res) => {
    try {
        const removedProd = await Product.remove({ _id: req.params.prodId })
        res.json(removedProd)
    } catch (err) {
        res.json(err)
    }
})//DELETE

//Update
router.put('/:prodId', upload.single('productImage'), async (req, res) => {
    console.log("Actualizando");
    
    try {
        const updatedProd = await Product.findById(req.params.prodId)
        //Actualizar campos
        updatedProd.instrumento = req.body.instrumento
        updatedProd.marca = req.body.marca
        updatedProd.modelo = req.body.modelo
        updatedProd.precio = req.body.precio
        updatedProd.costoEnvio = req.body.costoEnvio
        updatedProd.cantidadVendida = req.body.cantidadVendida
        updatedProd.descripcion = req.body.descripcion
        
        if(req.file){
            console.log("cargar imagen");
            oldPath = updatedProd.imagenPath
            updatedProd.imagenPath = req.file.path
            try {
                fs.unlinkSync(oldPath)
                console.log("Se borró el archivo " + oldPath);

            } catch (err) {
                console.log("No se pudo borrar el archivo " + oldPath);
                console.log("Error: " + err.message);
                
                
            }
        }
        console.log("imagne cargada");
        
        //Guardar
        const savedProd = await updatedProd.save()
        res.json(savedProd)
    } catch (err) {
        console.log(err.message);
        
        res.json({ message: err.messsage })
    }
})

module.exports = router;