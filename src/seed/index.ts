import User from "../models/user";
import bcrypt from "bcryptjs";
import { DummyUser, billionaires, users } from "./users";
import { posts } from "./posts";
import Post from "../models/post";
import Image from "../models/image";
import { avatars } from "./avatars";

const seedAvatarModel = async () => {
  try {
    await Image.deleteMany({});
    await Image.insertMany(avatars);
    console.log("Avatar data imported successfully");
  } catch (error: any) {
    console.error("Error: ", error.message);
  }
};

const hashPasswords = async (users: DummyUser[]) => {
  const hashedPasswords = await Promise.all(
    users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return hashedPassword;
    })
  );
  return hashedPasswords;
};

const seedUser = async () => {
  try {
    console.log("Seeding data...");

    // hash passwords from dummy data before inserting them into the database
    const hashedUsers = await hashPasswords(users);
    const hashedBillionaires = await hashPasswords(billionaires);

    console.log("Hashed passwords successfully");

    const usersWithHashedPasswords = users.map((user, index) => ({
      ...user,
      password: hashedUsers[index],
    }));

    const billionairesWithHashedPasswords = billionaires.map((user, index) => ({
      ...user,
      password: hashedBillionaires[index],
    }));

    console.log("Add hashed passwords to users and billionaires successfully");

    // delete all users in db and insert new ones with hashed passwords
    await User.deleteMany({});
    const friends = await User.insertMany(billionairesWithHashedPasswords);
    console.log("billionaires data imported successfully");

    await User.insertMany(
      usersWithHashedPasswords.map((user) => ({
        ...user,
        friends: friends.map((friend) => friend._id),
      }))
    );
    console.log("users data imported successfully");
  } catch (error: any) {
    console.error("Error: ", error.message);
  }
};

const seedPost = async () => {
  try {
    console.log("Seeding posts data...");

    await Post.deleteMany({});
    await Post.insertMany(posts);
    console.log("posts data imported successfully");
  } catch (error: any) {
    console.error("Error: ", error.message);
  }
};

export const main = async () => {
  await seedUser();
  await seedPost();
  console.log("All done!");
  process.exit();
};

export const oneTimeSeed = async () => {
  await seedAvatarModel();
};
