ALTER TYPE "NivelAcesso" ADD VALUE 'CLIENTE';

ALTER TABLE "Cliente" ADD COLUMN "usuarioId" TEXT;

CREATE UNIQUE INDEX "Cliente_usuarioId_key" ON "Cliente"("usuarioId");

ALTER TABLE "Cliente"
ADD CONSTRAINT "Cliente_usuarioId_fkey"
FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
