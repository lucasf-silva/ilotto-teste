-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_recipientUserId_fkey";

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "recipientUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
