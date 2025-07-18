

export const tenantDataFilter = (req, res, next) => {
  try {
    if (!req.user || !req.user.customerId) {
      return res.status(401).json({ message: "Unauthorized - Tenant information missing" });
    }

    req.customerId = req.user.customerId;

    next();
  } catch (error) {
    console.error("Error in tenantDataFilter middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
