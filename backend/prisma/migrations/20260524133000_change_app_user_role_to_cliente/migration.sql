-- Make the app registration role align with the client-facing flow.
ALTER TYPE "user_roles" ADD VALUE IF NOT EXISTS 'cliente';

ALTER TABLE "users"
  ALTER COLUMN "role" SET DEFAULT 'cliente';