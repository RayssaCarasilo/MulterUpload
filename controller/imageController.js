const Image = require('../models/Image');

exports.create = async (req, res) => {
    try {
        const { name, porte, idade, tipo, descricao, cidade, contato } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({message: "Nenhuma imagem foi enviada."});
        }

        if (!name || !porte || !idade || !tipo || !descricao || !cidade || !contato) {
            return res.status(400).json({message: "Todos os campos são obrigatórios."});
        }

        const image = new Image({
            name,
            porte,
            idade,
            tipo,
            descricao,
            cidade,
            contato,
            src: file.path,
        });

        await image.save();
        res.json({ 
            image, 
            msg: "Animal adicionado com sucesso!" 
        });

    } catch (error) {
        console.error('Erro ao salvar no MongoDB:', error);
        res.status(500).json({message: "Erro ao salvar animal: " + error.message});
    }
};

exports.getAll = async (req, res) => {
    try {
        const images = await Image.find().sort({ createdAt: -1 }); // Mais recentes primeiro
        res.json(images);
    } catch (error) {
        console.error('Erro ao buscar animais:', error);
        res.status(500).json({message: "Erro ao buscar animais."});
    }
};