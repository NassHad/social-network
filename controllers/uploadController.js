const UserModel = require('../models/UserModel');
const fs = require('fs');
const { promisify } = require("util");
const pipeline = promisify(require('stream').pipeline);
const { uploadErrors } = require('../utils/errorsUtils');

module.exports.fileVerification = (req, res) => {
    try{
        if(
            req.file.detectedMimeType !== "image/jpg" &&
            req.file.detectedMimeType !== "image/png" &&
            req.file.detectedMimeType !== "image/jpeg"
        )
            throw Error("invalid file");

        if(req.file.size > 500000) throw Error("max size");
    } catch (err) {
        const errors = uploadErrors(err);
        return res.status(201).json(errors);
    }
}

module.exports.uploadProfile = async(req, res) => {
    this.fileVerification(req, res);

    const fileName = req.body.name + ".jpg";

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profiles/${fileName}`
        )
    );

    try{
        await UserModel.findByIdAndUpdate(
            req.body.userId,
    {$set: {picture: "./uploads/profiles/" + fileName}},
    { new: true, upsert: true, setDefaultsOnInsert: true},
            ((err, docs) => {
                if(!err) return res.send(docs);
                else return res.status(500).send({message: err});
            })
        );
    } catch (err) {
        return res.status(500).send({message: err});
    }
}