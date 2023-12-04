import commentService from '../services/comments.js'

const getComment = async (req, res) => {
    const { commentId } = req.params;
    const result = await commentService.getCommentById(commentId);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const getCommentLikes = async (req, res) => {
    const { commentId } = req.params;
    const result = await commentService.getCommentLikes(commentId);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const createCommentLike = async (req, res) => {
    const { commentId } = req.params;
    const { type } = req.body;

    const result = await commentService.addCommentLike(req.user.id, commentId, type);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const updateComment = async (req, res) => {
    const result = await commentService.updateComment(req.user, req.params.commentId, req.body);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const result = await commentService.deleteCommentById(commentId);

    if (result) {
        res.status(400);
    }

    res.send(result);
}

const deleteCommentLike = async (req, res) => {
    const { commentId } = req.params;
    const result = await commentService.deleteCommentLike(req.user.id, commentId);

    if (result) {
        res.status(400);
    }

    res.send(result);
}

export { getComment, getCommentLikes, createCommentLike, updateComment, deleteComment, deleteCommentLike };
