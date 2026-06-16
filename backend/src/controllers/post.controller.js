import models from "../models/index.js"

export const getPosts = async (req, res) => {
    try {
        const posts = await models.Post.findAll({
            where: {
                status: true
            },
            include: [
                models.Person,
                models.Comment
            ]
        })

        res.json (posts)

    } 
    catch(error) {
        message: "Error al buscar post"
        res.status(500).json({error: error.message})
    }
}

export const getPostById = async (req, res) => {
    try {
        const post = await models.Post.findByPk(req.params.id, {
            include: [
                models.Person,
                models.Comment
            ]
        })

        if (!post) {
            return res.status(404).json({error: "No se ha encontrado el post"})
        }
        res.json(post)

    }
    catch (error) {
        message: "Error al buscar post"
        res.status(500).json({error: error.message})
    }
}
export const getPostByForum = async (req, res) => {
    try {
        const post = await models.Post.findAll({
            where: {
                forumId: req.params.forumId
            },
            include: [
                models.Person,
                models.Comment
            ]
        })
        res.json(post)
    }
    catch (error) {
        message: "Error al buscar post"
        res.status(500).json({error: error.message})
    }
}
export const createPost = async (req, res) => {
    try {

        const {
            title,
            body,
            personId,
            status
        } = req.body 
        const post = await models.Post.create({
            title, 
            body,
            personId,
            status
        })

        res.status(201).json(post)
    } 

    catch (error) {
        message: "Error al crear post"
        res.status(500).json({error: error.message})
    }
}

export const updatePost = async (req, res) => {
    try {
        const {
            title,
            body, 
            status,
        } = req.body 
        const post = await models.Post.findByPk(req.params.id)

        if (!post) {
            return res.status(404).json({error:"No se ha encontrado el post"})
        }
        await post.update({
            title,
            body,
            status
        })
        res.json(post)
    }
    catch (error) {
        message: "Error al actualizar post"
        res.status(500).json({error: error.message})
    }
}

export const deletearPost = async (req, res) => {
    try {
        const post = await models.Post.findByPk(req.params.id)

        if (!post){
            return res.status(404).json({error: "No se ha encontrado el post"})
        }

        await post.destroy()

        res.json({
            message:"Post eliminado"
        })
    }

    catch (error) {
        message: "Error al eliminar post"
        res.status(500).json({error: error.message})
    }
}

export const likesPost = async (req, res) => {
    try {
        const post = await models.Post.findByPk(req.params.id)

        if (!post){
            return res.status(404).json({error: "No se ha encontrado el post"})
        }

        post.likeCount += 1

        await post.save()

        res.json(post)
    }
    catch (error) {
        message: "Error al likear post"
        res.status(500).json({error: error.message})
    }
}