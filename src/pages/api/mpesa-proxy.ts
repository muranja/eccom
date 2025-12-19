export const prerender = false; // Allow server-side execution

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();

        // 1. Get the real webhook URL from server environment
        // Note: On the server (SSR), we can access private env vars if needed.
        // But we stick to public for consistency with previous steps.
        const WEBHOOK_URL = import.meta.env.PUBLIC_N8N_WEBHOOK_URL;

        if (!WEBHOOK_URL) {
            return new Response(JSON.stringify({ error: "Server Configuration Error: Missing Webhook URL" }), {
                status: 500,
            });
        }

        // 2. Forward to n8n (Server-to-Server, bypassing CORS)
        const n8nResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!n8nResponse.ok) {
            const errorText = await n8nResponse.text();
            return new Response(JSON.stringify({ error: `n8n Error: ${n8nResponse.statusText}`, details: errorText }), {
                status: n8nResponse.status,
            });
        }

        // 3. Return success to frontend
        const data = await n8nResponse.json().catch(() => ({ success: true })); // Handle empty success responses
        return new Response(JSON.stringify(data), {
            status: 200,
        });

    } catch (error) {
        console.error("Proxy Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error during Proxy" }), {
            status: 500,
        });
    }
};
