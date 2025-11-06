/**
 * Test Database Connection
 * 
 * Run this script to verify your MongoDB Atlas connection is working:
 * npx tsx scripts/test-db-connection.ts
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  console.log("🔍 Testing MongoDB Atlas connection...\n");

  try {
    // Test 1: Check if Prisma can connect
    console.log("✓ Testing Prisma connection...");
    await prisma.$connect();
    console.log("✅ Prisma connected successfully!\n");

    // Test 2: Count existing users
    console.log("✓ Checking User collection...");
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} user(s) in database\n`);

    // Test 3: List all users (names only)
    if (userCount > 0) {
      console.log("✓ Fetching user data...");
      const users = await prisma.user.findMany({
        select: {
          name: true,
          email: true,
          createdAt: true,
        },
      });
      console.log("✅ Users in database:");
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name || "No name"} (${user.email})`);
        console.log(`      Created: ${user.createdAt.toLocaleString()}`);
      });
      console.log("");
    }

    // Test 4: Check Session collection
    console.log("✓ Checking Session collection...");
    const sessionCount = await prisma.session.count();
    console.log(`✅ Found ${sessionCount} active session(s)\n`);

    // Test 5: Check Account collection
    console.log("✓ Checking Account collection...");
    const accountCount = await prisma.account.count();
    console.log(`✅ Found ${accountCount} account(s)\n`);

    console.log("🎉 All database tests passed!");
    console.log("\n✅ Your MongoDB Atlas connection is working perfectly!");
    
  } catch (error) {
    console.error("\n❌ Database connection test failed!");
    console.error("\nError details:");
    console.error(error);
    
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check your DATABASE_URL in .env file");
    console.log("2. Ensure your IP is whitelisted in MongoDB Atlas");
    console.log("3. Verify your database user credentials");
    console.log("4. Check if MongoDB Atlas cluster is running");
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection();

