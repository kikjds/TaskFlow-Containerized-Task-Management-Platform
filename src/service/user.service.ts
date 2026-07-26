import { User } from "../model/user.model.js";

export async function getUserById(userId: string) {
    return User.findById(userId);
}

export async function updateUserBasedOnId(
    userId: string,
    username: string,
    email: string,
    notifications: boolean
) {
    const user = await User.findById(userId);

    if (!user) {
        return null;
    }

    user.username = username;
    user.email = email;
    user.notifications = notifications ? true : false;

    await user.save();

    return user;
}