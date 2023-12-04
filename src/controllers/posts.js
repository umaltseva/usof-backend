import postService from '../services/posts.js';

const getPosts = async (req, res) => {
    const { offset, limit } = req.query;
    const result = await postService.getPosts(offset, limit);

    if (result.error) {
        res.status(500);
    }

    res.send(result);
}

const getPost = async (req, res) => {
    const { postId } = req.params;

    const result = await postService.getPostById(postId);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const getComments = async (req, res) => {
    const { postId } = req.params;

    const result = await postService.getPostComments(postId);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const createComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    const result = await postService.addPostComment(req.user.id, postId, content);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const getPostCategories = async (req, res) => {
    const { postId } = req.params;

    const result = await postService.getPostCategories(postId);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const getPostLikes = async (req, res) => {
    const { postId } = req.params;

    const result = await postService.getPostLikes(postId);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const createPost = async (req, res) => {
    const { title, content, categories } = req.body;

    const result = postService.createPost(req.user.id, title, content, categories);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const createPostLike = async (req, res) => {
    const { postId } = req.params;
    const { type } = req.body;

    const result = postService.addPostLike(req.user.id, postId, type);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const updatePost = async (req, res) => {
    const result = await postService.updatePost(req.user, req.params.postId, req.body);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const deletePost = async (req, res) => {
    const { postId } = req.params;
    const result = postService.deletePostById(postId);

    if (result) {
        res.status(400);
    }

    res.send(result);
}

const deletePostLike = async (req, res) => {
    const { postId } = req.params;
    const result = postService.deletePostLike(req.user.id, postId);

    if (result) {
        res.status(400);
    }

    res.send(result);
}

export {
    getPosts, getPost, getComments, createComment, getPostCategories,
    getPostLikes, createPost, createPostLike, updatePost, deletePost, deletePostLike
};
