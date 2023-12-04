import jwt from 'jsonwebtoken'
import pool from '../db/db.js'

const auth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.sendStatus(401);
    }

    const result = await pool.query(
        "select * from cancelled_tokens where token = $1",
        [token]
    );

    if (result.rowCount != 0) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err || payload.type != "auth") {
            return res.sendStatus(401);
        }

        req.user = payload.user;

        next();
    })
}

const role = async (req, res, next) => {
    const result = await pool.query(
        "select role from users where id = $1",
        [req.user.id]
    )

    if (result.rowCount == 0) {
        return res.sendStatus(401);
    }

    req.user.role = result.rows[0].role;

    next();
}

const admin = async (req, res, next) => {
    if (req.user.role != "admin") {
        return res.sendStatus(403);
    }

    next();
}

export { auth, role, admin };
