# Anythink and Medusa Blueprint

# MedusaJS Project Setup Guide 🚀

This guide will walk you through setting up and running the four applications in the MedusaJS project locally. Follow the steps below to get started. The project consists of the following components:

- **Medusa/Mercur API**: The backend API handling all business logic.
- **Mercur Admin UI**: The user interface for administrators to manage the stores, products, overlook everything.
- **Mercur Vendor UI**: The user interface for vendors to manage their products.
- **Medusa Storefront**: The customer-facing e-commerce website.

Each component can be run locally, tested, and deployed independently. Let's get started! 💻

## 1. Clone the Repository 📦

First, clone the main repository that contains all the applications.

```bash
git clone git@github.com:Better-Design-Digital/medusa-v1.git
cd medusa-v1
```

## 2. Setup and Run the Medusa API 🛠️

Navigate to the Medusa API directory and set it up.

```bash
cd medusajs-api
```

### 2.1. Configure Environment Variables 🌍

Copy the environment template to create your `.env` file.

```bash
cp .env.template .env
```

Make sure to fill in the `DATABASE_URL` with your Postgres database connection string:

```env
DATABASE_URL=postgres://user:password@localhost:5432/yourdatabase
```

### 2.2. Install Dependencies 📦

Install the required packages using Yarn.

```bash
yarn install
```

### 2.3. Build the Admin and Vendor UIs 🏗️

Before running the API, build the admin and vendor UIs:

```bash
yarn run build:admin && yarn run build:vendor
```

### 2.4. Run Migrations and Seed the Database 🌱

To ensure the database is up to date with the latest schema:

```bash
yarn medusa migrations run
```

To seed the database with initial data (including creating a default admin user):

```bash
yarn seed
```

💡 **Default Admin User Created During Seeding:**

- **Email**: `admin@medusa-test.com`
- **Password**: `supersecret`

### 2.5. Run the Medusa API Server 🚀

You can now start the Medusa API. **Run this in a separate terminal**:

For production:

```bash
yarn start
```

For development:

```bash
yarn dev
```

🔗 **Running the Vendor UI in Medusa API**:  
You can also run the Vendor UI within the Medusa API using the command below:

```bash
yarn dev:vendor
```

However, **we recommend using the separate, more comprehensive [Vendor UI](#4-setup-and-run-the-vendor-ui-) for a better experience**.

## 3. Setup and Run the Admin UI 🖥️

**In a new terminal**, navigate to the Admin UI directory:

```bash
cd mercur-admin-starter
```

### 3.1. Configure Environment Variables 🌍

Copy the environment template to create your `.env` file:

```bash
cp sample.env .env
```

Ensure the `VITE_BACKEND_URL` is pointing to your local Medusa API:

```env
VITE_BACKEND_URL=http://localhost:9000
```

### 3.2. Install Dependencies 📦

```bash
yarn
```

### 3.3. Run the Admin UI 🚀

**Run this in a separate terminal**:

```bash
yarn dev
```

💡 **Note:** While the Medusa API includes a basic admin UI, this separate Admin UI provides a more robust interface for administrators.

## 4. Setup and Run the Vendor UI 🛍️

**In a new terminal**, navigate to the Vendor UI directory:

```bash
cd mercur-vendor-starter
```

### 4.1. Configure Environment Variables 🌍

Copy the environment template to create your `.env` file:

```bash
cp sample.env .env
```

Ensure the `VITE_BACKEND_URL` is pointing to your local API:

```env
VITE_BACKEND_URL=http://localhost:9000
```

### 4.2. Install Dependencies 📦

```bash
yarn
```

### 4.3. Run the Vendor UI 🚀

**Run this in a separate terminal**:

```bash
yarn dev
```


💡 **Note:** Although you can run a basic Vendor UI via the Medusa API (`yarn dev:vendor`), this separate Vendor UI provides a more complete and tailored interface for vendors.

## 5. Setup and Run the Storefront 🛒

**In a new terminal**, navigate to the Storefront directory:

```bash
cd medusajs-storefront
```

### 5.1. Configure Environment Variables 🌍

Copy the environment template to create your `.env.local` file:

```bash
cp .env.local.template .env.local
```

Ensure the `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_BASE_URL` are correctly set:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

### 5.2. Install Dependencies 📦

```bash
yarn
```

### 5.3. Run the Storefront 🚀

**Run this in a separate terminal**:

```bash
yarn dev
```

## 6. How These Components Work Together 🧩

- **Mercur/Medusa API**: Acts as the core of the system, handling all data and business logic.
- **Mercur Admin UI**: Piggy backs of off the Medusa API/Admin. Provides administrators with a dashboard to manage products, orders, and other store-related tasks.
- **Mercur Vendor UI**: Piggy backs of off the Medusa API/Admin. Offers vendors a separate interface to manage their own products.
- **Medusa Storefront**: The frontend that customers interact with, displaying products and handling the checkout process.

Each component interacts with the Medusa API, which serves as the backend for both the UIs and the Storefront. The system is designed to be modular, allowing each part to be deployed and scaled independently.

🎉 **Congratulations!** You now have a fully functional local setup of the MedusaJS Marketplace project!
