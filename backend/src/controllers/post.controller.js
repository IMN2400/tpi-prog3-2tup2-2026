import models from "../models/index.js"

//obtiene todos los posts

export const getPosts = async (req, res) => {
    try {
        const posts = await models.Post.findAll({
            //WHERE ES UN WHERE cf
            where: {
                status: true
            },
            //INCLUDE ES UN JOIN
            include: [
                models.User,
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

//obtener los post por ID

export const getPostById = async (req, res) => {
    try {
        const post = await models.Post.findByPk(req.params.id, {
            include: [
                models.User,
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

export const createPost = async (req, res) => {
    try {

        const {
            title,
            body,
            userId,
            status
        } = req.body //ESTE BODY NO TIENE NADA QUE VER CON EL CUERPO DEL POST
        const post = await models.Post.create({
            title, 
            body,
            userId,
            status
        })

        res.status(201).json(post)
    } 

    catch (error) {
        message: "Error al buscar post"
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
        message: "Error al buscar post"
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
        message: "Error al buscar post"
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
        message: "Error al buscar post"
        res.status(500).json({error: error.message})
    }
}