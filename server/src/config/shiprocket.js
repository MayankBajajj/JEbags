const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

// Shiprocket tokens are valid ~10 days; refresh a little early to be safe.
const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000;

let cachedToken = null;
let cachedTokenExpiresAt = 0;

export function isConfigured() {
  return Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
}

async function login() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    throw new Error(data.message || `Shiprocket login failed (${res.status})`);
  }
  return data.token;
}

async function getToken(forceRefresh = false) {
  if (!forceRefresh && cachedToken && Date.now() < cachedTokenExpiresAt) {
    return cachedToken;
  }
  cachedToken = await login();
  cachedTokenExpiresAt = Date.now() + TOKEN_TTL_MS;
  return cachedToken;
}

// Retries once with a freshly-fetched token if the cached one was rejected.
async function request(path, options = {}) {
  if (!isConfigured()) throw new Error("Shiprocket is not configured — set SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD");

  const attempt = async (token) =>
    fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

  let token = await getToken();
  let res = await attempt(token);
  if (res.status === 401) {
    token = await getToken(true);
    res = await attempt(token);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Shiprocket request failed (${res.status})`);
  }
  return data;
}

// Package weight/dimensions aren't tracked per-product yet, so every order
// ships with this placeholder box until that's added — override via env
// vars without a code change in the meantime.
const DEFAULTS = {
  weightKg: Number(process.env.SHIPROCKET_DEFAULT_WEIGHT_KG) || 0.5,
  lengthCm: Number(process.env.SHIPROCKET_DEFAULT_LENGTH_CM) || 30,
  breadthCm: Number(process.env.SHIPROCKET_DEFAULT_BREADTH_CM) || 25,
  heightCm: Number(process.env.SHIPROCKET_DEFAULT_HEIGHT_CM) || 10,
};

function formatOrderDate(date) {
  // Shiprocket wants "YYYY-MM-DD HH:mm" in local (IST) time.
  const istMs = date.getTime() + (5.5 * 60 + date.getTimezoneOffset()) * 60 * 1000;
  const ist = new Date(istMs);
  const pad = (n) => String(n).padStart(2, "0");
  return `${ist.getFullYear()}-${pad(ist.getMonth() + 1)}-${pad(ist.getDate())} ${pad(ist.getHours())}:${pad(ist.getMinutes())}`;
}

export async function createShiprocketOrder(order, user) {
  if (!process.env.SHIPROCKET_PICKUP_LOCATION) {
    throw new Error("SHIPROCKET_PICKUP_LOCATION is not set — this must match a pickup address nickname in Shiprocket");
  }

  const addr = order.shippingAddress;
  const payload = {
    order_id: order._id.toString(),
    order_date: formatOrderDate(order.createdAt || new Date()),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
    billing_customer_name: user?.name || "Customer",
    billing_last_name: "",
    billing_address: addr.line1,
    billing_address_2: addr.line2 || "",
    billing_city: addr.city,
    billing_pincode: addr.pincode,
    billing_state: addr.state,
    billing_country: addr.country || "India",
    billing_email: user?.email || "",
    billing_phone: addr.phone,
    shipping_is_billing: true,
    order_items: order.items.map((item) => ({
      name: item.name,
      sku: item.product.toString(),
      units: item.quantity,
      selling_price: item.price,
    })),
    payment_method: "Prepaid",
    sub_total: order.totalAmount,
    length: DEFAULTS.lengthCm,
    breadth: DEFAULTS.breadthCm,
    height: DEFAULTS.heightCm,
    weight: DEFAULTS.weightKg,
  };

  return request("/orders/create/adhoc", { method: "POST", body: JSON.stringify(payload) });
}

export async function trackShipmentById(shipmentId) {
  return request(`/courier/track/shipment/${shipmentId}`);
}

export async function cancelShiprocketOrder(shiprocketOrderId) {
  return request("/orders/cancel", {
    method: "POST",
    body: JSON.stringify({ ids: [Number(shiprocketOrderId)] }),
  });
}

// Shiprocket's webhook config lets you set a static "Secret Key" that it
// echoes back on every call (sent as the x-api-key header) — simple shared-
// secret check, not an HMAC signature like Razorpay's webhook.
export function verifyWebhookToken(token) {
  return Boolean(process.env.SHIPROCKET_WEBHOOK_SECRET) && token === process.env.SHIPROCKET_WEBHOOK_SECRET;
}
