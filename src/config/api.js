const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyOKy3J6HojIMRcghDi4O0AInzLdj1dOw8tUWrsiDuRM1ydQWJTCAUqkZ1zNBlYvFqo/exec";

/* ---------------------------------------
   COMMON HELPERS
--------------------------------------- */
async function getJSON(url) {
  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`GET failed: ${res.status}`);
  }

  return await res.json();
}

async function postJSON(body) {
  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`POST failed: ${response.status}`);
  }

  return await response.json();
}

/* ---------------------------------------
   PRODUCTS
--------------------------------------- */
export async function fetchProducts() {
  try {
    const data = await getJSON(`${SCRIPT_URL}?action=products`);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.data)) return data.data;

    return [];
  } catch (error) {
    console.error("fetchProducts error:", error);
    return [];
  }
}

/* ---------------------------------------
   PLACE PRODUCT ORDER
--------------------------------------- */
export async function placeOrder(orderPayload) {
  try {
    const payload = {
      action: "placeOrder",
      ...orderPayload,
    };

    return await postJSON(payload);
  } catch (error) {
    console.error("placeOrder error:", error);
    return {
      success: false,
      message: "Failed to place order",
    };
  }
}

/* ---------------------------------------
   CUSTOMER ORDERS
--------------------------------------- */
export async function fetchOrdersByPhone(phone) {
  try {
    if (!phone) return [];

    const data = await getJSON(
      `${SCRIPT_URL}?action=orders&phone=${encodeURIComponent(phone)}`
    );

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.orders)) return data.orders;

    return [];
  } catch (error) {
    console.error("fetchOrdersByPhone error:", error);
    return [];
  }
}

/* ---------------------------------------
   SUBSCRIPTIONS
--------------------------------------- */
export async function addSubscription(subscriptionPayload) {
  try {
    const payload = {
      action: "addSubscription",
      ...subscriptionPayload,
    };

    return await postJSON( payload);
  } catch (error) {
    console.error("addSubscription error:", error);
    return {
      success: false,
      message: "Failed to create subscription",
    };
  }
}

export async function fetchSubscriptionsByPhone(phone) {
  try {
    if (!phone) return [];

    const data = await getJSON(
      `${SCRIPT_URL}?action=subscriptions&phone=${encodeURIComponent(phone)}`
    );

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.subscriptions)) return data.subscriptions;

    return [];
  } catch (error) {
    console.error("fetchSubscriptionsByPhone error:", error);
    return [];
  }
}

export async function updateSubscriptionStatus(subscriptionId, status) {
  try {
    const payload = {
      action: "updateSubscriptionStatus",
      subscriptionId,
      status,
    };

    return await postJSON( payload);
  } catch (error) {
    console.error("updateSubscriptionStatus error:", error);
    return {
      success: false,
      message: "Failed to update subscription status",
    };
  }
}

/* ---------------------------------------
   ADMIN - ORDERS
--------------------------------------- */
export async function fetchAllOrders() {
  try {
    const data = await getJSON(`${SCRIPT_URL}?action=allOrders`);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.orders)) return data.orders;

    return [];
  } catch (error) {
    console.error("fetchAllOrders error:", error);
    return [];
  }
}

/* ---------------------------------------
   UPDATE ORDER STATUS
--------------------------------------- */

export async function updateOrderStatus(orderId, status) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "updateDeliveryStatus",
        orderId,
        status,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("updateOrderStatus:", error);

    return {
      success: false,
      message: "Unable to update status.",
    };
  }
}

/* ---------------------------------------
   ADMIN - SUBSCRIPTIONS
--------------------------------------- */
export async function fetchAllSubscriptions() {
  try {
    const data = await getJSON(`${SCRIPT_URL}?action=allSubscriptions`);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.subscriptions))
      return data.subscriptions;

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
/* ---------------------------------------
   ADMIN - CUSTOMERS
--------------------------------------- */
export async function fetchAllCustomers() {
  try {
    const data = await getJSON(`${SCRIPT_URL}?action=allCustomers`);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.customers)) return data.customers;

    return [];
  } catch (error) {
    console.error("fetchAllCustomers error:", error);
    return [];
  }
}

/* ---------------------------------------
   ADMIN - BILLING
--------------------------------------- */
export async function fetchBilling() {
  try {
    const data = await getJSON(`${SCRIPT_URL}?action=billing`);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.billing)) return data.billing;

    return [];
  } catch (error) {
    console.error("fetchBilling error:", error);
    return [];
  }
}

export async function updateBillingStatus(subscriptionId, billingStatus) {
  try {
    const payload = {
      action: "updateBillingStatus",
      subscriptionId,
      billingStatus,
    };

    return await postJSON( payload);
  } catch (error) {
    console.error("updateBillingStatus error:", error);
    return {
      success: false,
      message: "Failed to update billing status",
    };
  }
}

/* ---------------------------------------
   ADMIN - PRODUCTS
--------------------------------------- */
export async function updateProduct(productPayload) {
  try {
    const payload = {
      action: "updateProduct",
      ...productPayload,
    };

    return await postJSON( payload);
  } catch (error) {
    console.error("updateProduct error:", error);
    return {
      success: false,
      message: "Failed to update product",
    };
  }
}
/* ---------------------------------------
   ADD PRODUCT
--------------------------------------- */
export async function addProduct(product) {
  try {
    return await postJSON( {
      action: "addProduct",
      ...product,
    });
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to add product",
    };
  }
}

/* ---------------------------------------
   DELETE PRODUCT
--------------------------------------- */
export async function deleteProduct(productId) {
  try {
    return await postJSON( {
      action: "deleteProduct",
      productId,
    });
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to delete product",
    };
  }
}

export async function updateDeliveryStatus(refId, status) {
  const payload = {
    action: "updateDeliveryStatus",
    refId,
    status,
  };

  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return await res.json();
}

/* ---------------------------------------
   ASSIGN DELIVERY BOY
--------------------------------------- */

export async function assignDeliveryBoy(
  orderId,
  deliveryBoy,
  mobile
) {
  try {
    return await postJSON( {
      action: "assignDeliveryBoy",
      orderId,
      deliveryBoy,
      mobile,
    });
  } catch (error) {
    console.error("assignDeliveryBoy:", error);

    return {
      success: false,
      message: "Unable to assign delivery boy.",
    };
  }
}
/* ---------------------------------------
   TODAY DELIVERIES
--------------------------------------- */

export async function fetchTodayDeliveries(deliveryBoy) {
  try {
    const data = await getJSON(
      `${SCRIPT_URL}?action=todayDeliveries&deliveryBoy=${encodeURIComponent(
        deliveryBoy
      )}`
    );

    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.deliveries)) return data.deliveries;

    return [];
  } catch (error) {
    console.error("fetchTodayDeliveries:", error);
    return [];
  }
}
/* ---------------------------------------
   FETCH DELIVERY BOYS
--------------------------------------- */
export async function fetchDeliveryBoys() {
  try {
    const data = await getJSON(`${SCRIPT_URL}?action=deliveryBoys`);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.deliveryBoys)) return data.deliveryBoys;

    return [];
  } catch (error) {
    console.error("fetchDeliveryBoys:", error);
    return [];
  }
}
export async function fetchOrders() {
  try {
    const data = await getJSON(`${SCRIPT_URL}?action=allOrders`);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.orders)) return data.orders;

    return [];
  } catch (error) {
    console.error("fetchOrders:", error);
    return [];
  }
}
export async function fetchNotifications(phone) {
  return await getJSON(
    `${SCRIPT_URL}?action=getNotifications&phone=${encodeURIComponent(phone)}`
  );
}
export async function createNotification(notification) {
  return await postJSON({
    action: "createNotification",
    ...notification,
  });
}
export async function markNotificationRead(id) {
  return await postJSON({
    action: "markNotificationRead",
    id,
  });
}
export async function deleteNotification(id) {
  return await postJSON({
    action: "deleteNotification",
    id,
  });
}
export async function sendBroadcastNotification(notification) {
  return await postJSON({
    action: "broadcastNotification",
    ...notification,
  });
}
export async function markAllNotificationsRead(customerPhone) {
  return await postJSON({
    action: "markAllNotificationsRead",
    customerPhone,
  });
}

export async function markNotificationUnread(id) {
  return await postJSON({
    action: "markNotificationUnread",
    id,
  });
}

export async function clearNotifications(customerPhone) {
  return await postJSON({
    action: "clearNotifications",
    customerPhone,
  });
}

export async function deleteMultipleNotifications(ids) {
  return await postJSON({
    action: "deleteMultipleNotifications",
    ids,
  });
}
