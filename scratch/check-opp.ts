import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const opp = await prisma.opportunity.findFirst({
    orderBy: { createdAt: 'desc' },
    where: { deletedAt: null }
  });
  console.log('Status:', opp?.status);
  console.log('Eligibility Requirements count:', (opp?.eligibilityRequirements as unknown[])?.length);
  console.log('Required Docs count:', (opp?.requiredDocuments as unknown[])?.length);
  console.log('Eligibility Requirements (first 2):',
    JSON.stringify((opp?.eligibilityRequirements as unknown[])?.slice(0, 2), null, 2));

  const report = await prisma.eligibilityReport.findFirst({
    where: { opportunityId: opp?.id },
    orderBy: { version: 'desc' }
  });
  console.log('\nEligibility Report Status:', report?.status);
  console.log('Confidence:', report?.confidence);
  console.log('Reasons:', JSON.stringify(report?.reasons, null, 2));
  console.log('Raw Output:', JSON.stringify(report?.rawModelOutput, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
