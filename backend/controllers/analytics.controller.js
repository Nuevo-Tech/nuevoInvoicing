import express from "express";
import Invoice from "../mongodb/models/invoice.js";


const getMonthlyIncomeDetails = async (req, res) => {
  try {
    const incomeData = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $exists: true, $ne: null },
          total: { $exists: true, $ne: null } // ensure total exists
        },
      },
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          total: { $toDouble: "$total" }, // convert to number in case it's a string
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalIncome: { $sum: "$total" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formattedData = incomeData.map((item) => ({
      year: item._id.year,
      month: new Date(item._id.year, item._id.month - 1, 1).toLocaleString("default", {
        month: "long",
      }),
      income: item.totalIncome,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching income details:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export { getMonthlyIncomeDetails };
