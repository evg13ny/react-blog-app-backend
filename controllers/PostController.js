import PostModel from "../models/Post.js"

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec() // bind another table
        res.json(posts)
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: 'Failed to receive posts'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate( // update viewsCount
            {
                _id: postId
            },
            {
                $inc: { viewsCount: 1 }
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log(err)

                    return res.status(500).json({
                        message: 'Failed to receive post'
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Can\'t find post'
                    })
                }

                res.json(doc)
            }
        )
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: 'Failed to receive post'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndDelete(
            {
                _id: postId
            },
            (err, doc) => {
                if (err) {
                    console.log(err)

                    res.status(500).json({
                        message: 'Failed to remove post'
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Can\'t find post'
                    })
                }

                res.json({
                    success: true
                })
            })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: 'Failed to remove post'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()
        res.json(post)
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: 'Failed to create post'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags
            }
        )

        res.json({
            success: true
        })
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: 'Failed to update post'
        })
    }
}