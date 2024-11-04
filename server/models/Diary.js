import mongoose from "mongoose";
const diarySchema = new mongoose.Schema({
    diary: { type: String, required: true },
    managerName: { type: String, required: true },
  });
  export const Diary=mongoose.model("diary",diarySchema)