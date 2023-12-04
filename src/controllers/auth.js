import userService from '../services/users.js';

const register = async (req, res) => {
    const { login, password, passwordConfirmation, email } = req.body;

    const result = await userService.createUser(login, password, passwordConfirmation, email, "user");

    if (result.error) {
        res.status(400);
    }

    res.send(result);
}

const verifyEmail = async (req, res) => {
    const { token } = req.params;

    const result = await userService.verifyUserEmail(token);

    if (result) {
        res.status(400);
    }

    res.send(result);
}

const login = async (req, res) => {
    const { login, password } = req.body;

    const result = await userService.loginUser(login, password);

    if (result.error) {
        res.status(400).send(result);
        return;
    }

    res.cookie("token", result.token, { httpOnly: true })
        .send(result.user);
}

const logout = async (req, res) => {
    const { token } = req.cookies;

    const result = await userService.cancelAuthToken(token);

    if (result) {
        res.status(400);
    }

    res.send(result);
}

const resetPassword = async (req, res) => {
    const { email } = req.body;

    const result = await userService.resetUserPassword(email);

    if (result) {
        res.status(400);
    }

    res.send(result);
}

const confirmPasswordReset = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const result = await userService.confirmUserPasswordReset(token, newPassword);

    if (result) {
        res.status(400);
    }

    res.send(result);
}

export { register, verifyEmail, login, logout, resetPassword, confirmPasswordReset };
