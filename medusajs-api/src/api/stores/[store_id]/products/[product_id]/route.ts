import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import ProductService from '../../../../../services/product';
import { User } from '../../../../../models/user';

type UpdateProductRequest = Partial<{
    title: string;
    description: string;
    status: ProductStatus;
    options: {
        title: string;
        values: string[];
    }[];
    variants: {
        title: string;
        prices: {
            currency_code: string;
            amount: number;
        }[];
        manage_inventory: boolean;
        options: {
            value: string;
            option_id: string; 
        }[];
    }[];
    shipping_options?: string[];
}>;

type Params = {
    store_id: string;
    product_id: string;
};

/**
 * @oas [put] /stores/{store_id}/products/{product_id}
 * operationId: "UpdateStoreProduct"
 * summary: "Update a Product for a Store"
 * description: "Allows a store user to update a product linked to their store."
 * tags:
 *   - Store
 * parameters:
 *   - in: path
 *     name: store_id
 *     required: true
 *     description: The ID of the store.
 *     schema:
 *       type: string
 *   - in: path
 *     name: product_id
 *     required: true
 *     description: The ID of the product.
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/UpdateProductRequest"
 * responses:
 *   200:
 *     description: "The updated product."
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/Product"
 */
export const PUT = async (req: MedusaRequest<UpdateProductRequest>, res: MedusaResponse) => {
    const { store_id, product_id } = req.params as Params;
    const productService: ProductService = req.scope.resolve('productService');

    try {
        const user = req.scope.resolve('loggedInUser') as User | null;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: No logged-in user found' });
        }

        if (user.store_id !== store_id) {
            return res.status(403).json({ error: 'You do not have permission to update products for this store' });
        }

        const formattedProductRequest = {
            ...req.body,
            variants: req.body.variants?.map(variant => ({
                ...variant,
                options: variant.options.map(option => ({
                    value: option.value,
                    option_id: option.option_id 
                }))
            }))
        };

        const product = await productService.update(product_id, formattedProductRequest);

        res.status(200).json({ product });
    } catch (error) {
        console.error('Error occurred while updating product:', error);
        res.status(400).json({ error: error.message });
    }
};

/**
 * @oas [delete] /stores/{store_id}/products/{product_id}
 * operationId: "DeleteStoreProduct"
 * summary: "Delete a Product for a Store"
 * description: "Allows a store user to delete a product linked to their store."
 * tags:
 *   - Store
 * parameters:
 *   - in: path
 *     name: store_id
 *     required: true
 *     description: The ID of the store.
 *     schema:
 *       type: string
 *   - in: path
 *     name: product_id
 *     required: true
 *     description: The ID of the product.
 *     schema:
 *       type: string
 * responses:
 *   200:
 *     description: "The deleted product."
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             object:
 *               type: string
 *               example: product
 *             deleted:
 *               type: boolean
 */
export const DELETE = async (req: MedusaRequest<unknown>, res: MedusaResponse) => {
    const { store_id, product_id } = req.params as Params;
    const productService: ProductService = req.scope.resolve('productService');

    try {
        const user = req.scope.resolve('loggedInUser') as User | null;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: No logged-in user found' });
        }

        if (user.store_id !== store_id) {
            return res.status(403).json({ error: 'You do not have permission to delete products for this store' });
        }

        await productService.delete(product_id);

        res.status(200).json({
            id: product_id,
            object: 'product',
            deleted: true
        });
    } catch (error) {
        console.error('Error occurred while deleting product:', error);
        res.status(400).json({ error: error.message });
    }
};
