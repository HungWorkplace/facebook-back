type Post = {
  content: string;
  image: string;
  author: string;
  privacy: "public" | "private";
  likes?: string[];
  comments?: string[];
};

export const posts: Post[] = [
  {
    // Elon Musk
    content:
      "Check out our latest sky-high shenanigans with Falcon Heavy! 🚀💥 Nothing like a little rocket science to spice up your day. Big shoutout to the SpaceX team for not blowing anything up (too badly). Let’s keep pushing the envelope and making Mars our next holiday destination! 🌌🔴i",
    image:
      "https://res.cloudinary.com/dabwxshg6/image/upload/v1717458769/facebook/1.elon_musk_spacex.jpg_0-sixteen_nine_0_lyvlvc.jpg",
    author: "665d9a89fd897a3a19fa2c75",
    privacy: "public",
  },
  {
    // Jeff Bezos
    content:
      "Like, share and comment if you think Amazon is the best company in the world!",
    image:
      "https://res.cloudinary.com/dabwxshg6/image/upload/v1717458770/facebook/mVdaknZ6JrvW2s5Dsyx2ET_bncxah.jpg",
    author: "665d9a89fd897a3a19fa2c76",
    privacy: "public",
  },
  {
    // Bill Gates
    content:
      "Snapping a selfie with these lovely ladies! 🤳😊 Being surrounded by young, bright minds makes me feel youthful again. Who says tech geeks don't know how to have fun? 😄",
    image:
      "https://res.cloudinary.com/dabwxshg6/image/upload/v1717458769/facebook/4f1666cc52c941429ffbf2ebf3741d11_marnty.jpg",
    author: "665d9a89fd897a3a19fa2c77",
    privacy: "public",
  },
  {
    // Mark Zuckerberg
    content: "Amazing good chóp. I really like phobo.com",
    image:
      "https://res.cloudinary.com/dabwxshg6/image/upload/v1717458770/facebook/mark-zuckerbergs-travels_iszwgz.jpg",
    author: "665d9a89fd897a3a19fa2c78",
    privacy: "public",
  },
  {
    // shouzichew
    content: "Hi everyone! It's Shou here I'm the CEO of TikTok",
    image:
      "https://res.cloudinary.com/dabwxshg6/image/upload/v1717458770/facebook/641b3fec56b81400187a541e_phkz4g.png",
    author: "665d9a89fd897a3a19fa2c79",
    privacy: "public",
  },
];
