import mongoose from "mongoose";

export const createDocumentId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};
