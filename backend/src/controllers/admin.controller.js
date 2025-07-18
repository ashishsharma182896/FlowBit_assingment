import Tenant from "../models/tenant.model.js";
import SupportTicket from "../models/supportTicket.model.js";


export const getTenantDetails = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.customerId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.status(200).json(tenant);
  } catch (error) {
    console.error("Error fetching tenant details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllTenantTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ customerId: req.user.customerId });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tenant tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


