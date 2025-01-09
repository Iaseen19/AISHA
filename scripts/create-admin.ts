const bcryptjs = require("bcryptjs");
const { PrismaClient, UserRole } = require("@prisma/client");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = "admin@aisha-therapy.com";
    const password = "Admin@123";
    const name = "Admin";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    console.log("Admin user created successfully:", admin.email);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 