import { Lifetime } from 'awilix';
import { FindConfig, StoreService as MedusaStoreService, Store, buildQuery } from '@medusajs/medusa';
import { User } from '../models/user';
import StoreRepository from '../repositories/store';
import ProductRepository from '../repositories/product';  
import { MedusaError } from 'medusa-core-utils';
import { EntityManager } from 'typeorm';
import { Product } from '../models/product'; 

class StoreService extends MedusaStoreService {
	static LIFE_TIME = Lifetime.TRANSIENT;
	protected readonly loggedInUser_: User | null;
	protected readonly storeRepository_: typeof StoreRepository;
	protected readonly productRepository_: typeof ProductRepository;  

	constructor(container) {
		super(container);
		this.storeRepository_ = container.storeRepository;
		this.productRepository_ = container.productRepository; 

		try {
			this.loggedInUser_ = container.loggedInUser;
		} catch (e) {
			// avoid errors when backend first runs
		}
	}

	async createForUser() {
		return await this.atomicPhase_(async (transactionManager: EntityManager) => {
			const storeRepository = transactionManager.withRepository(this.storeRepository_);
			const currencyRepository = transactionManager.withRepository(this.currencyRepository_);

			const newStore = storeRepository.create();

			const usd = await currencyRepository.findOne({
				where: {
					code: 'usd',
				},
			});

			if (usd) {
				newStore.currencies = [usd];
			}

			return await storeRepository.save(newStore);
		});
	}

	async retrieve(config?: FindConfig<Store>): Promise<Store> {
		if (!this.loggedInUser_?.store_id) {
			return super.retrieve(config);
		}

		return await this.retrieveForLoggedInUser(config);
	}

	/**
	 * Retrieves store by id
	 * @param id
	 * @param config
	 * @returns
	 */
	async retrieve_(id: string, config?: FindConfig<Store>) {
		const storeRepo = this.manager_.withRepository(this.storeRepository_);

		const query = buildQuery({ id }, config);

		const stores = await storeRepo.find(query);

		const store = stores[0];

		if (!store) {
			throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Store not found');
		}

		return store;
	}

	/**
     * Retrieves a list of all stores
     * @param config - configuration for query, e.g., relations, select
     * @returns a list of stores
     */
    async listStores(config?: FindConfig<Store>): Promise<Store[]> {
        const storeRepo = this.manager_.withRepository(this.storeRepository_);
        const query = buildQuery({}, config);
        return await storeRepo.find(query);
    }

	/**
     * Retrieves a specific store by ID and includes all its associated products.
     * @param storeId - the ID of the store to retrieve
     * @returns the store and its products
     */
    async retrieveStoreWithProducts(storeId: string): Promise<Store> {
        return await this.atomicPhase_(async (transactionManager: EntityManager) => {
            const storeRepo = transactionManager.withRepository(this.storeRepository_);
            const productRepo = transactionManager.withRepository(this.productRepository_);

            const store = await storeRepo.findOne({
                where: { id: storeId },
                relations: ['products'],
            });

            if (!store) {
                throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Store not found');
            }

            return store;
        });
    }

	async retrieveForLoggedInUser(config?: FindConfig<Store>) {
		const store = await this.retrieve_(this.loggedInUser_.store_id, {
			relations: [...(config?.relations ?? []), 'members'],
			...config,
		});

		return store;
	}

	/**
     * Updates the name of a store
     * @param storeId - the ID of the store to update
     * @param name - the new name of the store
     * @returns the updated store
     */
    async updateStoreName(storeId: string, name: string): Promise<Store> {
        const storeRepo = this.manager_.withRepository(this.storeRepository_);

        const store = await storeRepo.findOne({
            where: { id: storeId },
        });

        if (!store) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Store not found');
        }

        store.name = name;

        return await storeRepo.save(store);
    }
}

export default StoreService;
