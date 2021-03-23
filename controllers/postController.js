const UserModel = require('../models/UserModel');
const PostModel = require('../models/PostModel');
const { fileVerification } = require('../controllers/uploadController');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');
const { promisify } = require("util");
const pipeline = promisify(require('stream').pipeline);


module.exports.createPost = async (req, res) => {
    let fileName;
    if(req.file !== null){
        fileVerification(req, res);

        fileName = req.body.posterId + Date.now() + '.jpg';

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
        );
    }

    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file !== null ? "./uploads/posts/" + fileName : "",
        video: req.body.video,
        likers: [],
        comments: [],
    })

    try{
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if(!err) return res.send(docs)
        else console.log('Error to get data : ' + err);
    }).sort({ createdAt: -1 })
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
                if(!err) return res.send(docs);
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
                if(!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.commentPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    try{
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new: true },
            (err, docs) => {
                if(!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        )

    } catch (err) {
        return res.status(400).send(err)
    }
}

module.exports.editCommentPost = (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    try{
        return PostModel.findById(
            req.params.id, // Post ID
            (err, docs) => {
                // console.log(docs.comments);
                const theComment = docs.comments.find((comment) => comment._id.equals(req.body.commentId)) // Comment ID
                if(!theComment) return res.status(404).send('Comment not found');
                theComment.text = req.body.text;

                return docs.save((err) => {
                    if(!err) return res.status(200).send(docs);
                    else return res.status(500).send(err);
                })
            }
        )
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.deleteCommentPost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    try{
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    }
                }
            },
            {new: true},
            ((err, docs) => {
                if(!err) return res.send(docs);
                else return res.status(400).send(err)
            })

        )
    } catch (err) {
        return res.status(400).send(err);
    }
}