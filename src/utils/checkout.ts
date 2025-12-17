import { cartItems, cartTotal } from '../stores/cartStore';

// CONFIGURATION
const PHONE_NUMBER = '254714389231'; // REPLACE with your WhatsApp Business Number
const PAYBILL_NUMBER = '247247';     // REPLACE with your Paybill
const ACCOUNT_NAME = 'TECH-STORE';   // REPLACE with your Account Name

export function proceedToCheckout() {
    // 1. Get current state of the cart
    const items = Object.values(cartItems.get());
    const total = cartTotal.get();

    // Guard clause: Don't checkout if empty
    if (items.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // 2. Start building the message
    // We use standard URL encoding logic here.
    let message = `👋 *New Order Request*\n\n`;
    message += `I would like to purchase the following:\n\n`;

    // 3. Loop through items
    items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (x${item.quantity})\n`;
        message += `   @ KES ${item.price.toLocaleString()} each\n`;
    });

    // 4. Add Summary and Payment Instructions
    message += `\n💰 *TOTAL PAYABLE: KES ${total.toLocaleString()}*\n`;
    message += `\n-----------------------------\n`;
    message += `📝 *PAYMENT DETAILS:*\n`;
    message += `Paybill: ${PAYBILL_NUMBER}\n`;
    message += `Account: ${ACCOUNT_NAME}\n`;
    message += `-----------------------------\n\n`;
    message += `I am making the payment now. Please confirm stock availability.`;

    // 5. Encode for URL
    // encodeURIComponent ensures symbols like &, $, and new lines don't break the link
    const encodedMessage = encodeURIComponent(message);

    // 6. Generate the Final Link
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;

    // 7. Redirect the user
    window.open(whatsappUrl, '_blank');
}
