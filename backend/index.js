const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");

app.use(express.json());
app.use(cors());

// Database connection with mongodb
mongoose.connect("mongodb+srv://ansariwork166:Aamir78692@cluster0.axcoteb.mongodb.net/e-commerce");

//mongodb account :- ansariwork166@.com pass :- Aamr78692@.com


// API creation

app.get("/", (req, res) => {
    res.send("Express App is Running")
})


// IMAGE STORAGE ENGINE

const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    },
})

const upload = multer({ storage: storage })



// CREATING UPLOAD ENDPOINT FOR IMAGE

app.use("/images", express.static("upload/images"))
app.post("/upload", upload.single("product"), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`,
    })
})


// SCHEMA FOR PRODUCT

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    available: {
        type: Boolean,
        default: true,
    },
})


// PRODUCT ADD ENDPOINT

app.post("/addproduct", async (req, res) => {
    // LOGIC FOR AUTOMATIC CREATION OF NEW ID FOR THE PRODUCT

    let products = await Product.find()
    let id
    if (products.length > 0) {
        const last_product_array = products.slice(-1)
        const last_product = last_product_array[0]
        id = last_product.id + 1
    } else {
        id = 1
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    })
    await product.save()
    res.json({
        success: true,
        name: req.body.name,
    })
    console.log("New Product saved to DB")

})

// PRODUCT Remove product 

app.post("/removeproduct", async (req, res) => {

    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
})


// CREATING API FOR FETCHING ALL PRODUCTS

app.get("/allproducts", async (req, res) => {
    let products = await Product.find()
    console.log("All products fetched from DB")
    res.send(products)

})

//shema creating for User model
const User = mongoose.model('Users', {
    name: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,

    },
    cartData: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

//creating endpoint for registering the user
app.post('/signup', async (req, res) => {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same email address" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })

    await user.save();
    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token })
})


//  CREATING THE USER LOGIN ENDPOINT

app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const passCompare = req.body.password === user.password;
            if (passCompare) {
                const data = {
                    user: {
                        id: user.id,
                    },
                }
                const token = jwt.sign(data, "secret_ecom")
                res.json({ success: true, token })
            } else {
                res.json({ success: false, error: "Incorrect password" });
            }
        } else {
            res.json({ success: false, error: "No such email registered,Try signup" });
        }
    } catch (error) {
        console.log(error);
    }
})


//creating endpoint for new collection data
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

// creating end point for popular in women section

app.get('/popularinwomen',async(req,res)=>{
    let products= await Product.find({category:"women"});
let popular_in_women =products.slice(0,4);
console.log("Popular in women fetched");
res.send(popular_in_women);
})

//creating middile ware to fetch user
const fetchUser= async(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    
}

//creating endpont for adding product in cartdata
app.post('/addtocart',async(req,res)=>{
    console.log(res.body);

})


app.listen(port, (error) => {
    if (!error) {
        console.log("Server Runing on port" + port)
    }
    else {
        console.log("Error : " + error)
    }
})