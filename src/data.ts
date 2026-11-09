const wendyHouseImg = '/images/wendy-house.webp';
const logHomeImg = '/images/log-home.webp';
const gardenStudioImg = '/images/garden-studio.webp';
const heroImg = '/images/timber-home-hero.webp';

export const CONTACT = {
  phone: '+27 72 642 3964',
  phoneHref: 'tel:+27726423964',
  whatsapp: '27726423964',
  email: 'ljwendyhuts@gmail.com',
  maps: 'https://www.google.com/maps/search/?api=1&query=342+Broodryk+Street+Wolmer+Pretoria+0182+South+Africa',
};

export function whatsappLink(message = "Hi Leo! I'd love to find out more about your Wendy houses and timber homes.") {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type QuoteDefaults = {
  project?: string;
  size?: string;
  notes?: string;
};

export type Product = {
  id: string;
  name: string;
  project: string;
  image: string;
  alt: string;
  description: string;
  introduction: string;
  possibilities: string[];
  detail: string;
};

export const products: Product[] = [
  {
    id: 'wendy-houses',
    name: 'Wendy houses',
    project: 'Wendy house',
    image: wendyHouseImg,
    alt: 'Design inspiration: a honey-toned timber Wendy house in a leafy garden',
    description: 'A little extra room. A world of possibilities.',
    introduction: 'A practical space with a little personality. From a home for your garden tools to a room for your next big idea, we build Wendy houses around what you need.',
    possibilities: ['Garden sheds & storage', 'Staff accommodation', 'Guard houses & security huts', 'Standard or custom dimensions'],
    detail: 'Choose your layout, roof style, windows and finishes. Insulation, electrical and plumbing options can be discussed as part of your quote.',
  },
  {
    id: 'log-homes',
    name: 'Log homes',
    project: 'Log home',
    image: logHomeImg,
    alt: 'Design inspiration: a timber log home with a veranda and aluminium sliding doors',
    description: 'Natural warmth. A place to really call home.',
    introduction: 'Make yourself at home in a space that feels like you. Our timber homes bring together comfortable layouts, thoughtful details and the natural warmth of wood.',
    possibilities: ['1 to 4-bedroom timber homes', 'Granny flats & guest accommodation', 'Open-plan kitchens & living areas', 'Raised homes, verandas & decking'],
    detail: 'From a simple shell to a more complete fit-out, we can discuss insulation, aluminium finishes, plumbing and electrical work for your build.',
  },
  {
    id: 'custom-spaces',
    name: 'Custom spaces',
    project: 'Custom space',
    image: gardenStudioImg,
    alt: 'Design inspiration: a custom wooden garden studio with glass doors',
    description: 'Your idea, brought to life in timber.',
    introduction: 'A quiet place to work. A little place to play. A deck for long afternoons. If you have something in mind, we would love to help you make it happen.',
    possibilities: ['Garden studios & site offices', "Children's playhouses & dollhouses", 'Lapas & outdoor timber decking', 'Extensions, repairs & relocations'],
    detail: 'Tell us how you want to use your space, where it will go and the size you have in mind. Leo will help you work through the possibilities.',
  },
];

export const projectOptions = [
  'Wendy house',
  'Log home',
  'Granny flat or staff accommodation',
  'Garden studio or site office',
  'Playhouse',
  'Lapa or decking',
  'Custom space',
  'Relocation, extension or repair',
  'Not sure yet - help me choose',
];

export const plans = [
  {
    id: 'log-house',
    name: 'The Log House',
    size: '4m x 8m',
    area: '32',
    price: 125000,
    image: heroImg,
    description: 'A comfortable first home, a quiet retreat, or room for someone you love.',
    features: ['1 bedroom', 'Kitchen & bathroom layout', 'Custom finishes to suit your style'],
  },
  {
    id: 'ground-house',
    name: 'The Ground House',
    size: '7m x 10m',
    area: '70',
    price: 185000,
    image: logHomeImg,
    description: 'A little more room to share, with all the warmth of a proper timber home.',
    features: ['2 bedrooms & 1 bathroom', 'Open-plan kitchen & lounge', 'Insulated ceiling, aluminium slider & 5 windows', 'Raised 400mm on poles'],
  },
];

export const faqs = [
  {
    question: 'Do you deliver outside Gauteng?',
    answer: 'Yes. We are based in Pretoria North and offer delivery and relocation services across South Africa. Tell us your town and province so we can confirm access, delivery arrangements and transport costs in your quote.',
  },
  {
    question: 'Can I customise my Wendy house or log home?',
    answer: 'Absolutely. We build standard sizes and made-to-measure structures. We can work with you on the layout, number of rooms, roof style, decking, insulation, windows and doors, with plumbing and electrical options available for suitable builds.',
  },
  {
    question: 'What is included in the guide price?',
    answer: 'The prices on this page are indicative, not binding quotes. Your final price depends on your layout, finishes, site conditions, delivery and the agreed plumbing and electrical work. Leo will confirm the complete scope and all inclusions in your personalised quote before you go ahead.',
  },
  {
    question: 'Can you relocate, extend or repair my existing structure?',
    answer: 'Yes. We offer relocations, structural extensions, roof changes and general repairs. Send Leo a few photos, the dimensions and your location so the team can assess the structure and recommend the next step.',
  },
  {
    question: 'Will I need building approval?',
    answer: 'Approval requirements depend on your municipality, property and the size and intended use of the structure. Please check with your local municipality before building. We can discuss your proposed structure and dimensions so you have the information you need for that conversation.',
  },
  {
    question: 'How long will my build take?',
    answer: 'Timing depends on the size, specification, site preparation and the team\'s current schedule. Once we understand your project, Leo will confirm a realistic timeframe with your quote and keep you informed along the way.',
  },
];