const { generateMonthlyInvoice, getTenantBillingSummary, getTenantInvoices } = require("./billing.service");

exports.generateInvoice = async (req, res) => {
  try {
    const { tenantId } = req.user;
    let { month } = req.body || {}; // YYYY-MM

    if (!month) {
      const now = new Date();
      month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    }

    const invoice = await generateMonthlyInvoice(tenantId, month);

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({ success: false, message: "Invoice generation failed" });
  }
};

exports.getBillingSummary = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const summary = await getTenantBillingSummary(tenantId);
    
    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Get billing summary error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch billing summary" });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const invoices = await getTenantInvoices(tenantId);
    
    res.json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch invoices" });
  }
};
