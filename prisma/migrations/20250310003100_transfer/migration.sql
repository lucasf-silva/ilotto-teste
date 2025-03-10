-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "senderUserId" INTEGER NOT NULL,
    "recipientUserId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
