import SupportTicket from "../models/supportTicket.model.js";


const validateTicketInput = (data) => {
  const errors = {};
  if (!data.title || data.title.trim() === "") {
    errors.title = "Title is required";
  }
  if (!data.description || data.description.trim() === "") {
    errors.description = "Description is required";
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};


export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;

    
    const { errors, isValid } = validateTicketInput({ title, description });
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newTicket = new SupportTicket({
      title,
      description,
      customerId: req.user.customerId,
      createdBy: req.user._id,
      status: "open", 
    });

    const savedTicket = await newTicket.save();

    

    return res.status(201).json(savedTicket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ customerId: req.user.customerId });
    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      customerId: req.user.customerId,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const updateData = req.body;

    
    const ticket = await SupportTicket.findOne({
      _id: ticketId,
      customerId: req.user.customerId,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    
    if (updateData.title !== undefined) ticket.title = updateData.title;
    if (updateData.description !== undefined) ticket.description = updateData.description;
    if (updateData.status !== undefined) ticket.status = updateData.status;

    const updatedTicket = await ticket.save();

    

    return res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const ticket = await SupportTicket.findOneAndDelete({
      _id: ticketId,
      customerId: req.user.customerId,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
