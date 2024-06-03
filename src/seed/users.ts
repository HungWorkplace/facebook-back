export type DummyUser = {
  email: string;
  password: string;
  phone: string;
  firstName: string;
  surname: string;
  birthday: string;
  gender: "male" | "female" | "other";
  avatar?: string;
};

export const billionaires: DummyUser[] = [
  {
    email: "elonmusk@gmail.com",
    password: "Test12345@",
    phone: "0123456789",
    firstName: "Elon",
    surname: "Musk",
    birthday: "1971/06/28",
    gender: "male",
    avatar:
      "https://res.cloudinary.com/dabwxshg6/image/upload/v1717414805/facebook/elon-musk.jpg",
  },
  {
    email: "jeffbezos@gmail.com",
    password: "Test12345@",
    phone: "0123456789",
    firstName: "Jeff",
    surname: "Bezos",
    birthday: "1964/01/12",
    gender: "male",
    avatar:
      "https://res.cloudinary.com/dabwxshg6/image/upload/v1717414805/facebook/jeff-bezos.jpg",
  },
  {
    email: "billgates@gmail.com",
    password: "Test12345@",
    phone: "0123456789",
    firstName: "Bill",
    surname: "Gates",
    birthday: "1955/10/28",
    gender: "male",
    avatar:
      "https://res.cloudinary.com/dabwxshg6/image/upload/v1717414805/facebook/bill-gate.jpg",
  },
  {
    email: "markzuckerberg@gmail.com",
    password: "Test12345@",
    phone: "0123456789",
    firstName: "Mark",
    surname: "Zuckerberg",
    birthday: "1984/05/14",
    gender: "male",
    avatar:
      "https://res.cloudinary.com/dabwxshg6/image/upload/v1717414805/facebook/mark-zuckerberg.jpg",
  },
  {
    email: "shouzichew@gmail.com",
    password: "Test12345@",
    phone: "0123456789",
    firstName: "Shou Zi",
    surname: "Chew",
    birthday: "1983/01/01",
    gender: "male",
    avatar:
      "https://res.cloudinary.com/dabwxshg6/image/upload/v1717414805/facebook/shou-zi-chew.jpg",
  },
];

export const users: DummyUser[] = [
  {
    email: "hung.admin@gmail.com",
    password: "Test12345@",
    phone: "0123456789",
    firstName: "Hung",
    surname: "Nguyen",
    birthday: "1971/06/28",
    gender: "male",
  },
  {
    email: "test1@gmail.com",
    password: "Test12345@",
    phone: "0123456789",
    firstName: "Han",
    surname: "Nguyen",
    birthday: "1964/01/12",
    gender: "female",
  },
  {
    email: "test2@gmail.com",
    password: "Test12345@",
    phone: "0123456789",
    firstName: "Trong",
    surname: "Nguyen",
    birthday: "1955/10/28",
    gender: "male",
  },
];
