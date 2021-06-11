import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  profile_pic: String,
  number: String,
  pushToken: String,
});
export default mongoose.model("users", userSchema);
