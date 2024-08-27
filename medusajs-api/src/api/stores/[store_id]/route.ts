import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import StoreService from '../../../services/store';
import { User } from '../../../models/user';

/**
 * @oas [get] /stores/{store_id}
 * operationId: "GetStoreWithProducts"
 * summary: "Retrieve a specific store and its products"
 * description: "Retrieves a specific store by ID and includes all its associated products."
 * tags:
 *   - Store
 * parameters:
 *   - in: path
 *     name: store_id
 *     required: true
 *     description: The ID of the store to retrieve.
 *     schema:
 *       type: string
 * responses:
 *   200:
 *     description: "The store and its products."
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             store:
 *               $ref: "#/components/schemas/Store"
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const { store_id } = req.params;
    const storeService: StoreService = req.scope.resolve('storeService');
    
    try {
        const store = await storeService.retrieveStoreWithProducts(store_id);
        res.status(200).json({ store });
    } catch (error) {
        res.status(404).json({ error: 'Store not found' });
    }
};

/**
 * @oas [put] /stores/{store_id}
 * operationId: "UpdateStoreName"
 * summary: "Update Store Name"
 * description: "Allows a store owner to update the name of their store."
 * tags:
 *   - Store
 * parameters:
 *   - in: path
 *     name: store_id
 *     required: true
 *     description: The ID of the store.
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *             description: "The new name of the store."
 * responses:
 *   200:
 *     description: "The updated store."
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/Store"
 */
export const PUT = async (req: MedusaRequest<{ name: string }>, res: MedusaResponse) => {
    const { store_id } = req.params;
    const { name } = req.body;
    const storeService: StoreService = req.scope.resolve('storeService');

    try {
        const user = req.scope.resolve('loggedInUser') as User | null;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: No logged-in user found' });
        }

        if (user.store_id !== store_id) {
            return res.status(403).json({ error: 'You do not have permission to update this store' });
        }

        const updatedStore = await storeService.updateStoreName(store_id, name);

        res.status(200).json({ store: updatedStore });
    } catch (error) {
        console.error('Error occurred while updating store name:', error);
        res.status(400).json({ error: error.message });
    }
};
