import prisma from "../src/lib/prisma";

async function testSignup() {
  console.log("🧪 Testing Sign-Up Requirements...\n");

  try {
    // Test 1: Database Connection
    console.log("1️⃣ Testing database connection...");
    await prisma.$connect();
    console.log("   ✅ Database connected successfully\n");

    // Test 2: Check Collections
    console.log("2️⃣ Checking database collections...");
    const collections = await prisma.$runCommandRaw({
      listCollections: 1,
    });
    const collectionNames = collections.cursor.firstBatch.map(
      (c: any) => c.name
    );
    console.log("   Found collections:", collectionNames.join(", "));

    const requiredCollections = ["users", "accounts", "sessions"];
    const missingCollections = requiredCollections.filter(
      (name) => !collectionNames.includes(name)
    );

    if (missingCollections.length > 0) {
      console.log(
        `   ⚠️  Missing collections: ${missingCollections.join(", ")}`
      );
      console.log("   These will be created automatically on first use.\n");
    } else {
      console.log("   ✅ All required collections exist\n");
    }

    // Test 3: Test User Creation
    console.log("3️⃣ Testing user creation (dry run)...");
    const testEmail = `test-${Date.now()}@example.com`;

    try {
      const user = await prisma.user.create({
        data: {
          email: testEmail,
          name: "Test User",
          emailVerified: false,
        },
      });
      console.log("   ✅ User creation test successful");
      console.log(`   Created test user: ${user.email} (ID: ${user.id})\n`);

      // Test 4: Test Account Creation
      console.log("4️⃣ Testing account creation (dry run)...");
      const account = await prisma.account.create({
        data: {
          accountId: testEmail,
          providerId: "credential",
          userId: user.id,
          password: "$2a$10$testHashedPassword", // Fake hash for testing
        },
      });
      console.log("   ✅ Account creation test successful");
      console.log(
        `   Created test account for: ${testEmail} (Provider: ${account.providerId})\n`
      );

      // Clean up test data
      console.log("5️⃣ Cleaning up test data...");
      await prisma.account.delete({ where: { id: account.id } });
      await prisma.user.delete({ where: { id: user.id } });
      console.log("   ✅ Test data cleaned up\n");

      console.log("✅ All tests passed! Sign-up should work correctly.\n");
      console.log("📋 Next steps:");
      console.log("   1. Make sure your .env has BETTER_AUTH_SECRET");
      console.log("   2. Restart your dev server: npm run dev");
      console.log("   3. Try signing up at http://localhost:3000/sign-up");
    } catch (error: any) {
      console.error("   ❌ Database operation failed:", error.message);
      throw error;
    }
  } catch (error: any) {
    console.error("\n❌ Test failed:", error.message);
    console.error("\nTroubleshooting steps:");
    console.error("1. Check your DATABASE_URL in .env");
    console.error("2. Verify MongoDB is accessible");
    console.error("3. Run: npm run db:generate");
    console.error("4. Check MongoDB Atlas network access");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testSignup();

