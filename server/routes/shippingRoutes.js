const express = require("express");
const ShippingRate = require("../models/ShippingRate");

const router = express.Router();

const defaultRates = {
  Cairo: 60,
  Giza: 60,
  Alexandria: 70,
  Beheira: 75,
  Gharbia: 80,
  Dakahlia: 80,
  Qalyubia: 70,
  Sharqia: 80,
  Monufia: 80,
  KafrElSheikh: 85,
  Damietta: 85,
  PortSaid: 85,
  Ismailia: 85,
  Suez: 85,
  Fayoum: 90,
  BeniSuef: 90,
  Minya: 95,
  Assiut: 95,
  Sohag: 100,
  Qena: 100,
  Luxor: 105,
  Aswan: 110,
  RedSea: 110,
  Matrouh: 110,
  NewValley: 120,
  NorthSinai: 120,
  SouthSinai: 120,
};

const getShippingConfig = async () => {
  const record = await ShippingRate.findOne();

  if (!record) {
    const created = await ShippingRate.create({ rates: defaultRates });
    return created.rates;
  }

  return record.rates || defaultRates;
};

router.get("/", async (req, res) => {
  try {
    const rates = await getShippingConfig();

    res.status(200).json({
      success: true,
      rates,
    });
  } catch (error) {
    console.error("Get shipping rates error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching shipping rates.",
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const { rates } = req.body;

    if (!rates || typeof rates !== "object") {
      return res.status(400).json({
        success: false,
        message: "Shipping rates are required.",
      });
    }

    const cleanedRates = Object.fromEntries(
      Object.entries(rates).map(([key, value]) => [
        key,
        Number(value) || 0,
      ])
    );

    let record = await ShippingRate.findOne();

    if (!record) {
      record = await ShippingRate.create({ rates: cleanedRates });
      return res.status(200).json({
        success: true,
        message: "Shipping rates saved successfully.",
        rates: record.rates,
      });
    }

    record.rates = cleanedRates;
    await record.save();

    res.status(200).json({
      success: true,
      message: "Shipping rates updated successfully.",
      rates: record.rates,
    });
  } catch (error) {
    console.error("Update shipping rates error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating shipping rates.",
    });
  }
});

module.exports = router;
