import { db } from "./db";
import { productsTable, salesTable } from "./schema";

export async function seed() {
  console.log("🌴Seeding database...");

  //   insert products
  await db.insert(productsTable).values([
    { name: "Laptop", category: "Electronics", price: 999.99, stock: 50 },
    { name: "Smartphone", category: "Electronics", price: 699.99, stock: 150 },
    { name: "Desk Chair", category: "Furniture", price: 89.99, stock: 85 },
    { name: "Bookcase", category: "Furniture", price: 129.99, stock: 40 },
    {
      name: "Electric Kettle",
      category: "Appliances",
      price: 39.99,
      stock: 120,
    },
    {
      name: "Blender",
      category: "Appliances",
      price: 59.99,
      stock: 75,
    },
  ]);
  console.log("✅Inserted products.");

  // Insert Sales
  await db.insert(salesTable).values([
    {
      product_id: 1,
      quantity: 2,
      total_amount: 1999.98,
      customer_name: "Alice",
      region: "North",
    },
    {
      product_id: 2,
      quantity: 1,
      total_amount: 699.99,
      customer_name: "Bob",
      region: "South",
    },
    {
      product_id: 3,
      quantity: 4,
      total_amount: 359.96,
      customer_name: "Charlie",
      region: "East",
    },
    {
      product_id: 4,
      quantity: 1,
      total_amount: 129.99,
      customer_name: "Diana",
      region: "West",
    },
    {
      product_id: 5,
      quantity: 3,
      total_amount: 119.97,
      customer_name: "Ethan",
      region: "North",
    },
    {
      product_id: 6,
      quantity: 2,
      total_amount: 119.98,
      customer_name: "Fiona",
      region: "South",
    },
  ]);
  console.log("✅Inserted sales.");
  console.log("🌴Seeding completed.");
}

seed();
