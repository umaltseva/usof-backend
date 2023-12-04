import userService from '../services/users.js';

const getUsers = async (req, res) => {
    const result = await userService.getAllUsers();

    if (result.error) {
        res.status(500);
    }

    res.send(result);
}

const getUser = async (req, res) => {
    const { userId } = req.params;

    const result = await userService.getUserById(userId);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const createUser = async (req, res) => {
    const { login, password, passwordConfirmation, email, role } = req.body;

    const result = await userService.createUser(login, password, passwordConfirmation, email, role);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const uploadAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: "Missing file" });
    }

    const result = await userService.setAvatar(req.user.id, req.file.path);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const updateUser = async (req, res) => {
    const result = await userService.updateUser(req.user, req.params.userId, req.body);

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const deleteUser = async (req, res) => {
    const { userId } = req.params;

    const result = await userService.deleteUserById(userId);

    if (result) {
        res.status(400);
    }

    res.send(result);
}

export { getUsers, getUser, createUser, uploadAvatar, updateUser, deleteUser };
