import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import StoreService from '../../services/store';

/**
 * @oas [get] /stores
 * operationId: "GetStores"
 * summary: "Retrieve all stores"
 * description: "Retrieves a list of all stores."
 * tags:
 *   - Store
 * responses:
 *   200:
 *     description: "A list of stores."
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Store"
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    const stores = await storeService.listStores();
    res.status(200).json({ stores });
};
