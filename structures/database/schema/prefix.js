const mongoose = require('mongoose');

const prefixSchema = new mongoose.Schema({
    _id: String,
    prefix: { type: String, default: "+" } 
});

module.exports = mongoose.model('Prefix', prefixSchema);