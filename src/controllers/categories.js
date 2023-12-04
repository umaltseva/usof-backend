import categoryService from '../services/categories.js'

const getCategories = async (req, res) => {
    const result = await categoryService.getAllCategories();

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const getCategory = async (req, res) => {
    const { categoryId } = req.params;
    const result = await categoryService.getCategoryById(categoryId);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const getCategoryPosts = async (req, res) => {
    const { categoryId } = req.params;
    const result = await categoryService.getCategoryPosts(categoryId);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const createCategory = async (req, res) => {
    const { title } = req.body;
    const result = await categoryService.createCategory(title);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const result = await categoryService.updateCategory(categoryId, req.body);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;
    const result = await categoryService.updateCategory(categoryId, req.body);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

export { getCategories, getCategory, getCategoryPosts, createCategory, updateCategory, deleteCategory };
