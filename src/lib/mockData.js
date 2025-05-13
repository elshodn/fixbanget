import image1 from "../assets/images/mock/category image1.png"
import image2 from "../assets/images/mock/category image2.png"
import image3 from "../assets/images/mock/category image3.png"
import image4 from "../assets/images/mock/category image4.png"
import image5 from "../assets/images/mock/category image5.png"
import image11 from "../assets/images/mock/image11.png"
import image20 from "../assets/images/mock/image20.png"
import newProductImage1 from "../assets/images/mock/newproduct1.png"
import newProductImage2 from "../assets/images/mock/newproduct2.png"
import newProductImage3 from "../assets/images/mock/newproduct3.png"
import newProductImage4 from "../assets/images/mock/newproduct4.png"
export const initialUsers = [
  { id: 1, name: "Ali", email: "user@gmail.com", password: "123456" },
  { id: 2, name: "Laylo", email: "admin@gmail.com", password: "654321" }
]
export const mockOrders = [
  {
    id: '#ORD-2023-001',
    date: '15 мая 2023',
    status: 'processing',
    items: [
      { name: 'Футболка с логотипом', price: 2490, quantity: 2, image: '/tshirt.jpg' },
      { name: 'Джинсы классические', price: 5490, quantity: 1, image: '/jeans.jpg' }
    ],
    total: 10470,
    trackingNumber: "TRK456789123"
  },
  {
    id: '#ORD-2023-002',
    date: '10 мая 2023',
    status: 'shipped',
    items: [
      { name: 'Кроссовки спортивные', price: 8990, quantity: 1, image: '/sneakers.jpg' }
    ],
    total: 8990,
    trackingNumber: 'TRK123456789'
  },
  {
    id: '#ORD-2023-003',
    date: '5 мая 2023',
    status: 'delivery',
    items: [
      { name: 'Часы наручные', price: 12990, quantity: 1, image: '/watch.jpg' },
      { name: 'Ремень кожаный', price: 3490, quantity: 1, image: '/belt.jpg' }
    ],
    total: 16480,
    trackingNumber: 'TRK987654321'
  },
  {
    id: '#ORD-2023-004',
    date: '1 мая 2023',
    status: 'delivered',
    items: [
      { name: 'Ноутбук UltraBook', price: 89990, quantity: 1, image: '/laptop.jpg' },
      { name: 'Чехол для ноутбука', price: 2490, quantity: 1, image: '/case.jpg' }
    ],
    total: 92480,
    trackingNumber: 'TRK456789123'
  },
  {
    id: '#ORD-2023-005',
    date: '25 апреля 2023',
    status: 'refund',
    items: [
      { name: 'Наушники беспроводные', price: 7990, quantity: 1, image: '/headphones.jpg' }
    ],
    total: 7990,
    trackingNumber: null,
    refundStatus: 'В обработке'
  }
];
export const products = [
  {
    id: 1,
    name: "Nike Air Max 270",
    price: 159.99,
    category: "sneakers",
    gender: ["men", "women"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["black", "white"],
    sizes: [38, 39, 40, 41, 42, 43],
    rating: 4.5,
    reviews: 24,
  },
  {
    id: 2,
    name: "Adidas Superstar",
    price: 129.99,
    category: "sneakers",
    gender: ["men", "women"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["white", "black"],
    sizes: [36, 37, 38, 39, 40],
    rating: 4.2,
    reviews: 18,
    isNew: false
  },
  {
    id: 3,
    name: "Timberland Premium Boots",
    price: 229.99,
    category: "boots",
    gender: ["men"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["brown", "black"],
    sizes: [40, 41, 42, 43, 44],
    rating: 4.8,
    reviews: 32,
    isNew: true
  },
  {
    id: 4,
    name: "Puma RS-X",
    price: 119.99,
    category: "sneakers",
    gender: ["men", "women"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["blue", "red", "white"],
    sizes: [37, 38, 39, 40, 41, 42],
    rating: 4.3,
    reviews: 15,
    isNew: true
  },
  {
    id: 5,
    name: "Converse Chuck Taylor",
    price: 89.99,
    category: "sneakers",
    gender: ["men", "women", "kids"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["black", "white", "red"],
    sizes: [35, 36, 37, 38, 39, 40],
    rating: 4.7,
    reviews: 42,
    isNew: false
  },
  {
    id: 6,
    name: "Dr. Martens 1460",
    price: 179.99,
    category: "boots",
    gender: ["women"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["black", "cherry"],
    sizes: [36, 37, 38, 39, 40],
    rating: 4.6,
    reviews: 28,
    isNew: false
  },
  {
    id: 7,
    name: "Vans Old Skool",
    price: 79.99,
    category: "sneakers",
    gender: ["men", "women"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["black", "checkerboard"],
    sizes: [38, 39, 40, 41, 42],
    rating: 4.4,
    reviews: 35,
    isNew: false
  },
  {
    id: 8,
    name: "New Balance 574",
    price: 109.99,
    category: "sneakers",
    gender: ["men", "women"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["gray", "navy"],
    sizes: [39, 40, 41, 42, 43],
    rating: 4.5,
    reviews: 21,
    isNew: true
  },
  {
    id: 9,
    name: "UGG Classic Boots",
    price: 199.99,
    category: "boots",
    gender: ["women"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["chestnut", "black"],
    sizes: [36, 37, 38, 39],
    rating: 4.9,
    reviews: 47,
    isNew: false
  },
  {
    id: 10,
    name: "Reebok Classic Leather",
    price: 99.99,
    category: "sneakers",
    gender: ["men", "women"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["white", "black"],
    sizes: [38, 39, 40, 41, 42],
    rating: 4.2,
    reviews: 19,
    isNew: false
  },
  {
    id: 11,
    name: "Air Jordan 1 Retro",
    price: 189.99,
    category: "sneakers",
    gender: ["men"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["red", "black", "white"],
    sizes: [40, 41, 42, 43, 44],
    rating: 4.8,
    reviews: 38,
    isNew: true
  },
  {
    id: 12,
    name: "Skechers Go Walk",
    price: 89.99,
    category: "sneakers",
    gender: ["women"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["pink", "gray"],
    sizes: [36, 37, 38, 39],
    rating: 4.1,
    reviews: 14,
    isNew: false
  },
  {
    id: 13,
    name: "Clarks Desert Boots",
    price: 149.99,
    category: "boots",
    gender: ["men"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["brown", "tan"],
    sizes: [39, 40, 41, 42, 43],
    rating: 4.7,
    reviews: 26,
    isNew: false
  },
  {
    id: 14,
    name: "Asics Gel-Kayano",
    price: 139.99,
    category: "sneakers",
    gender: ["men", "women"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["blue", "silver"],
    sizes: [38, 39, 40, 41, 42, 43],
    rating: 4.6,
    reviews: 31,
    isNew: true
  },
  {
    id: 15,
    name: "Steve Madden Heels",
    price: 119.99,
    oldPrice: 14.43,
    category: "heels",
    gender: ["women"],
    image: "https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png",
    colors: ["black", "nude"],
    sizes: [36, 37, 38, 39],
    rating: 4.3,
    reviews: 22,
    isNew: true
  }
];
export const categories = [
  { id: 1, name: "Кожаные куртки", },
  { id: 2, name: "Джинсовые куртки", },
  { id: 3, name: "Ветровки", },
  { id: 4, name: "Спортивная одежда", },
  { id: 5, name: "Рубашки", },
  { id: 6, name: "Поло", },
  { id: 7, name: "Майки", },
  { id: 8, name: "Шорты", },
  { id: 9, name: "Панамы", },
  { id: 10, name: "Нижнее белье", },
  { id: 11, name: "Носки и гетры", },
];

export const categoriesAccessories = [
  { id: 1, name: "Ключница", },
  { id: 2, name: "Детские рюкзаки", },
  { id: 3, name: "Аксессуары для сумок", },
  { id: 4, name: "Украшения", },
  { id: 5, name: "Ремни", },
  { id: 6, name: "Шарфы", },
  { id: 7, name: "Разные аксессуары", },
  { id: 8, name: "Аксессуары для волос", },
  { id: 9, name: "Сумки через плечо", },
  { id: 10, name: "Портфели", },
  { id: 11, name: "Спортивные сумки", },
];
export const styleData = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Яркий весенний лук",
    quantity: 5,
    link: "/looks/1",
    stylist: "Анна Петрова",
    season: "Весна 2024",
    price: 387,
    items: [
      { name: "Желтая куртка", brand: "ZARA" },
      { name: "Белый топ", brand: "Massimo Dutti" },
      { name: "Синие джинсы", brand: "Levi's" }
    ]
  },
  {
    id: 2,
    name: "Офисный шик",
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    quantity: 4,
    link: "/looks/2",
    stylist: "Иван Сидоров",
    season: "Всесезонный",
    price: 324,
    items: [
      { name: "Серый костюм", brand: "Boggi" },
      { name: "Голубая рубашка", brand: "Hugo Boss" }
    ]
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Романтический вечер",
    quantity: 6,
    oldPrice:43433,
    link: "/looks/3",
    stylist: "Мария Иванова",
    season: "Лето 2024",
    price: 3244,
    items: [
      { name: "Цветное платье", brand: "Mango" },
      { name: "Босоножки", brand: "Rendez-Vous" }
    ]
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Спортивный стиль",
    quantity: 3,
    link: "/looks/4",
    stylist: "Дмитрий Смирнов",
    season: "Всесезонный",
    price: 3234,
    items: [
      { name: "Худи", brand: "Nike" },
      { name: "Леггинсы", brand: "Adidas" }
    ]
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Гламурный вечер",
    quantity: 7,
    link: "/looks/5",
    stylist: "Елена Волкова",
    season: "Осень 2023",
    price: 3234,
    items: [
      { name: "Черное платье", brand: "Gucci" },
      { name: "Туфли", brand: "Jimmy Choo" }
    ]
  },
  {
    id: 6,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Уличный стиль",
    quantity: 4,
    link: "/looks/6",
    stylist: "Алексей Козлов",
    season: "Зима 2023",
    price: 746,
    items: [
      { name: "Кожаная куртка", brand: "All Saints" },
      { name: "Джинсы", brand: "Diesel" }
    ]
  },
  {
    id: 7,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Деловой кэжуал",
    quantity: 5,
    link: "/looks/7",
    stylist: "Ольга Новикова",
    season: "Весна 2024",
    price: 843,
    items: [
      { name: "Блейзер", brand: "Mango" },
      { name: "Футболка", brand: "COS" }
    ]
  },
  {
    id: 8,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Пляжный образ",
    quantity: 4,
    link: "/looks/8",
    stylist: "Сергей Васильев",
    season: "Лето 2024",
    price: 897,
    items: [
      { name: "Рубашка", brand: "Tommy Hilfiger" },
      { name: "Шорты", brand: "Lacoste" }
    ]
  },
  {
    id: 9,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Городской романтик",
    quantity: 6,
    link: "/looks/9",
    stylist: "Алина Семенова",
    season: "Осень 2023",
    price: 334,
    items: [
      { name: "Пальто", brand: "Max Mara" },
      { name: "Свитер", brand: "Uniqlo" }
    ]
  },
  {
    id: 10,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Минимализм",
    quantity: 3,
    link: "/looks/10",
    stylist: "Артем Федоров",
    season: "Всесезонный",
    price: 3234,
    items: [
      { name: "Белая рубашка", brand: "Theory" },
      { name: "Черные брюки", brand: "Arket" }
    ]
  },
  {
    id: 11,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Вечерний лук",
    quantity: 5,
    link: "/looks/11",
    stylist: "Виктория Морозова",
    season: "Зима 2023",
    price: 3234,
    items: [
      { name: "Платье", brand: "Self-Portrait" },
      { name: "Клатч", brand: "By Far" }
    ]
  },
  {
    id: 12,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Скандинавский стиль",
    quantity: 4,
    link: "/looks/12",
    stylist: "Никита Волков",
    season: "Зима 2023",
    price: 334,
    items: [
      { name: "Свитер", brand: "Acne Studios" },
      { name: "Брюки", brand: "COS" }
    ]
  },
  {
    id: 13,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Богемный шик",
    quantity: 7,
    link: "/looks/13",
    stylist: "Полина Ковалева",
    season: "Лето 2024",
    price: 32334,
    items: [
      { name: "Платье", brand: "Reformation" },
      { name: "Сандалии", brand: "Ancient Greek" }
    ]
  },
  {
    id: 14,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Активный отдых",
    quantity: 4,
    link: "/looks/14",
    stylist: "Максим Орлов",
    season: "Всесезонный",
    price: 32,
    items: [
      { name: "Ветровка", brand: "The North Face" },
      { name: "Кроссовки", brand: "Salomon" }
    ]
  },
  {
    id: 15,
    image: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    name: "Классический костюм",
    quantity: 5,
    link: "/looks/15",
    stylist: "Екатерина Соколова",
    season: "Осень 2023",
    price: 32334,
    items: [
      { name: "Костюм", brand: "Brunello Cucinelli" },
      { name: "Рубашка", brand: "Eton" }
    ]
  }
];

export const AccessoriesData = [
  {
      id: 1,
      name: "Сумки и рюкзаки",
      image: image1
  },
  {
      id: 2,
      name: "Часы",
      image: image2,
  },
  {
      id: 3,
      name: "Очки",
      image: image3,
  },
  {
      id: 4,
      name: "Кошельки",
      image: image4,
  },
  {
      id: 5,
      name: "Карточницы",
      image: image5,
  },
]

export const TelegramChannelsData = [
  {
    id: 1,
    image: image5,
    name: "Карточницы",
  },
  {
    id: 2,
    image: image3,
    name: "Очки",
  },
  {
    id: 3,
    image: image20,
    name: "Женское",
  },
  {
    id: 4,
    image: image11,
    name: "Мужское",
  },
  {
    id: 5,
    image: image2,
    name: "Часы",
  },
  {
    id: 6,
    image: image4,
    name: "Кошельки",
  },
]

export const newProductData = [
  {
    id:1,
    title:"Lorem ipsum",
    desc:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet",
    image: newProductImage1,
  },
  {
    id:2,
    title:"Lorem ipsum",
    desc:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet",
    image: newProductImage2,
  },
  {
    id:3,
    title:"Lorem ipsum",
    desc:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet",
    image: newProductImage3,
  },
  {
    id:4,
    title:"Lorem ipsum",
    desc:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet",
    image: newProductImage4,
  },

]

export  const sizeArray = [
  { id: 1, size: 36 },
  { id: 2, size: 36.5 },
  { id: 3, size: 37 },
  { id: 4, size: 37.5 },
  { id: 5, size: 38 },
  { id: 6, size: 38.5 },
  { id: 7, size: 39 },
  { id: 8, size: 39.5 },
  { id: 9, size: 40 },
  { id: 10, size: 40.5 },
  { id: 11, size: 41 },
  { id: 12, size: 41.5 },
  { id: 13, size: 42 },
  { id: 14, size: 42.5 },
  { id: 15, size: 43 },
  { id: 16, size: 43.5 },
  { id: 17, size: 44 },
  { id: 18, size: 44.5 },
  { id: 19, size: 45 },
  { id: 20, size: 45.5 },
  { id: 21, size: 46 },
  { id: 22, size: 46.5 },
  { id: 23, size: 47 },
  { id: 24, size: 47.5 },
  { id: 25, size: 48 },
  { id: 26, size: 48.5 },
  { id: 27, size: 49 },
  { id: 28, size: 49.5 },
  { id: 29, size: 50 },
  { id: 30, size: 50.5 },
  { id: 31, size: 51 },
  { id: 32, size: 51.5 },
  { id: 33, size: 52 },
  { id: 34, size: 52.5 }
];

export const brendNames = [
{id: 1, name:"Nike"},
{id: 1, name:"Jordan"},
{id: 1, name:"Warrior"},
{id: 1, name:"Adidas originals"},
{id: 1, name:"Vans"},
{id: 1, name:"Converse"},
{id: 1, name:"PUMA"},
{id: 1, name:"Skechers"},
{id: 1, name:"361"},
{id: 1, name:"Adidas neo"}, 
{id: 1, name:"MLB"},
{id: 1, name:"HLA"},
{id: 1, name:"Onitsuka Tiger"}, 
{id: 1, name:"EASTERN CAMEL"}, 
{id: 1, name:"AOKANG"},
{id: 1, name:"Reebok"},
{id: 1, name:"Jeep"},
{id: 1, name:"Adidas"},
{id: 1, name:"CBANNER"},
{id: 1, name:"FCMM"},
{id: 1, name:"GESENLANG"},
{id: 1, name:"New Balance"}, 
{id: 1, name:"HACKBUTEER"},
{id: 1, name:"SEPTWOLVES"},
{id: 1, name:"Vitro"},
{id: 1, name:"FILA"},
{id: 1, name:"Jinho"},
{id: 1, name:"JKEM"},
{id: 1, name:"Kappa"},
{id: 1, name:"Hotwind"},
{id: 1, name:"FAIRWHALE"},
{id: 1, name:"LOUIS VUITTON"},
{id: 1, name:"G.N.SHIJIA"},
{id: 1, name:"Califbull"},
{id: 1, name:"Asics"},
{id: 1, name:"Ecco"},
{id: 1, name:"OUGLEMEN"},
{id: 1, name:"FILA FUSION"}, 
{id: 1, name:"JEEP SPIRIT"}, 
{id: 1, name:"RXZ"},
{id: 1, name:"ROUJERDA"},
{id: 1, name:"Kolumb"},
{id: 1, name:"ROBINHOOD"},
{id: 1, name:"TRUMPPIPE"},
{id: 1, name:"HUANQIU"},
{id: 1, name:"Satchi"},
{id: 1, name:"TEXWOOD"},
{id: 1, name:"Medd"},
{id: 1, name:"Ruomini"},
{id: 1, name:"STUR YSN"}, 
{id: 1, name:"TONYBEAR"},
{id: 1, name:"ZRO"},
{id: 1, name:"GUCCI"},
{id: 1, name:"LADY PIROLA"}, 
{id: 1, name:"Giuseppe zanotti"}, 
{id: 1, name:"VICKI BROWN"}, 
{id: 1, name:"Swiftwick"},
{id: 1, name:"YIVELOVE"},
{id: 1, name:"SOURCE"},
]
export const commentsData = [
  {
    title:"Обожаю свитер",
    desc:"Мне очень нравится, как он выглядит, и у него действительно качественная ткань. Я готова создать образ, сочетающийся по цвету с этим свитером",
    rating:4,
    after:"Яхё Прайого",
    date:"05/04/22"
  },
  {
    title:"Обожаю свитер",
    desc:"Мне очень нравится, как он выглядит, и у него действительно качественная ткань. Я готова создать образ, сочетающийся по цвету с этим свитером",
    rating:4,
    after:"Яхё Прайого",
    date:"05/04/22"
  },
  {
    title:"Обожаю свитер",
    desc:"Мне очень нравится, как он выглядит, и у него действительно качественная ткань. Я готова создать образ, сочетающийся по цвету с этим свитером",
    rating:4,
    after:"Яхё Прайого",
    date:"05/04/22"
  },
]
