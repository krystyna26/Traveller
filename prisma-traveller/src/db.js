const users = [
  {
    id: "1",
    first_name: "Krystyna",
    last_name: "lol",
    email: "krysiczka22@wp.pl",
    password: "zaq12wsx",
    age: 27,
    avatar_url: "p1"
  },
  {
    id: "2",
    first_name: "Sara",
    last_name: "Mom",
    email: "emila@asdas.com",
    password: "zaq12wsx",
    trip: ['02', '01']
  },
  {
    id: "3",
    first_name: "Mike",
    last_name: "Pike",
    email: "mike@example.com",
    password: "zaq12wsx",
    trip: ["01"]
  }
];

const trips = [
  {
    id: "01",
    author: "3",
    traveled_from: "San Jose",
    traveled_to: "Tahoe",
    travel_started_at: "2019-10-10",
    travel_ended_at: "2019-17-10",
    published: true,
    stops: ["001", '002']
  },
  {
    id: "02",
    author: "2",
    traveled_from: "Raba",
    traveled_to: "Ponice",
    travel_started_at: "2019-10-10",
    travel_ended_at: "2019-17-10",
    published: false,
    stops: ["002"]
  }
];

const stops = [
  {
    id: "001",
    trip: "01",
    destination: "Argentina",
    completed: false,
    completedAt: "2019-11-10"
  },
  {
    id: "002",
    trip: "01",
    destination: "Rabka Zdroj",
    completed: false,
    completedAt: "2019-11-10"
  },
  {
    id: "003",
    trip: "02",
    destination: "Peru",
    completed: false,
    completedAt: "2019-11-10"
  }
];

const comments = [
  {
    id: 'c01',
    trip: "01",
    author: "1",
    content: "This is my first comment",
    published: false
  }
];

const photos = [
  {
    id: "p1",
    trip: "01",
    author: "1",
    url: "url here",
    caption: "Powell Lake"
  }
]

const db = {
  users,
  trips,
  stops,
  comments,
  photos,
};

export { db as default };
