# Tern Rewards: Mongo Transactions Test with In-Memory Queue

A simple test project demonstrating MongoDB transactions with an in-memory queue.

## Folder Structure
- `controllers/`, `models/`, `routes/`, `queue/`: Standard MVC structure with queue logic.
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

## Sample API Requests

### Create User
```bash
curl --location 'http://localhost:3000/user/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Anandhu",
    "email": "a@c.com"
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
