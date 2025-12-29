const cron = require("node-cron");
const Tenant = require("../modules/tenant/tenant.model");
const { generateMonthlyInvoice } = require("../modules/billing/billing.service");

cron.schedule("0 0 1 * *", async () => {
  console.log("Running monthly invoice job");

  const tenants = await Tenant.find({ status: "ACTIVE" });

  const now = new Date();
  const month = `${now.getFullYear()}-${String(
    now.getMonth()
  ).padStart(2, "0")}`;

  for (const tenant of tenants) {
    try {
      await generateMonthlyInvoice(tenant._id, month);
      console.log(`Invoice generated for tenant ${tenant._id}`);
    } catch (err) {
      console.error("Invoice job error", err.message);
    }
  }
});
