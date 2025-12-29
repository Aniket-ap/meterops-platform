const cron = require("node-cron");
const Usage = require("../modules/usage/usage.model");

cron.schedule("0 3 * * *", async () => {
  console.log("Running usage cleanup job");

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);

  await Usage.deleteMany({
    createdAt: { $lt: cutoff },
  });
});
