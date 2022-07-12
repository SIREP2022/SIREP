const path = require('path');
const fs = require('fs');
const controlador = {};

controlador.returnPhoto = async(req, res) => {
    let filepath = path.join(path.resolve('./'), 'public', 'img', 'perfil', req.params.file);
    if(!fs.existsSync(filepath)) return res.status(404).json({status: 404, result: {msg: 'File not found:' + req.params.file}});    
    res.sendFile(filepath);
}

module.exports = controlador;