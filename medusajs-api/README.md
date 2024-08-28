# Introduction

This marketplace starter provides a foundational example to help you build and customize your own marketplace using Medusa.js. Begin your project with this starter template and tailor it to meet your specific needs.

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/create-medusa-app) to set up a server.

Visit the [Docs](https://docs.medusajs.com/development/backend/prepare-environment) to learn more about our system requirements.

## API Overview

This marketplace starter includes several API endpoints for managing stores, products, and users. Below is a summary of the key API endpoints:

- **Base URL:** `http://localhost:9000`
- **Authentication:** All endpoints that modify data (create, update, delete) require authentication via a Bearer token.

### Adding a Vendor User

To add a vendor user via the API, follow these steps:

Make a POST request to the endpoint `/vendor/users` with the following body:

```json
{
  "email": "vendoremail@email.com",
  "password": "vendorpassword"
}
```
After this, an admin will need to approve the vendor before they can log in, via the admin dashboard.

### Authentication

Before making authenticated requests, you must first obtain an access token. This token is used for all subsequent requests that require authorization.

**Endpoint:**
- **URL:** `/admin/auth/token`
- **Method:** `POST`

**Request Example:**
```bash
curl -X POST http://localhost:9000/admin/auth/token \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "your_password"
}'
```

**Response:**
```json
{
  "access_token": "your_access_token"
}
```

### Get All Stores

Retrieve a list of all available stores. This endpoint does not require authentication.

**Endpoint:**
- **URL:** `/stores`
- **Method:** `GET`

**Request Example:**
```bash
curl -X GET http://localhost:9000/stores
```

**Response Example:**
```json
{
  "stores": [
    {
      "id": "store_01J69FP062WK7HPH3XS8EHNNGC",
      "name": "Fruit Hub",
      "default_currency_code": "usd",
      ...
    }
  ]
}
```

### Get a Specific Store with Products

Retrieve a specific store by its ID, along with all its associated products. This operation **requires** authentication with a Bearer token.

**Endpoint:**
- **URL:** `/stores/{store_id}`
- **Method:** `GET`

**Request Example:**
```bash
curl -X GET http://localhost:9000/stores/store_01J69FP062WK7HPH3XS8EHNNGC \
-H "Authorization: Bearer your_access_token"
```

**Response Example:**
```json
{
  "store": {
    "id": "store_01J69FP062WK7HPH3XS8EHNNGC",
    "name": "Fruit Hub",
    "default_currency_code": "usd",
    "products": [
      {
        "id": "prod_01J6ABGGW8VH1FAEW5ZZM79DHG",
        "title": "T-Shirt",
        "description": "A comfortable cotton t-shirt",
        "status": "published",
        ...
      }
    ]
  }
}
```

### Create a Product

Allows a store user to create a product linked to their store. **Authentication is required.**

**Endpoint:**
- **URL:** `/stores/{store_id}/products`
- **Method:** `POST`

**Request Example:**
```bash
curl -X POST http://localhost:9000/stores/store_01J69FP062WK7HPH3XS8EHNNGC/products \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_access_token" \
-d '{
  "title": "New T-Shirt",
  "description": "A comfortable cotton t-shirt",
  "status": "published",
  "options": [
    {
      "title": "Color",
      "values": ["Red", "Blue"]
    }
  ],
  "variants": [
    {
      "title": "T-Shirt Variant",
      "prices": [
        {
          "currency_code": "usd",
          "amount": 2000
        }
      ],
      "manage_inventory": true,
      "options": [
        {
          "value": "Red"
        }
      ]
    }
  ]
}'
```

### Update a Product

Allows a store user to update a product linked to their store. **Authentication is required.**

**Endpoint:**
- **URL:** `/stores/{store_id}/products/{product_id}`
- **Method:** `PUT`

**Request Example:**
```bash
curl -X PUT http://localhost:9000/stores/store_01J69FP062WK7HPH3XS8EHNNGC/products/prod_01J69G5PXPDVP8QMR8169MD6XE \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_access_token" \
-d '{
  "title": "Updated T-Shirt Title",
  "description": "An updated description"
}'
```

### Delete a Product

Allows a store user to delete a product linked to their store. **Authentication is required.**

**Endpoint:**
- **URL:** `/stores/{store_id}/products/{product_id}`
- **Method:** `DELETE`

**Request Example:**
```bash
curl -X DELETE http://localhost:9000/stores/store_01J69FP062WK7HPH3XS8EHNNGC/products/prod_01J69G5PXPDVP8QMR8169MD6XE \
-H "Authorization: Bearer your_access_token"
```

### Update Store Name

Allows a store owner to update the name of their store. **Authentication is required.**

**Endpoint:**
- **URL:** `/stores/{store_id}`
- **Method:** `PUT`

**Request Example:**
```bash
curl -X PUT http://localhost:9000/stores/store_01J69FP062WK7HPH3XS8EHNNGC \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your_access_token" \
-d '{
  "name": "New Store Name"
}'
```

### Store User Authorization Process

To create, update, or delete products in their store, a store user must authenticate themselves using their email and password to obtain an access token. This access token must be included in the Authorization header of each request as a Bearer token.

## User Management

The user management is facilitated by three additional columns in the user table: `is_admin`, `store_id` and `status`. A marketplace admin is identified by the `is_admin` column set to TRUE, and `store_id` set to NULL, indicating an administrative role. Additionally, the `role` column in the user table can be utilized to implement Role-Based Access Control (RBAC) for marketplace and store users. Vendor after register has status set to `pending` and only after admin changes that status to `active` vendor can log in.

## Store Setup

Upon registering, a user's account is linked to a new Store entity. The store owner can then invite additional users to their store using Medusa's invite system, enabling team collaboration.

## Shipping Options

Stores have the ability to create and manage their own shipping options, which are then associated with their products. These shipping options are visible in the product responses to ensure clear communication of shipping terms.

## Product Management

When a product is created, the `store_id` of the currently logged-in user's store is associated with the product. This ensures that all products are correctly linked to their respective stores.

## Order Processing

Upon placing an order, the system automatically generates child orders for each vendor involved. This is achieved by iterating through each line item, checking the `store_id`, and grouping items from the same store into a single order. These child orders are then visible in the respective vendor's dashboard for processing.

Feel free to extend and modify this starter as needed to suit your marketplace requirements.
