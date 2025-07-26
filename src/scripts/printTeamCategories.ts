import { db } from "@/lib/mongo";

async function main() {
  const Teams = db.collection('Teams');
  const categories = await Teams.aggregate([
    { $group: { _id: "$category" } }
  ]).toArray();
  console.log("Unique categories:", categories.map(c => c._id));
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); }); 