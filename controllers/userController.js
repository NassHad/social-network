const UserModel = require('../models/UserModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select(['-password']);
    res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
    console.log(req.params);
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    UserModel.findById(req.params.id, (err, doc) => {
        if(!err) res.send(doc);
        else console.log('ID unknown : ' + err);
    }).select('-password');
};

module.exports.updateUser = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    try {
        await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: {
                    bio: req.body.bio
                }
            },
            {
                new: true, upsert: true, setDefaultsOnInsert: true
            },
            ((err, doc) => {
                if(!err) return res.send(doc);
                if(err) return res.status(500).send({ message: err.message });
            })
        )
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.deleteUser =  async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    try{
        await UserModel.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Successfully deleted."});
    } catch (err) {
        return res.status(500).json({ message: err});
    }
}

module.exports.follow = async (req,res) => {
    console.log(req.body, req.params);
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send('ID unknown : '+ req.params.id);

    try{
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow }},
            { new: true, upsert: true},
            ((err, doc) => {
                if(!err) return res.status(201).json(doc);
                else return res.status(400).json({ message: err.message });
            })
        );

        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers:  req.params.id } },
            { new: true, upsert: true},
            ((err, doc) => {
                if(err) return res.status(400).json({ message: err.message });
            })
        )
    } catch (err) {
        return res.status(500).json({ message: err});
    }
}

module.exports.unfollow = async (req,res) => {
    if(!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID unknown : '+ req.params.id);

    try{
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow }},
            { new: true, upsert: true},
            ((err, doc) => {
                if(!err) return res.status(201).json(doc);
                else return res.status(400).json({ message: err.message });
            })
        );

        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers:  req.params.id } },
            { new: true, upsert: true},
            ((err, doc) => {
                if(err) return res.status(400).json({ message: err.message });
            })
        )
    } catch (err) {
        return res.status(500).json({ message: err});
    }
}