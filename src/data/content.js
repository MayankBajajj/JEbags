export const company = {
  name: "JE BAGS",
  tagline: "Built to Carry the World.",
  subtitle: "AND CORPORATE GIFTING",
  motto: "Strong · Rising · Protected",
  phone: "+91 93550 99992",
  phoneRaw: "+919355099992",
  email: "Jebagsofficial@gmail.com",
  address: "Sector 84, Gurgaon, Haryana, India",
  description:
    "JE BAGS is a bag manufacturing and corporate solutions company specializing in high-quality, durable, and customized bags for businesses, brands, institutions, and organizations worldwide.",
};

export const capabilities = [
  {
    icon: "settings-2",
    title: "OEM Manufacturing",
    description:
      "Production based on client designs, drawings, specifications, and branding requirements.",
  },
  {
    icon: "pen-tool",
    title: "ODM Solutions",
    description:
      "Product development and design support to help brands bring new bag concepts to market.",
  },
  {
    icon: "shield-check",
    title: "Private-Label Manufacturing",
    description:
      "Customized products manufactured for brands under their own labels.",
  },
  {
    icon: "warehouse",
    title: "Bulk & Institutional Manufacturing",
    description:
      "Large-volume orders for businesses, educational institutions, retailers, and organizations.",
  },
  {
    icon: "gift",
    title: "Corporate Gifting Solutions",
    description:
      "Customized bags and merchandise for corporate campaigns, employee onboarding, events, and promotions.",
  },
  {
    icon: "layers",
    title: "Custom Product Development",
    description:
      "Tailored materials, colours, components, branding, and functional features to suit specific requirements.",
  },
];

export const whyUs = [
  { icon: "factory", title: "Manufacturing Excellence", description: "Disciplined production standards across every order size." },
  { icon: "shield", title: "Product Durability", description: "Built with materials and construction made to last." },
  { icon: "boxes", title: "Functional Design", description: "Form follows function — every bag engineered for its purpose." },
  { icon: "sparkles", title: "Customization", description: "Materials, colours, branding and features tailored to you." },
  { icon: "truck", title: "Dependable Delivery", description: "Scalable production that keeps pace with your timelines." },
];

export const processSteps = [
  { step: "01", title: "Brief & Consultation", description: "Share your requirements, specifications, or design concept with our team." },
  { step: "02", title: "Design & Sampling", description: "We develop prototypes and samples aligned to your branding and function." },
  { step: "03", title: "Production", description: "Bulk or institutional manufacturing with consistent quality control." },
  { step: "04", title: "Branding & Finishing", description: "Custom logos, labels, and corporate branding applied with precision." },
  { step: "05", title: "Delivery", description: "Dependable, scalable fulfilment across domestic and international markets." },
];

export const categoryGroups = [
  {
    title: "Backpacks & Business Bags",
    icon: "backpack",
    items: ["Backpacks", "School & College Bags", "Corporate Backpacks", "Laptop Bags & Sleeves", "Business Bags & Briefcases", "Messenger Bags"],
  },
  {
    title: "Travel & Luggage",
    icon: "luggage",
    items: ["Travel Bags", "Trolley Bags & Luggage", "Duffle & Weekender Bags", "Gym & Sports Bags"],
  },
  {
    title: "Delivery & Insulated Bags",
    icon: "utensils-crossed",
    items: ["Food Delivery Bags", "Insulated & Thermal Bags", "Lunch Bags", "Courier & E-commerce Delivery Bags"],
  },
  {
    title: "Tote, Canvas & Eco Bags",
    icon: "leaf",
    items: ["Tote Bags", "Canvas Bags", "Cotton & Jute Bags", "Shopping Bags", "Foldable & Reusable Bags"],
  },
  {
    title: "Corporate Gifting & Events",
    icon: "gift",
    items: ["Corporate Gifting Bags", "Promotional & Event Bags", "Conference Bags", "Employee Onboarding Kits"],
  },
  {
    title: "Organizers & Pouches",
    icon: "package",
    items: ["Travel Organizers & Pouches", "Toiletry & Cosmetic Bags", "Shoe Bags", "Tech & Cable Organizers", "Tablet & Accessory Bags"],
  },
  {
    title: "Industrial & Utility",
    icon: "wrench",
    items: ["Tool & Utility Bags", "Industrial & Warehouse Bags", "Equipment Carrying Bags", "Garment Bags"],
  },
  {
    title: "Custom & Private-Label",
    icon: "settings-2",
    items: ["Customized & Private-Label Bags", "OEM Bag Manufacturing", "ODM Bag Design & Development"],
  },
];

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

// logo: key into the import map in ClientStrip.jsx — omit for clients
// without a verified official logo source (falls back to text).
export const clients = [
  { name: "Numero Uno", logo: "numerouno" },
  { name: "Aakash", logo: "aakash" },
  { name: "Suzuki", logo: "suzuki" },
  { name: "Shipsy", logo: "shipsy" },
  { name: "Invergy", logo: null },
  { name: "DeliveryPlus", logo: null },
  { name: "Oliveware", logo: null },
  { name: "Physics Wallah", logo: "physicswallah" },
  { name: "Yes Madam", logo: "yesmadam" },
  { name: "DMart", logo: "dmart" },
];

export const industries = [
  { icon: "backpack", label: "Education" },
  { icon: "briefcase", label: "Corporate & IT" },
  { icon: "shopping-bag", label: "Retail" },
  { icon: "package", label: "E-commerce" },
  { icon: "gift", label: "Events & Institutions" },
];

export const exportCapabilities = [
  { icon: "globe", label: "Worldwide Shipping" },
  { icon: "check", label: "Export Documentation Support" },
  { icon: "package", label: "Custom Packaging" },
  { icon: "warehouse", label: "Bulk Order Capabilities" },
];
