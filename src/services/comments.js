import pool from '../db/db.js'
import userService from '../services/users.js';

const getCommentById = async (commentId) => {
    try {
        const result = await pool.query(
            `select c.*,
                count(l.id) filter (where l.type = 'like') as likes,
                count(l.id) filter (where l.type = 'dislike') as dislikes
            from comments c
                left join likes l on l.comment_id = c.id
            where c.id = $1
            group by c.id`,
            [commentId]
        );

        if (result.rowCount == 0) {
            return { error: "Comment not found" };
        }

        const comment = result.rows[0];
        comment.author = await userService.getUserById(comment.author_id);
        delete comment.author_id;

        return comment;
    } catch (error) {
        return { error: error.message };
    }
}

const getCommentLikes = async (commentId) => {
    try {
        const result = await pool.query(
            "select * from likes where comment_id = $1",
            [commentId]
        );

        return result.rows;
    } catch (error) {
        return { error: error.message };
    }
}

const addCommentLike = async (userId, commentId, type) => {
    try {
        const result = await pool.query(
            "insert into likes (comment_id, author_id, type) values ($1, $2, $3) returning *",
            [commentId, userId, type]
        );

        return result.rows[0];
    } catch (error) {
        return { error: error.message };
    }
}

const updateComment = async (auth, commentId, changes) => {
    try {
        const result = await pool.query(
            `update comments set content = $1 where id = $2 returning *`,
            [changes.content, commentId]
        );

        return result.rows[0];
    } catch (error) {
        return { error: error.message };
    }
}

const deleteCommentById = async (commentId) => {
    try {
        const result = await pool.query(
            "delete from comments where id = $1",
            [commentId]
        );

        if (result.rowCount == 0) {
            return { error: "Comment not found" };
        }
    } catch (error) {
        return { error: error.message };
    }
}

const deleteCommentLike = async (userId, commentId) => {
    try {
        const result = await pool.query(
            "delete from likes where author_id = $1 and comment_id = $2",
            [userId, commentId]
        );

        if (result.rowCount == 0) {
            return { error: "Like not found" };
        }
    } catch (error) {
        return { error: error.message };
    }
}

export default {
    getCommentById, getCommentLikes, getCommentLikes,
    addCommentLike, updateComment, deleteCommentById, deleteCommentLike
}
