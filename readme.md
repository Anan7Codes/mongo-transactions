# Mongo Transactions Test

A simple test project demonstrating MongoDB transactions.

## Folder Structure
- `controllers/`, `models/`, `routes/`: Standard MVC structure.
- `config/`: Database configuration.
- `main.js`: App entry point.

## Getting Started

1. Install dependencies:
   ```bash
   yarn
   ```
2. Run in development mode:
   ```bash
   yarn dev
   ```

## Environment Variables

Create a `.env` file in the project root to store your environment-specific variables (such as database connection strings, secret keys, etc.). Can check `.env.local` for reference.

## Sample API Requests

### Create User
```bash
curl --location 'http://localhost:3000/user/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Anandhu",
    "email": "a@b.com"
}'
```

### Wallet Topup
```bash
curl --location 'http://localhost:3000/wallet/topup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "a@b.com",
    "amount": 500
}'
```

### Create Bills
```bash
curl --location 'http://localhost:3000/bills' \
--header 'Content-Type: application/json' \
--data '{
    "userId": "<USER_ID_PLACEHOLDER>",
    "bills": [30, 50, 20]
}'
```

### Pay Bills
```bash
curl --location 'http://localhost:3000/bills/pay' \
--header 'Content-Type: application/json' \
--data '{
    "billIds": ["<BILL_ID_1>", "<BILL_ID_2>"],
    "userId": "<USER_ID_PLACEHOLDER>"
}'
```