# M-Pesa & n8n Integration Setup

To get the M-Pesa STK Push working without a backend, follow these steps:

## 1. Import the Workflow
1. Open your self-hosted **n8n** instance.
2. Click **Workflows** > **Add Workflow**.
3. Click the three dots (top right) > **Import from File**.
4. Select `n8n_mpesa_workflow.json` from this project folder.

## 2. Configure Credentials (In n8n)
You need to create a **Payment Auth Token** node (not included in JSON for security, you must add it):
1. Add an `HTTP Request` node before the "M-Pesa STK Push" node.
2. URL: `https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`
3. Method: `GET`
4. Authentication: **Basic Auth**.
   - Username: `Consumer Key` (From Safaricom Dev Portal)
   - Password: `Consumer Secret` (From Safaricom Dev Portal)

## 3. Update Project Variables
1. Create a `.env` file in `d:/phoneshop/`:
   ```env
   PUBLIC_N8N_WEBHOOK_URL="https://your-n8n-domain.com/webhook/mpesa-trigger"
   ```
2. Restart the dev server (`npm run dev`).

## 4. Testing
1. Use the **Safaricom Sandbox app** on your phone.
2. Enter your phone number in the checkout.
3. You should receive a prompt to pay KES [Amount].
