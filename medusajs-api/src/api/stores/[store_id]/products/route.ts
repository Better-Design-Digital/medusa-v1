import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import ProductService from '../../../../services/product';
import { User } from '../../../../models/user';

type CreateProductRequest = {
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
        }[];
    }[];
    shipping_options?: string[];
};

type Params = {
    store_id: string;
};

/**
 * @oas [post] /stores/{store_id}/products
 * operationId: "CreateStoreProduct"
 * summary: "Create a Product for a Store"
 * description: "Allows a store user to create a product linked to their store."
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
 *         $ref: "#/components/schemas/CreateProductRequest"
 * responses:
 *   200:
 *     description: "The created product."
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/Product"
 */
export const POST = async (req: MedusaRequest<CreateProductRequest>, res: MedusaResponse) => {
    const { store_id } = req.params as Params;
    const productService: ProductService = req.scope.resolve('productService');

    try {
        const user = req.scope.resolve('loggedInUser') as User | null;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: No logged-in user found' });
        }

        if (user.store_id !== store_id) {
            return res.status(403).json({ error: 'You do not have permission to create products for this store' });
        }

        const formattedProductRequest = {
            ...req.body,
            variants: req.body.variants.map(variant => ({
                ...variant,
                options: variant.options.map(option => ({
                    value: option.value
                }))
            }))
        };

        const product = await productService.createProductForStore(formattedProductRequest, store_id);

        res.status(200).json({ product });
    } catch (error) {
        console.error('Error occurred while creating product:', error);
        res.status(400).json({ error: error.message });
    }
};
