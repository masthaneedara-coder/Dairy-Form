import { STORAGE_KEYS, USER_ROLES } from "./appConfig";

export const isCustomerLoggedIn = () =>
  localStorage.getItem(STORAGE_KEYS.CUSTOMER_LOGIN) === "true";

export const setCustomerLogin = ({ name, phone }) => {
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_LOGIN, "true");
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, USER_ROLES.CUSTOMER);
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_NAME, name || "");
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_PHONE, phone || "");
};

export const getCustomerName = () =>
  localStorage.getItem(STORAGE_KEYS.CUSTOMER_NAME) || "";

export const getCustomerPhone = () =>
  localStorage.getItem(STORAGE_KEYS.CUSTOMER_PHONE) || "";

export const logoutCustomer = () => {
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_LOGIN);
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_NAME);
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_PHONE);
};

export const setRedirectAfterLogin = (path) => {
  localStorage.setItem(STORAGE_KEYS.REDIRECT_AFTER_LOGIN, path);
};

export const getRedirectAfterLogin = () =>
  localStorage.getItem(STORAGE_KEYS.REDIRECT_AFTER_LOGIN) || "";

export const clearRedirectAfterLogin = () => {
  localStorage.removeItem(STORAGE_KEYS.REDIRECT_AFTER_LOGIN);
};

export const setAdminLogin = ({ name }) => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_LOGIN, "true");
  localStorage.setItem(STORAGE_KEYS.ADMIN_NAME, name || "Admin");
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, USER_ROLES.ADMIN);
};

export const isAdminLoggedIn = () =>
  localStorage.getItem(STORAGE_KEYS.ADMIN_LOGIN) === "true";

export const logoutAdmin = () => {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGIN);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_NAME);
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
};

export const setDeliveryLogin = ({ name, phone }) => {
  localStorage.setItem(STORAGE_KEYS.DELIVERY_LOGIN, "true");
  localStorage.setItem(STORAGE_KEYS.DELIVERY_NAME, name || "");
  localStorage.setItem(STORAGE_KEYS.DELIVERY_PHONE, phone || "");
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, USER_ROLES.DELIVERY);
};

export const isDeliveryLoggedIn = () =>
  localStorage.getItem(STORAGE_KEYS.DELIVERY_LOGIN) === "true";

export const logoutDelivery = () => {
  localStorage.removeItem(STORAGE_KEYS.DELIVERY_LOGIN);
  localStorage.removeItem(STORAGE_KEYS.DELIVERY_NAME);
  localStorage.removeItem(STORAGE_KEYS.DELIVERY_PHONE);
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
};
export const getDeliveryName = () =>
  localStorage.getItem(STORAGE_KEYS.DELIVERY_NAME) || "";

export const getDeliveryPhone = () =>
  localStorage.getItem(STORAGE_KEYS.DELIVERY_PHONE) || "";