import { SellItem } from "../sell-item";

it("implements optimistic concurrency control", async (done) => {
  //Create a sell item
  const sellItem = SellItem.build({
    title: "Cycle",
    price: 120,
    userId: "asdasd",
  });

  //Save the sell item to database
  await sellItem.save();

  //Fetch the same sell item twice
  const firstInstance = await SellItem.findById(sellItem.id);
  const secondInstance = await SellItem.findById(sellItem.id);

  //make two separate changes to both instances
  firstInstance?.set({ price: 100 });
  secondInstance?.set({ price: 80 });

  //save the first instance
  await firstInstance!.save();

  //save the second instance and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error("Test failed");
});
