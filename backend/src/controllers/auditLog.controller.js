import AuditLog from "../models/auditLog.model.js";


export const createAuditLog = async ({ action, userId, tenant, details }) => {
  try {
    const logEntry = new AuditLog({
      action,
      userId,
      tenant,
      details,
      timestamp: new Date(),
    });

    await logEntry.save();
    return logEntry;
  } catch (error) {
    console.error("Audit Log creation error:", error);
    
    throw error;
  }
};


export const getAuditLogs = async (req, res) => {
  try {
    const tenantId = req.user.customerId;
    const logs = await AuditLog.find({ tenant: tenantId })
      .sort({ timestamp: -1 })
      .limit(100); 

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
