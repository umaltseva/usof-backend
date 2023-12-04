import pool from '../db/db.js';

const getAllCategories = async () => {
    try {
        const result = await pool.query("select * from categories");

        return result.rows;
    } catch (error) {
        return { error: error.message };
    }
}

const getCategoryById = async (categoryId) => {
    try {
        const result = await pool.query(
            "select * from categories where id = $1",
            [categoryId]
        );

        if (result.rowCount == 0) {
            return { error: "Category not found" };
        }

        return result.rows[0];
    } catch (error) {
        return { error: error.message };
    }
}

const getCategoryPosts = async (categoryId) => {
    try {
        const result = await pool.query(
            `select p.* from posts p
            left join post_categories pc on pc.post_id = p.id
            where pc.category_id = $1`,
            [categoryId]
        );

        return result.rows;
    } catch (error) {
        return { error: error.message };
    }
}

const createCategory = async (title) => {
    try {
        const result = await pool.query(
            "insert into categories (title) values ($1) returning *",
            [title]
        );

        return result.rows[0];
    } catch (error) {
        return { error: error.message };
    }
}

const updateCategory = async (categoryId, changes) => {
    try {
        const selectResult = await pool.query(
            "select * from categories where id = $1",
            [categoryId]
        );

        if (selectResult.rowCount == 0) {
            return { error: "Category not found" };
        }

        const category = { ...selectResult.rows[0], ...changes };

        const result = await pool.query(
            `update categories set title = $1, description = $2 where id = $3 returning *`,
            [category.title, category.description, category.id]
        );

        return result.rows[0];
    } catch (error) {
        return { error: error.message };
    }
}

const deleteCategoryById = async (categoryId) => {
    try {
        const result = await pool.query(
            "delete from categories where id = $1",
            [categoryId]
        );

        if (result.rowCount == 0) {
            return { error: "Category not found" };
        }
    } catch (error) {
        return { error: error.message };
    }
}

export default { getAllCategories, getCategoryById, getCategoryPosts, createCategory, updateCategory, deleteCategoryById }
