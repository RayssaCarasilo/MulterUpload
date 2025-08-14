const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    porte: {
        type: String,
        required: true
    },
    idade: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    contato: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);