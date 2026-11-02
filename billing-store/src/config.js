// One place for the store's WhatsApp number and order message.
// To change the number later, edit WHATSAPP_NUMBER only (country code + number, no + or spaces).
export const WHATSAPP_NUMBER = "919172559072";
export const WHATSAPP_DISPLAY = "+91 91725 59072";

export function whatsappLink(text) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** WhatsApp order text: product name, code, size, category, quantity and a link to the product. */
export function orderMessage(product, quantity, kind = "order") {
  const intro = kind === "quote"
    ? "Hello Jainam Auto Industries, I would like a quote for:"
    : "Hello Jainam Auto Industries, I would like to place an order:";
  const lines = [
    intro,
    "",
    `Product: ${product.name || "-"}`,
    product.productCode ? `Code: ${product.productCode}` : "",
    product.size ? `Size: ${product.size}` : "",
    product.category ? `Category: ${product.category}` : "",
    `Quantity: ${quantity}`,
    "",
    `Link: ${window.location.origin}/store/product/${product.id}`,
  ];
  return lines.filter((line, i) => line !== "" || i === 1 || i === lines.length - 2).join("\n");
}
