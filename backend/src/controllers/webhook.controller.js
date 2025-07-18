import SupportTicket from "../models/supportTicket.model.js";

export const ticketDoneWebhookHandler = async (req, res) => {
  try {
    const { ticketId, status, ...otherData } = req.body;

    if (!ticketId || !status) {
      return res.status(400).json({ message: "ticketId and status are required" });
    }

    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status;


    await ticket.save();


    return res.status(200).json({ message: "Ticket updated successfully" });
  } catch (error) {
    console.error("Error handling ticket-done webhook:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
