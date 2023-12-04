import { Router } from 'express';
import { confirmPasswordReset, login, logout, register, resetPassword, verifyEmail } from './controllers/auth.js';
import { createUser, deleteUser, getUser, getUsers, updateUser, uploadAvatar } from './controllers/users.js';
import {
    createComment, createPostLike, createPost, deletePostLike, deletePost,
    getPostCategories, getComments, getPostLikes, getPost, getPosts, updatePost
} from './controllers/posts.js';
import {
    createCategory, deleteCategory, getCategories,
    getCategory, getCategoryPosts, updateCategory
} from './controllers/categories.js';
import { createCommentLike, deleteComment, deleteCommentLike, getComment, getCommentLikes, updateComment } from './controllers/comments.js';
import { auth, role, admin } from './middleware/auth.js'
import avatarUpload from './middleware/avatarUpload.js'

const router = Router();

router.post("/auth/register", register);
router.post("/auth/verify-email/:token", verifyEmail);
router.post("/auth/login", login);
router.post("/auth/logout", auth, logout);
router.post("/auth/password-reset", resetPassword);
router.post("/auth/password-reset/:token", confirmPasswordReset);

router.get("/users", auth, getUsers);
router.get("/users/:userId", auth, getUser);
router.post("/users", auth, role, admin, createUser);
router.patch("/users/avatar", auth, avatarUpload.single("avatar"), uploadAvatar);
router.patch("/users/:userId", auth, role, updateUser);
router.delete("/users/:userId", auth, deleteUser);

router.get("/posts", getPosts);
router.get("/posts/:postId", getPost);
router.get("/posts/:postId/comments", getComments);
router.post("/posts/:postId/comments", auth, createComment);
router.get("/posts/:postId/categories", auth, getPostCategories);
router.get("/posts/:postId/like", auth, getPostLikes);
router.post("/posts", auth, createPost);
router.post("/posts/:postId/like", auth, createPostLike);
router.patch("/posts/:postId", auth, updatePost);
router.delete("/posts/:postId", auth, deletePost);
router.delete("/posts/:postId/like", auth, deletePostLike);

router.get("/categories", auth, getCategories);
router.get("/categories/:categoryId", auth, getCategory);
router.get("/categories/:categoryId/posts", auth, getCategoryPosts);
router.post("/categories", auth, role, admin, createCategory);
router.patch("/categories/:categoryId", auth, role, admin, updateCategory);
router.delete("/categories/:categoryId", auth, role, admin, deleteCategory);

router.get("/comments/:commentId", auth, getComment);
router.get("/comments/:commentId/like", auth, getCommentLikes);
router.post("/comments/:commentId/like", auth, createCommentLike);
router.patch("/comments/:commentId", auth, updateComment);
router.delete("/comments/:commentId", auth, deleteComment);
router.delete("/comments/:commentId/like", auth, deleteCommentLike);

export default router;
