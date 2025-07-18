
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Tenant from "./src/models/tenant.model.js";
import User from "./src/models/user.model.js";

const mongoUri = process.env.MONGODB_URI || "mongodb+srv://sharmaashish20635:8Tgp3nXccppOqdql@cluster0.bosbqtm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const tenants = [
  { name: "LogisticsCo" },
  { name: "RetailGmbH" }
];

const admins = [
  {
    fullName: "Ashish Sharma",
    email: "sharmaashish20635@gmail.com",
    password: "password123", 
    tenantName: "LogisticsCo",
  },
  {
    fullName: "Rahul Kumar",
    email: "r39646881@gmail.com",
    password: "password123",
    tenantName: "RetailGmbH",
  }
];

const runSeeder = async () => {
  await mongoose.connect(mongoUri);

  
  await Tenant.deleteMany({});
  await User.deleteMany({});

  
  const createdTenants = {};
  for (const t of tenants) {
    const tenant = await Tenant.create(t);
    createdTenants[t.name] = tenant._id;
  }

  
  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    await User.create({
      fullName: admin.fullName,
      email: admin.email,
      password: hashedPassword,
      customerId: createdTenants[admin.tenantName],
      role: "Admin"
    });
  }

  console.log("Seeding complete");
  mongoose.connection.close();
};

runSeeder().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
