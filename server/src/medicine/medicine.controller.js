// Mock data for MVP
const mockShops = [
  {
    id: 1,
    name: "Apollo Pharmacy",
    location: "Main Road, Village Center",
    medicines: [
      { name: "Paracetamol 500mg", stock: "In Stock", price: 20 },
      { name: "Amoxicillin 250mg", stock: "Low", price: 50 },
      { name: "Cough Syrup", stock: "Out of Stock", price: 80 }
    ]
  },
  {
    id: 2,
    name: "Sanjeevani Medicos",
    location: "Near Bus Stand",
    medicines: [
      { name: "Paracetamol 500mg", stock: "In Stock", price: 18 },
      { name: "Vitamins C Zinc", stock: "In Stock", price: 45 },
      { name: "Ointment", stock: "Low", price: 30 }
    ]
  }
];

export const getShops = (req, res) => {
  res.json({ success: true, shops: mockShops });
};
