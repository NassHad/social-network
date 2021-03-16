const UserModel = require('../models/UserModel');

module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body;
    console.log(req.body);
    try{
        const user = await UserModel.create({pseudo, email, password});
        console.log(user);
        res.status(201).json({user: user._id});
    } catch (err) {
        res.status(200).send(err);
    }
}