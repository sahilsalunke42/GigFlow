import { register, login } from "../services/authService";
import { refresh, getCurrentUser } from "../services/authService";
import { getAssignableUsers } from "../services/authService";

export const authController = {
    register,
    login,
    refresh,
    getCurrentUser,
    getAssignableUsers
};

