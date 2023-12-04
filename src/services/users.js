import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../db/db.js';
import { sendVerificationLink, sendPasswordResetLink } from './mail.js';

const saltRounds = 10;

const createUser = async (login, password, passwordConfirmation, email, role) => {
    if (password != passwordConfirmation) {
        return { error: "Passwords do not match" }
    }

    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const result = await pool.query(
            `insert into users (login, password, email, profile_picture, role)
            values ($1, $2, $3, $4, $5)
            returning id, login, full_name, email, profile_picture, rating, role, email_verified`,
            [login, encryptedPassword, email, "images/avatar.jpg", role]
        );

        await sendVerificationLink(email);

        return result.rows[0];
    } catch (error) {
        return { error: error.message };
    }
}

const setAvatar = async (userId, path) => {
    try {
        const result = await pool.query(
            `update users set profile_picture = $1 where id = $2
            returning id, login, full_name, email, profile_picture, rating, role, email_verified`,
            [path, userId]
        );

        if (result.rowCount == 0) {
            return { error: "User not found" };
        }

        return result.rows[0];
    } catch (error) {
        return { error: error.message };
    }
}

const verifyUserEmail = async (token) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (payload.type != "emailVerification") {
            return { error: "Invalid token type" };
        }

        await pool.query(
            "update users set email_verified = true where email = $1",
            [payload.email]
        );
    } catch (error) {
        return { error: error.message };
    }
}

const loginUser = async (login, password) => {
    try {
        const result = await pool.query(
            "select * from users where login = $1",
            [login]
        );

        if (result.rowCount == 0) {
            return { error: "User not found" };
        }

        const user = result.rows[0];

        if (!await bcrypt.compare(password, user.password)) {
            return { error: "Incorrect password" };
        }
        if (!user.email_verified) {
            return { error: "Email not verified" };
        }

        delete user.password;

        const token = jwt.sign({ user: { id: user.id }, type: "auth" }, process.env.JWT_SECRET, { expiresIn: "14d" });

        return { user: user, token: token };
    } catch (error) {
        return { error: error.message };
    }
}

const cancelAuthToken = async (token) => {
    try {
        await pool.query(
            "insert into cancelled_tokens (token) values ($1)",
            [token]
        );
    } catch (error) {
        return { error: error.message };
    }
}

const resetUserPassword = async (email) => {
    try {
        await sendPasswordResetLink(email);
    } catch (error) {
        return { error: error.message };
    }
}

const confirmUserPasswordReset = async (token, newPassword) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (payload.type != "passwordReset") {
            return { error: "Invalid token type" };
        }

        const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);

        await pool.query(
            "update users set password = $1 where email = $2",
            [encryptedPassword, payload.email]
        );
    } catch (error) {
        return { error: error.message };
    }
}

const getAllUsers = async () => {
    try {
        const result = await pool.query("select id, login, full_name, email, profile_picture, rating, role, email_verified from users");

        return result.rows;
    } catch (error) {
        return { error: error.message };
    }
}

const getUserById = async (userId) => {
    try {
        const result = await pool.query(
            "select id, login, full_name, email, profile_picture, rating, role, email_verified from users where id = $1",
            [userId]
        );

        if (result.rowCount == 0) {
            return { error: "User not found" };
        }

        return result.rows[0];
    } catch (error) {
        return { error: error.message };
    }
}

const updateUser = async (auth, userId, changes) => {
    const allowed = ["login", "full_name", "email"];

    if (auth.role != "admin") {
        for (let key in changes) {
            if (!allowed.includes(key)) {
                return { error: "Permission denied" };
            }
        }
    }

    try {
        const selectResult = await pool.query(
            "select * from users where id = $1",
            [userId]
        );

        if (selectResult.rowCount == 0) {
            return { error: "User not found" };
        }

        const user = { ...selectResult.rows[0], ...changes };

        const result = await pool.query(
            `update users set login = $1, full_name = $2, email = $3, rating = $4, role = $5, email_verified = $6 where id = $7
            returning id, login, full_name, email, profile_picture, rating, role, email_verified`,
            [user.login, user.full_name, user.email, user.rating, user.role, user.email_verified, user.id]
        );

        return result.rows[0];
    } catch (error) {
        return { error: error.message };
    }
}

const deleteUserById = async (userId) => {
    try {
        const result = await pool.query(
            "delete from users where id = $1",
            [userId]
        );

        if (result.rowCount == 0) {
            return { error: "User not found" };
        }
    } catch (error) {
        return { error: error.message };
    }
}

export default {
    createUser, setAvatar, verifyUserEmail, loginUser,
    cancelAuthToken, resetUserPassword, confirmUserPasswordReset,
    getAllUsers, getUserById, updateUser, deleteUserById
} 
