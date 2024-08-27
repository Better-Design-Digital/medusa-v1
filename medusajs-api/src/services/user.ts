import { Lifetime } from 'awilix';
import { FindConfig, UserService as MedusaUserService, buildQuery } from '@medusajs/medusa';
import { User, UserStatus } from '../models/user';
import { FilterableUserProps, CreateUserInput as MedusaCreateUserInput } from '@medusajs/medusa/dist/types/user';
import StoreService from './store';
import { MedusaError } from '@medusajs/utils';
import { Selector } from '@medusajs/types';

type CreateUserInput = {
    store_id?: string;
    status?: UserStatus;
    is_admin?: boolean;
} & MedusaCreateUserInput;

class UserService extends MedusaUserService {
    static LIFE_TIME = Lifetime.TRANSIENT;

    protected readonly loggedInUser_: User | null;
    protected readonly storeService: StoreService;

    constructor(container) {
        super(container);
        this.storeService = container.storeService;

        try {
            this.loggedInUser_ = container.loggedInUser;
        } catch (e) {
            // Avoid errors when backend first runs
        }
    }

    async create(user: CreateUserInput, password: string): Promise<User> {
        const createdUser = await super.create(user, password);
        return createdUser;
    }

    async retrieve(userId: string, config?: FindConfig<User>): Promise<User> {
        const user = await super.retrieve(userId, {
            ...config,
            relations: ['store'],  
        });

        if (user.store_id && this.loggedInUser_?.store_id && user.store_id !== this.loggedInUser_.store_id) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, 'User does not exist');
        }

        if (user.store) {
            (user as any).store_name = user.store.name;  
        }

        return user;
    }

    async list(selector?: Selector<User> & { q?: string }, config?: FindConfig<FilterableUserProps>): Promise<User[]> {
        this.prepareListConfig_(selector);

        const users = await super.list(selector, {
            ...config,
            relations: ['store'], 
        });

        // Include the store name in each user object
        users.forEach(user => {
            if (user.store) {
                (user as any).store_name = user.store.name;
            }
        });

        return users;
    }

    async listAndCount(
        selector?: Selector<User> & { q?: string },
        config?: FindConfig<FilterableUserProps>
    ): Promise<[User[], number]> {
        this.prepareListConfig_(selector);

        const [users, count] = await super.listAndCount(selector, {
            ...config,
            relations: ['store'], 
        });

        users.forEach(user => {
            if (user.store) {
                (user as any).store_name = user.store.name;
            }
        });

        return [users, count];
    }

    async retrieveByEmail(email: string, config: FindConfig<User> = {}): Promise<User> {
        const userRepo = this.activeManager_.withRepository(this.userRepository_);

        const query = buildQuery(
            {
                email: email.toLowerCase(),
                status: UserStatus.ACTIVE,
            },
            config
        );
        const user = await userRepo.findOne(query);

        if (!user) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, `User with email: ${email} was not found`);
        }

        if (user.store) {
            (user as any).store_name = user.store.name;
        }

        return user;
    }

    private prepareListConfig_(selector?: Selector<User>) {
        selector = selector || {};

        if (this.loggedInUser_?.store_id && !selector.store_id) {
            selector.store_id = this.loggedInUser_.store_id;
        }

    }
}

export default UserService;
