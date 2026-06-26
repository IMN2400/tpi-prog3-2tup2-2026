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
    const post = await models.Post.findOne({
      where: {
        id: req.params.id,
        status: true,
      },
      include: [
        models.Person,
        models.Comment,
        models.Forum,
      ],
    });

    if (!post) {
      return res.status(404).json({
        message: "No se ha encontrado el post",
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar post",
      error: error.message,
    });
  }
};

export const getPostByForum = async (req, res) => {
  try {
    const post = await models.Post.findAll({
      where: {
        forumId: req.params.forumId,
        status: true,
      },
      include: [
        models.Person,
        models.Comment,
      ],
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar post",
      error: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    const { forumId } = req.params;
    const userId = req.user.id;

    if (!title || !body) {
      return res.status(400).json({
        message: "El título y el contenido son obligatorios",
      });
    }

    const forum = await models.Forum.findByPk(forumId);

    if (!forum) {
      return res.status(404).json({
        message: "El foro no existe",
      });
    }

    const post = await models.Post.create({
      title,
      body,
      userId,
      forumId,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear post",
      error: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, body } = req.body;

    const post = await models.Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "No se ha encontrado el post",
      });
    }

    if (Number(post.userId) !== Number(req.user.id)) {
      return res.status(403).json({
        message: "Solo el autor puede editar este post",
      });
    }

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "El título no puede estar vacío",
      });
    }

    if (!body || body.trim() === "") {
      return res.status(400).json({
        message: "El contenido no puede estar vacío",
      });
    }

    await post.update({
      title: title.trim(),
      body: body.trim(),
    });

    res.json({
      message: "Post actualizado correctamente",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar post",
      error: error.message,
    });
  }
};

export const deletearPost = async (req, res) => {
  try {
    const post = await models.Post.findByPk(req.params.id, {
      include: [models.Person],
    });

    if (!post || !post.status) {
      return res.status(404).json({
        message: "No se ha encontrado el post",
      });
    }

    if (req.user.role === "ADMIN" && post.Person?.role === "SYSADMIN") {
      return res.status(403).json({
        message: "No tenés permisos",
      });
    }

    await post.update({
      status: false,
    });

    res.json({
      message: "Post dado de baja correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al dar de baja el post",
      error: error.message,
    });
  }
};

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