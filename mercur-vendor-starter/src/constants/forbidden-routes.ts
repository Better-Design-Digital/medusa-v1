export const forbiddenRoutes = [
  "/products",
  "/products/:id",
  '/product-categories',
  '/product-categories',
  "/orders",
  "/orders/:id",
  '/customers',
  '/customers/:id',
  '/customers/groups',
  '/customers/groups/:id',
  '/discounts',
  '/discounts/new',
  '/discounts/:id',
  '/gift-cards',
  '/gift-cards/:id',
  '/gift-cards/manage',
  "/inventory",
  '/collections',
  '/collections/:id',
  "/draft-orders",
  "/draft-orders/:id",
  "/login",
  "/oauth",
  "/oauth/:app_name",
] as const;

export const isSettingsRoute = (route: string) => {
  return route.startsWith("/settings");
};

export const isForbiddenRoute = (route: any): boolean => {
  if (isSettingsRoute(route)) {
    return true;
  }

  return false;
};
