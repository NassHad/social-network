const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.createPost = async (req, res) => {
    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        likers: [],
        comments: [],
    })
    console.log(newPost);
    try{
        const post = await newPost.save();
        console.log(post);
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if(!err) return res.send(docs)
        else console.log('Error to get data : ' + err);
    })
}

module.exports.updatePost = (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: {message: req.body.message} },
        {new: true},
        (err, docs) => {
            if(!err) res.send(docs);
            else console.log("Update error : " + err);
        }
    )
}

module.exports.deletePost = async(req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    try{
        await PostModel.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Successfully deleted."});
    } catch (err) {
        console.log("Delete error : " + err);
        return res.status(500).json({ message: err});
    }
}

module.exports.likePost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    try{
        await PostModel.findByIdAndUpdate(
            req.params.id,
    {
                $addToSet: { likers: req.body.id }
            },
    { new: true },
    (err, docs) => {
                if(err) return res.status(400).send(err);
            }
        );

        await UserModel.findByIdAndUpdate(
            req.body.id,
    {
                $addToSet: {likes: req.params.id}
            },
    { new: true },
    (err, docs) => {
                if(!err) res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.unlikePost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    try{
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id }
            },
            { new: true },
            (err, docs) => {
                if(err) return res.status(400).send(err);
            }
        );

        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: {likes: req.params.id}
            },
            { new: true },
            (err, docs) => {
                if(!err) res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
}