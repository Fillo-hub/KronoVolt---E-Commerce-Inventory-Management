const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const demoMerchant = [
  {
    id: "1",
    name: "KronoVolt Official Store",
    email: "store@kronovolt.com",
    description: "Distributore ufficiale di elettronica di consumo, informatica, audio professionale e fotografia.",
    phone: "+39 02 9475 8210",
    address: "Via Torino 45, 20123 Milano (MI), Italia",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const demoCategories = [
  { id: "3117a1b0-6369-491e-8b8b-9fdd5ad9912e", name: "smart-phones" },
  { id: "782e7829-806b-489f-8c3a-2689548d7153", name: "laptops" },
  { id: "a6896b67-197c-4b2a-b5e2-93954474d8b4", name: "watches" },
  { id: "4c2cc9ec-7504-4b7c-8ecd-2379a854a423", name: "headphones" },
  { id: "1cb9439a-ea47-4a33-913b-e9bf935bcc0b", name: "earbuds" },
  { id: "ada699e5-e764-4da0-8d3e-18a8c8c5ed24", name: "tablets" },
  { id: "659a91b9-3ff6-47d5-9830-5e7ac905b961", name: "cameras" },
  { id: "7a241318-624f-48f7-9921-1818f6c20d85", name: "speakers" },
  { id: "da6413b4-22fd-4fbb-9741-d77580dfdcd5", name: "mouses" },
  { id: "ss6412b4-22fd-4fbb-9741-d77580dfdcd2", name: "computers" },
  { id: "fs6412b4-22fd-4fbb-9741-d77512dfdfa3", name: "printers" },
  { id: "d30b85e2-e544-4f48-8434-33fe0b591579", name: "phone-gimbals" },
  { id: "6c3b8591-b01e-4842-bce1-2f5585bf3a28", name: "mixer-grinders" },
  { id: "8d2a091c-4b90-4d60-b191-114b895f3e54", name: "juicers" },
  { id: "313eee86-bc11-4dc1-8cb0-6b2c2a2a1ccb", name: "trimmers" },
];

const demoProducts = [
  {
    id: "1",
    title: "Galaxy S24 Ultra 5G 256GB",
    price: 1199,
    rating: 5,
    description: "Display Dynamic AMOLED 2X da 6.8\" QHD+ 120Hz, telaio in titanio, processore Snapdragon 8 Gen 3, quadrupla fotocamera da 200MP con zoom ottico 5x, S-Pen integrata e batteria da 5000mAh con ricarica rapida 45W.",
    mainImage: "product1.webp",
    slug: "smart-phone-demo",
    manufacturer: "Samsung",
    categoryId: "3117a1b0-6369-491e-8b8b-9fdd5ad9912e",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "2",
    title: "EOS R6 Mark II Mirrorless Kit",
    price: 2149,
    rating: 5,
    description: "Fotocamera mirrorless Full-Frame da 24.2 MP con raffica fino a 40 fps, stabilizzazione IBIS fino a 8 stop, autofocus Dual Pixel CMOS AF II con AI e registrazione video 4K 60p 10-bit.",
    mainImage: "product2.webp",
    slug: "slr-camera-demo",
    manufacturer: "Canon",
    categoryId: "659a91b9-3ff6-47d5-9830-5e7ac905b961",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "3",
    title: "ProBlend Titanium Multi-Mixer 1200W",
    price: 149,
    rating: 4,
    description: "Frullatore e robot da cucina ad alta potenza da 1200W con lame in titanio a 6 punte, 3 programmi automatici, caraffa termoresistente da 2L e controllo elettronico della velocità.",
    mainImage: "product3.webp",
    slug: "mixed-grinder-demo",
    manufacturer: "ZunVolt",
    categoryId: "6c3b8591-b01e-4842-bce1-2f5585bf3a28",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "4",
    title: "Osmo Mobile 6 Gimbal Stabilizer 3-Axis",
    price: 159,
    rating: 5,
    description: "Stabilizzatore cardanico a 3 assi pieghevole per smartphone con ActiveTrack 6.0, asta di prolunga integrata, morsetto magnetico a sgancio rapido e autonomia fino a 6.5 ore.",
    mainImage: "product4.webp",
    slug: "phone-gimbal-demo",
    manufacturer: "DJI",
    categoryId: "d30b85e2-e544-4f48-8434-33fe0b591579",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "5",
    title: "Galaxy Tab S9 Ultra + Book Cover Keyboard",
    price: 899,
    rating: 4,
    description: "Tablet professionale con display Dynamic AMOLED 2X da 14.6\", certificazione IP68, S-Pen inclusa e cover tastiera magnetica retroilluminata con trackpad multi-touch.",
    mainImage: "product5.webp",
    slug: "tablet-keyboard-demo",
    manufacturer: "Samsung",
    categoryId: "ada699e5-e764-4da0-8d3e-18a8c8c5ed24",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "6",
    title: "Galaxy Buds3 Pro ANC Hi-Fi",
    price: 229,
    rating: 5,
    description: "Auricolari True Wireless con doppio driver planare + dinamico, cancellazione adattiva del rumore (ANC) intelligente, audio Hi-Fi 24-bit/96kHz, certificazione IP57 e autonomia 30 ore.",
    mainImage: "product6.webp",
    slug: "wireless-earbuds-demo",
    manufacturer: "Samsung",
    categoryId: "1cb9439a-ea47-4a33-913b-e9bf935bcc0b",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "7",
    title: "SoundSurge Pro 360° Bluetooth Speaker",
    price: 179,
    rating: 5,
    description: "Speaker wireless portatile da 60W RMS con audio spaziale a 360°, radiatori passivi dual-bass, impermeabilità IPX7, illuminazione LED RGB sincronizzata e 24 ore di riproduzione.",
    mainImage: "product7.webp",
    slug: "party-speakers-demo",
    manufacturer: "SOWO",
    categoryId: "7a241318-624f-48f7-9921-1818f6c20d85",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "8",
    title: "VitaExtract Cold Press Slow Juicer",
    price: 199,
    rating: 5,
    description: "Estrattore di succo a freddo a bassa velocità (55 giri/min) con motore silenzioso da 150W, 3 filtri intercambiabili per succhi, smoothie e sorbetti, e sistema antigoccia DripStop.",
    mainImage: "product8.webp",
    slug: "slow-juicer-demo",
    manufacturer: "Bosch",
    categoryId: "8d2a091c-4b90-4d60-b191-114b895f3e54",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "9",
    title: "WH-1000XM5 Wireless Noise Cancelling",
    price: 349,
    rating: 5,
    description: "Cuffie over-ear wireless leader di categoria con 8 microfoni e doppio processore QN1 per cancellazione del rumore, supporto LDAC Hi-Res Audio, multipoint Bluetooth 5.2 e 30 ore di batteria.",
    mainImage: "product9.webp",
    slug: "wireless-headphones-demo",
    manufacturer: "Sony",
    categoryId: "4c2cc9ec-7504-4b7c-8ecd-2379a854a423",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "10",
    title: "Galaxy Watch Ultra 47mm LTE Titanium",
    price: 589,
    rating: 5,
    description: "Smartwatch sportivo in titanio grado 4 con vetro zaffiro, GPS a doppia frequenza L1+L5, sensore BioActive avanzato (ECG, SpO2, composizione corporea), resistenza 10 ATM e 100 ore di autonomia.",
    mainImage: "product10.webp",
    slug: "smart-watch-demo",
    manufacturer: "Samsung",
    categoryId: "a6896b67-197c-4b2a-b5e2-93954474d8b4",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "11",
    title: "Spectre x360 Horizon 16\" OLED Ultra 7",
    price: 1499,
    rating: 5,
    description: "Ultrabook convertibile 2-in-1 con display touchscreen OLED 2.8K 120Hz, processore Intel Core Ultra 7 155H con NPU AI, 16GB RAM LPDDR5x, SSD NVMe 1TB PCIe 4.0, Wi-Fi 7 e Thunderbolt 4.",
    mainImage: "product11.webp",
    slug: "notebook-horizon-demo",
    manufacturer: "HP",
    categoryId: "782e7829-806b-489f-8c3a-2689548d7153",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "12",
    title: "Series 9 Pro+ Precision Beard & Hair Trimmer",
    price: 119,
    rating: 4,
    description: "Regolabarba e tagliacapelli professionale impermeabile con lame ProBlade garantite a vita, 40 lunghezze di taglio da 0.5 a 20mm con ghiera di precisione, tecnologia AutoSense e 180 min di autonomia.",
    mainImage: "product12.webp",
    slug: "mens-trimmer-demo",
    manufacturer: "Braun",
    categoryId: "313eee86-bc11-4dc1-8cb0-6b2c2a2a1ccb",
    inStock: 0,
    merchantId: "1",
  },
  {
    id: "13",
    title: "MX Master 3S Wireless Ergonomic Mouse",
    price: 109,
    rating: 5,
    description: "Mouse wireless ergonomico ad alte prestazioni con sensore ottico Darkfield da 8000 DPI tracciabile su vetro, scorrimento elettromagnetico MagSpeed da 1000 righe/sec e clic silenziosi.",
    mainImage: "mouse 1.png",
    slug: "mx-master-3s-wireless-mouse",
    manufacturer: "Logitech",
    categoryId: "da6413b4-22fd-4fbb-9741-d77580dfdcd5",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "14",
    title: "Creator Pro Workstation RTX 4070 Ti Super",
    price: 2299,
    rating: 5,
    description: "Workstation desktop per gaming 4K, rendering 3D e AI locale: CPU 16-Core, GPU NVIDIA GeForce RTX 4070 Ti Super 16GB GDDR6X, 32GB DDR5 6000MHz, SSD 2TB NVMe e raffreddamento a liquido AIO.",
    mainImage: "pc 1.png",
    slug: "creator-pro-workstation-rtx",
    manufacturer: "KronoVolt Labs",
    categoryId: "ss6412b4-22fd-4fbb-9741-d77580dfdcd2",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "15",
    title: "EcoTank Pro ET-5850 All-in-One Wi-Fi",
    price: 429,
    rating: 4,
    description: "Stampante multifunzione inkjet A4 ad altissima resa senza cartucce con serbatoi ricaricabili, stampa fronte/retro automatica 25 ppm, scanner ADF 50 fogli, Ethernet e AirPrint.",
    mainImage: "printer 1.png",
    slug: "ecotank-pro-et5850-printer",
    manufacturer: "Epson",
    categoryId: "fs6412b4-22fd-4fbb-9741-d77512dfdfa3",
    inStock: 1,
    merchantId: "1",
  },
  {
    id: "16",
    title: "ZenBook Pro 14 Duo OLED i9 32GB",
    price: 1799,
    rating: 5,
    description: "Laptop a doppio schermo per sviluppatori e creator con pannello principale OLED 14.5\" 120Hz 100% DCI-P3, secondo touchscreen ScreenPad Plus, 32GB RAM e 1TB SSD.",
    mainImage: "laptop 1.webp",
    slug: "zenbook-pro-14-duo-oled",
    manufacturer: "ASUS",
    categoryId: "782e7829-806b-489f-8c3a-2689548d7153",
    inStock: 1,
    merchantId: "1",
  },
];

async function insertDemoData() {
  for (const merchant of demoMerchant) {
    await prisma.merchant.upsert({
      where: { id: merchant.id },
      update: merchant,
      create: merchant,
    });
  }
  console.log("✔ Demo merchant upserted!");

  for (const category of demoCategories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });
  }
  console.log("✔ Demo categories upserted!");

  for (const product of demoProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }
  console.log("✔ 16 realistic products upserted!");

  // Upsert Admin and Demo Users
  const adminPassword = await bcrypt.hash("Admin1234!", 10);
  const userPassword = await bcrypt.hash("Demo1234!", 10);

  await prisma.user.upsert({
    where: { id: "admin-user-1" },
    update: { email: "admin@kronovolt.com", role: "admin", password: adminPassword },
    create: {
      id: "admin-user-1",
      email: "admin@kronovolt.com",
      password: adminPassword,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { id: "demo-user-1" },
    update: { email: "demo@kronovolt.com", role: "user", password: userPassword },
    create: {
      id: "demo-user-1",
      email: "demo@kronovolt.com",
      password: userPassword,
      role: "user",
    },
  });
  console.log("✔ Admin (admin@kronovolt.com / Admin1234!) & Demo user upserted!");

  // Insert sample orders if none exist
  const orderCount = await prisma.customer_order.count();
  if (orderCount === 0) {
    const sampleOrders = [
      {
        id: "ORD-2026-8841",
        name: "Marco",
        lastname: "Rossi",
        phone: "+39 340 1234567",
        email: "demo@kronovolt.com",
        company: "Rossi Digital Studio",
        adress: "Via Dante 18",
        apartment: "Scala B, Int. 4",
        postalCode: "20121",
        city: "Milano",
        country: "Italia",
        status: "delivered",
        orderNotice: "Consegnare in portineria al mattino",
        total: 1548,
        dateTime: new Date(Date.now() - 86400000 * 3),
        items: [
          { productId: "1", quantity: 1 },
          { productId: "9", quantity: 1 },
        ],
      },
      {
        id: "ORD-2026-9102",
        name: "Giulia",
        lastname: "Bianchi",
        phone: "+39 338 9876543",
        email: "giulia.bianchi@example.it",
        company: "Studio Architettura Bianchi",
        adress: "Corso Vittorio Emanuele 92",
        apartment: "Piano 3",
        postalCode: "10121",
        city: "Torino",
        country: "Italia",
        status: "processing",
        orderNotice: "Richiesta fattura elettronica",
        total: 1608,
        dateTime: new Date(Date.now() - 86400000 * 1),
        items: [
          { productId: "11", quantity: 1 },
          { productId: "13", quantity: 1 },
        ],
      },
      {
        id: "ORD-2026-9350",
        name: "Alessandro",
        lastname: "Conti",
        phone: "+39 347 5566778",
        email: "a.conti@techforge.it",
        company: "TechForge S.r.l.",
        adress: "Via Nazionale 114",
        apartment: "Ufficio 12",
        postalCode: "00184",
        city: "Roma",
        country: "Italia",
        status: "shipped",
        orderNotice: "",
        total: 2299,
        dateTime: new Date(),
        items: [
          { productId: "14", quantity: 1 },
        ],
      },
    ];

    for (const ord of sampleOrders) {
      const { items, ...orderData } = ord;
      await prisma.customer_order.create({ data: orderData });
      for (const item of items) {
        await prisma.customer_order_product.create({
          data: {
            customerOrderId: ord.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }
    console.log("✔ 3 sample orders inserted!");
  }
}

insertDemoData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
