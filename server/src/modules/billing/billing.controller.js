const { generateMonthlyInvoice } = require("./billing.service");

exports.generateInvoice = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { month } = req.body; // YYYY-MM

    const invoice = await generateMonthlyInvoice(tenantId, month);

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Invoice generation failed" });
  }
};
