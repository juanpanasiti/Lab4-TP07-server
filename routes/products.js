const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || 'image/png'){
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
})



//GET ALL
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (err) {
        res.json({message: err})
    }
})//Get_all

//SUBMITS A PRODUCT
router.post('/', upload.single('productImage'), async (req,res) => {
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
        res.json({ message: err})
    }
    
})//POST

//GET ONE
router.get('/:prodId', async (req, res) => {
    try {
        const prod = await Product.findById(req.params.prodId)
        res.json(prod)
    } catch (err) {
        res.json({message: err})
    }
})//GET_ONE

//Delete Product
router.delete('/:prodId', async (req,res) => {
    try {
        const removedProd = await Product.remove({_id: req.params.prodId})
        res.json(removedProd)
    } catch (err) {
        res.json(err)
    }
})//DELETE

//Update
router.put('/:prodId', async (req,res) => {
    try {
        const updatedProd = await Product.findOneAndUpdate(
            {_id: req.params.prodId},
            { $set: {
                instrumento: req.body.instrumento,
                marca: req.body.marca,
                modelo: req.body.modelo,
                imagen: req.body.imagen,
                precio: req.body.precio,
                costoEnvio: req.body.costoEnvio,
                cantidadVendida: req.body.cantidadVendida,
                descripcion: req.body.descripcion
            }})
            res.json(updatedProd)
    } catch (err) {
        res.json({message: err})
    }
})

module.exports = router;