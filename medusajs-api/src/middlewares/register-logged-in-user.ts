import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import UserService from '../services/user';
import { User } from '../models/user';

export async function registerLoggedInUser(req: MedusaRequest, res: MedusaResponse, next: Function) {
    let loggedInUser: User | null = null;

    if (req.user && req.user.userId) {
        try {
            const userService = req.scope.resolve('userService') as UserService;
            loggedInUser = await userService.retrieve(req.user.userId, {
                select: ['id', 'is_admin', 'status', 'store_id'],
            });
        } catch (error) {
        }
    }

    req.scope.register({
        loggedInUser: {
            resolve: () => loggedInUser,
        },
    });

    next();
}
