const Product = require('../models/Product');
const ProductEvent = require('../models/ProductEvent');
const Actor = require('../models/Actor');
const { createProductHash, signData } = require('../utils/signature');

// 1. Initial Onboarding
exports.onboardProduct = async (req, res) => {
    try {
        const { name, batchNumber, expiryDate, manufacturerId, privateKey } = req.body;
        const actor = await Actor.findById(manufacturerId);
        if (!actor || !actor.isVerified) return res.status(401).json({ message: "Unverified Actor" });

        const productData = { name, batchNumber, manufacturerId };
        const pHash = createProductHash(productData);
        const pSignature = signData(privateKey, pHash);

        const newProduct = new Product({
            name, batchNumber, expiryDate,
            manufacturer: manufacturerId,
            productHash: pHash,
            signature: pSignature
        });

        await newProduct.save();
        res.status(201).json({ message: "Product Onboarded!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Dashboard Update + Irreversible Hashing (Actor input leta hai, system hash karta hai)
exports.updateProductStatus = async (req, res) => {
    try {
        const { productId, actorId, location, statusUpdate } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Security: Create Irreversible Hash for this event
        const eventContent = { productId, location, statusUpdate, time: Date.now() };
        const eventHash = createProductHash(eventContent);

        // 1. Update Dashboard (Live Product View)
        product.currentLocation = location;
        product.status = statusUpdate;

        // 2. Create Persistent Event
        const newEvent = new ProductEvent({
            productId,
            nodeName: location,
            action: statusUpdate,
            dataHash: eventHash
        });
        const savedEvent = await newEvent.save();

        // Link event to product history
        product.history.push(savedEvent._id);
        await product.save();

        res.status(200).json({
            message: "Dashboard Updated & Record Hashed!",
            currentLocation: product.currentLocation,
            eventHash: eventHash
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get Dashboard Data (For Admin/Consumers)
exports.getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('manufacturer', 'name organization')
            .populate('history');
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};