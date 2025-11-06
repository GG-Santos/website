import prisma from "../src/lib/prisma";

async function checkAuthData() {
  console.log("🔍 Checking authentication data...\n");

  try {
    // Check users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            accounts: true,
            sessions: true,
          },
        },
      },
    });

    console.log(`📊 Found ${users.length} user(s):\n`);
    
    for (const user of users) {
      console.log(`User: ${user.email}`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Name: ${user.name || "Not set"}`);
      console.log(`  Accounts: ${user._count.accounts}`);
      console.log(`  Sessions: ${user._count.sessions}`);
      console.log(`  Created: ${user.createdAt.toISOString()}\n`);
    }

    // Check accounts
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        providerId: true,
        accountId: true,
        userId: true,
        password: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    console.log(`🔐 Found ${accounts.length} account(s):\n`);
    
    for (const account of accounts) {
      console.log(`Account for: ${account.user.email}`);
      console.log(`  Provider: ${account.providerId}`);
      console.log(`  Account ID: ${account.accountId}`);
      console.log(`  Has Password: ${account.password ? "Yes ✓" : "No ✗"}`);
      console.log(`  User ID: ${account.userId}\n`);
    }

    // Identify issues
    console.log("⚠️  Potential Issues:");
    
    const usersWithoutAccounts = users.filter((u) => u._count.accounts === 0);
    if (usersWithoutAccounts.length > 0) {
      console.log(
        `\n❌ ${usersWithoutAccounts.length} user(s) without Account records:`
      );
      usersWithoutAccounts.forEach((u) => {
        console.log(`   - ${u.email}`);
      });
      console.log(
        "\n   This means they cannot sign in with email/password."
      );
      console.log(
        "   Solution: Have them sign up again using the sign-up form."
      );
    }

    const accountsWithoutPassword = accounts.filter((a) => !a.password);
    if (accountsWithoutPassword.length > 0) {
      console.log(
        `\n❌ ${accountsWithoutPassword.length} account(s) without passwords:`
      );
      accountsWithoutPassword.forEach((a) => {
        console.log(`   - ${a.user.email} (Provider: ${a.providerId})`);
      });
    }

    const credentialAccounts = accounts.filter(
      (a) => a.providerId === "credential"
    );
    console.log(
      `\n✓ ${credentialAccounts.length} valid credential account(s) for email/password login`
    );

    if (users.length === 0) {
      console.log("\n💡 No users found. Try signing up first!");
    }
  } catch (error) {
    console.error("Error checking auth data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAuthData();

