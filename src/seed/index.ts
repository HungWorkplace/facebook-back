import User from "../models/user";
import bcrypt from "bcryptjs";
import { DummyUser, billionaires, users } from "./users";

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

export const seed = async () => {
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

    // users, billionaires with hashed passwords
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
