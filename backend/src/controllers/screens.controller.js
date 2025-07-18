import fs from 'fs';
import path from 'path';

const registryPath = path.resolve('./src/registry.json'); 
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

import Tenant from "../models/tenant.model.js";


export const getScreens = async (req, res) => {
  try {
    
    const tenant = await Tenant.findById(req.user.customerId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    
    const registryEntry = registry.find(
      entry => entry.tenant === tenant.name
    );

    if (!registryEntry) {
      return res.json([]);
    }

    
    res.json(registryEntry.screens); 
  } catch (error) {
    console.error("Error in getScreens controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

