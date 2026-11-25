const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const MERCHANTS = [
  {
    id: "1",
    name: "KronoVolt Official Store",
    email: "store@kronovolt.com",
    description:
      "Distributore ufficiale di elettronica di consumo, informatica, audio professionale e fotografia.",
    phone: "+39 02 9475 8210",
    address: "Via Torino 45, 20123 Milano (MI), Italia",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "KronoVolt Pro B2B Division",
    email: "b2b@kronovolt.com",
    description:
      "Forniture hardware aziendali, workstation grafiche RTX e soluzioni per uffici e studi creativi.",
    phone: "+39 02 9475 8299",
    address: "Viale Certosa 210, 20156 Milano (MI), Italia",
    status: "ACTIVE",
  },
];

const CATEGORIES = [
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

const PRODUCTS = [
  {
    id: "1",
    slug: "smart-phone-demo",
    title: "Galaxy S24 Ultra 5G 256GB",
    price: 1199,
    rating: 5,
    description:
      'Display Dynamic AMOLED 2X da 6.8" QHD+ 120Hz, telaio in titanio, processore Snapdragon 8 Gen 3, quadrupla fotocamera da 200MP con zoom ottico 5x, S-Pen integrata e batteria da 5000mAh con ricarica rapida 45W.',
    mainImage: "product1.webp",
    manufacturer: "Samsung",
    categoryName: "smart-phones",
    inStock: 1,
    merchantId: "1",
    gallery: ["smart-phone-1.png", "smart-phone-2.png"],
  },
  {
    id: "2",
    slug: "slr-camera-demo",
    title: "EOS R6 Mark II Mirrorless Kit",
    price: 2149,
    rating: 5,
    description:
      "Fotocamera mirrorless Full-Frame da 24.2 MP con raffica fino a 40 fps, stabilizzazione IBIS fino a 8 stop, autofocus Dual Pixel CMOS AF II con AI e registrazione video 4K 60p 10-bit.",
    mainImage: "product2.webp",
    manufacturer: "Canon",
    categoryName: "cameras",
    inStock: 1,
    merchantId: "1",
    gallery: ["camera-1.png", "camera-2.png"],
  },
  {
    id: "3",
    slug: "mixed-grinder-demo",
    title: "ProBlend Titanium Multi-Mixer 1200W",
    price: 149,
    rating: 4,
    description:
      "Frullatore e robot da cucina ad alta potenza da 1200W con lame in titanio a 6 punte, 3 programmi automatici, caraffa termoresistente da 2L e controllo elettronico della velocità.",
    mainImage: "product3.webp",
    manufacturer: "ZunVolt",
    categoryName: "mixer-grinders",
    inStock: 1,
    merchantId: "1",
    gallery: [],
  },
  {
    id: "4",
    slug: "phone-gimbal-demo",
    title: "Osmo Mobile 6 Gimbal Stabilizer 3-Axis",
    price: 159,
    rating: 5,
    description:
      "Stabilizzatore cardanico a 3 assi pieghevole per smartphone con ActiveTrack 6.0, asta di prolunga integrata, morsetto magnetico a sgancio rapido e autonomia fino a 6.5 ore.",
    mainImage: "product4.webp",
    manufacturer: "DJI",
    categoryName: "phone-gimbals",
    inStock: 1,
    merchantId: "1",
    gallery: [],
  },
  {
    id: "5",
    slug: "tablet-keyboard-demo",
    title: "Galaxy Tab S9 Ultra + Book Cover Keyboard",
    price: 899,
    rating: 4,
    description:
      'Tablet professionale con display Dynamic AMOLED 2X da 14.6", certificazione IP68, S-Pen inclusa e cover tastiera magnetica retroilluminata con trackpad multi-touch.',
    mainImage: "product5.webp",
    manufacturer: "Samsung",
    categoryName: "tablets",
    inStock: 1,
    merchantId: "1",
    gallery: ["tablet-1-1.png", "tablet-2-1.png"],
  },
  {
    id: "6",
    slug: "wireless-earbuds-demo",
    title: "Galaxy Buds3 Pro ANC Hi-Fi",
    price: 229,
    rating: 5,
    description:
      "Auricolari True Wireless con doppio driver planare + dinamico, cancellazione adattiva del rumore (ANC) intelligente, audio Hi-Fi 24-bit/96kHz, certificazione IP57 e autonomia 30 ore.",
    mainImage: "product6.webp",
    manufacturer: "Samsung",
    categoryName: "earbuds",
    inStock: 1,
    merchantId: "1",
    gallery: ["earbuds-1.png", "earbuds-2.png"],
  },
  {
    id: "7",
    slug: "party-speakers-demo",
    title: "SoundSurge Pro 360° Bluetooth Speaker",
    price: 179,
    rating: 5,
    description:
      "Speaker wireless portatile da 60W RMS con audio spaziale a 360°, radiatori passivi dual-bass, impermeabilità IPX7, illuminazione LED RGB sincronizzata e 24 ore di riproduzione.",
    mainImage: "product7.webp",
    manufacturer: "SOWO",
    categoryName: "speakers",
    inStock: 1,
    merchantId: "1",
    gallery: ["sony-speaker-image-1.jpg", "sony-speaker-image-2.jpg"],
  },
  {
    id: "8",
    slug: "slow-juicer-demo",
    title: "VitaExtract Cold Press Slow Juicer",
    price: 199,
    rating: 5,
    description:
      "Estrattore di succo a freddo a bassa velocità (55 giri/min) con motore silenzioso da 150W, 3 filtri intercambiabili per succhi, smoothie e sorbetti, e sistema antigoccia DripStop.",
    mainImage: "product8.webp",
    manufacturer: "Bosch",
    categoryName: "juicers",
    inStock: 1,
    merchantId: "1",
    gallery: [],
  },
  {
    id: "9",
    slug: "wireless-headphones-demo",
    title: "WH-1000XM5 Wireless Noise Cancelling",
    price: 349,
    rating: 5,
    description:
      "Cuffie over-ear wireless leader di categoria con 8 microfoni e doppio processore QN1 per cancellazione del rumore, supporto LDAC Hi-Res Audio, multipoint Bluetooth 5.2 e 30 ore di batteria.",
    mainImage: "product9.webp",
    manufacturer: "Sony",
    categoryName: "headphones",
    inStock: 1,
    merchantId: "1",
    gallery: ["headphones-1.png", "headphones-2.png"],
  },
  {
    id: "10",
    slug: "smart-watch-demo",
    title: "Galaxy Watch Ultra 47mm LTE Titanium",
    price: 589,
    rating: 5,
    description:
      "Smartwatch sportivo in titanio grado 4 con vetro zaffiro, GPS a doppia frequenza L1+L5, sensore BioActive avanzato (ECG, SpO2, composizione corporea), resistenza 10 ATM e 100 ore di autonomia.",
    mainImage: "product10.webp",
    manufacturer: "Samsung",
    categoryName: "watches",
    inStock: 1,
    merchantId: "1",
    gallery: ["smart-watch-1.png", "smart-watch-2.png"],
  },
  {
    id: "11",
    slug: "notebook-horizon-demo",
    title: 'Spectre x360 Horizon 16" OLED Ultra 7',
    price: 1499,
    rating: 5,
    description:
      "Ultrabook convertibile 2-in-1 con display touchscreen OLED 2.8K 120Hz, processore Intel Core Ultra 7 155H con NPU AI, 16GB RAM LPDDR5x, SSD NVMe 1TB PCIe 4.0, Wi-Fi 7 e Thunderbolt 4.",
    mainImage: "product11.webp",
    manufacturer: "HP",
    categoryName: "laptops",
    inStock: 1,
    merchantId: "2",
    gallery: ["laptop-1.webp", "laptop-2.webp"],
  },
  {
    id: "12",
    slug: "mens-trimmer-demo",
    title: "Series 9 Pro+ Precision Beard & Hair Trimmer",
    price: 119,
    rating: 4,
    description:
      "Regolabarba e tagliacapelli professionale impermeabile con lame ProBlade garantite a vita, 40 lunghezze di taglio da 0.5 a 20mm con ghiera di precisione, tecnologia AutoSense e 180 min di autonomia.",
    mainImage: "product12.webp",
    manufacturer: "Braun",
    categoryName: "trimmers",
    inStock: 0,
    merchantId: "1",
    gallery: [],
  },
  {
    id: "13",
    slug: "mx-master-3s-wireless-mouse",
    title: "MX Master 3S Wireless Ergonomic Mouse",
    price: 109,
    rating: 5,
    description:
      "Mouse wireless ergonomico ad alte prestazioni con sensore ottico Darkfield da 8000 DPI tracciabile su vetro, scorrimento elettromagnetico MagSpeed da 1000 righe/sec e clic silenziosi.",
    mainImage: "mouse-1.png",
    manufacturer: "Logitech",
    categoryName: "mouses",
    inStock: 1,
    merchantId: "2",
    gallery: ["mouse-1-2.png", "mouse-1-3.png"],
  },
  {
    id: "14",
    slug: "creator-pro-workstation-rtx",
    title: "Creator Pro Workstation RTX 4070 Ti Super",
    price: 2299,
    rating: 5,
    description:
      "Workstation desktop per gaming 4K, rendering 3D e AI locale: CPU 16-Core, GPU NVIDIA GeForce RTX 4070 Ti Super 16GB GDDR6X, 32GB DDR5 6000MHz, SSD 2TB NVMe e raffreddamento a liquido AIO.",
    mainImage: "pc-1.png",
    manufacturer: "KronoVolt Labs",
    categoryName: "computers",
    inStock: 1,
    merchantId: "2",
    gallery: ["pc-2.png", "pc-3.png"],
  },
  {
    id: "15",
    slug: "ecotank-pro-et5850-printer",
    title: "EcoTank Pro ET-5850 All-in-One Wi-Fi",
    price: 429,
    rating: 4,
    description:
      "Stampante multifunzione inkjet A4 ad altissima resa senza cartucce con serbatoi ricaricabili, stampa fronte/retro automatica 25 ppm, scanner ADF 50 fogli, Ethernet e AirPrint.",
    mainImage: "printer-1.png",
    manufacturer: "Epson",
    categoryName: "printers",
    inStock: 1,
    merchantId: "2",
    gallery: ["printer-2.png"],
  },
  {
    id: "16",
    slug: "zenbook-pro-14-duo-oled",
    title: "ZenBook Pro 14 Duo OLED i9 32GB",
    price: 1799,
    rating: 5,
    description:
      'Laptop a doppio schermo per sviluppatori e creator con pannello principale OLED 14.5" 120Hz 100% DCI-P3, secondo touchscreen ScreenPad Plus, 32GB RAM e 1TB SSD.',
    mainImage: "laptop-1.webp",
    manufacturer: "ASUS",
    categoryName: "laptops",
    inStock: 1,
    merchantId: "2",
    gallery: ["laptop-3.webp", "laptop-4.webp"],
  },
];

async function main() {
  console.log("🚀 Avvio seed idempotente del database KronoVolt...\n");

  // 1. Merchants
  for (const merchant of MERCHANTS) {
    await prisma.merchant.upsert({
      where: { id: merchant.id },
      update: {
        name: merchant.name,
        email: merchant.email,
        description: merchant.description,
        phone: merchant.phone,
        address: merchant.address,
        status: merchant.status,
      },
      create: merchant,
    });
  }
  console.log(`✔ ${MERCHANTS.length} merchant sincronizzati.`);

  // 2. Categories (upsert by @unique name)
  const categoryIdByName = new Map();
  for (const cat of CATEGORIES) {
    const saved = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { id: cat.id, name: cat.name },
    });
    categoryIdByName.set(cat.name, saved.id);
  }
  console.log(`✔ ${CATEGORIES.length} categorie sincronizzate.`);

  // 3. Products (upsert by @unique slug) + Gallery Images
  const productBySlug = new Map();
  let imageCount = 0;

  for (const prod of PRODUCTS) {
    const categoryId = categoryIdByName.get(prod.categoryName);
    const savedProduct = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        title: prod.title,
        price: prod.price,
        rating: prod.rating,
        description: prod.description,
        mainImage: prod.mainImage,
        manufacturer: prod.manufacturer,
        inStock: prod.inStock,
        categoryId,
        merchantId: prod.merchantId,
      },
      create: {
        id: prod.id,
        slug: prod.slug,
        title: prod.title,
        price: prod.price,
        rating: prod.rating,
        description: prod.description,
        mainImage: prod.mainImage,
        manufacturer: prod.manufacturer,
        inStock: prod.inStock,
        categoryId,
        merchantId: prod.merchantId,
      },
    });
    productBySlug.set(prod.slug, savedProduct);

    // Sync gallery images idempotently
    for (let i = 0; i < prod.gallery.length; i++) {
      const imgFile = prod.gallery[i];
      const deterministicImageId = `img-${prod.slug}-${i + 1}`;
      await prisma.image.upsert({
        where: { imageID: deterministicImageId },
        update: {
          productID: savedProduct.id,
          image: imgFile,
        },
        create: {
          imageID: deterministicImageId,
          productID: savedProduct.id,
          image: imgFile,
        },
      });
      imageCount++;
    }
  }
  console.log(
    `✔ ${PRODUCTS.length} prodotti e ${imageCount} immagini galleria sincronizzati.`
  );

  // 4. Users (upsert by @unique email)
  const adminPasswordHash = await bcrypt.hash("Admin1234!", 10);
  const demoPasswordHash = await bcrypt.hash("Demo1234!", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@kronovolt.com" },
    update: { role: "admin", password: adminPasswordHash },
    create: {
      id: "admin-user-1",
      email: "admin@kronovolt.com",
      password: adminPasswordHash,
      role: "admin",
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@kronovolt.com" },
    update: { role: "user", password: demoPasswordHash },
    create: {
      id: "demo-user-1",
      email: "demo@kronovolt.com",
      password: demoPasswordHash,
      role: "user",
    },
  });
  console.log(
    "✔ Utenti sincronizzati (admin@kronovolt.com / Admin1234! | demo@kronovolt.com / Demo1234!)."
  );

  // 5. Customer Orders + Order Line Items
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
      dateTime: new Date("2026-11-20T10:15:00.000Z"),
      items: [
        { key: "1", slug: "smart-phone-demo", quantity: 1 },
        { key: "2", slug: "wireless-headphones-demo", quantity: 1 },
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
      dateTime: new Date("2026-11-22T14:30:00.000Z"),
      items: [
        { key: "1", slug: "notebook-horizon-demo", quantity: 1 },
        { key: "2", slug: "mx-master-3s-wireless-mouse", quantity: 1 },
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
      dateTime: new Date("2026-11-24T09:00:00.000Z"),
      items: [{ key: "1", slug: "creator-pro-workstation-rtx", quantity: 1 }],
    },
  ];

  for (const ord of sampleOrders) {
    const { items, ...orderData } = ord;
    await prisma.customer_order.upsert({
      where: { id: ord.id },
      update: {
        status: orderData.status,
        total: orderData.total,
      },
      create: orderData,
    });

    for (const item of items) {
      const prod = productBySlug.get(item.slug);
      if (!prod) continue;
      const existingLine = await prisma.customer_order_product.findFirst({
        where: {
          customerOrderId: ord.id,
          productId: prod.id,
        },
      });
      if (!existingLine) {
        await prisma.customer_order_product.create({
          data: {
            id: `cop-${ord.id}-${item.key}`,
            customerOrderId: ord.id,
            productId: prod.id,
            quantity: item.quantity,
          },
        });
      }
    }
  }
  console.log(`✔ ${sampleOrders.length} ordini clienti e righe ordine sincronizzati.`);

  // 6. Wishlist entries for Demo User
  const wishlistSlugs = ["smart-watch-demo", "zenbook-pro-14-duo-oled"];
  for (const slug of wishlistSlugs) {
    const prod = productBySlug.get(slug);
    if (!prod) continue;
    const existingWish = await prisma.wishlist.findFirst({
      where: { userId: demoUser.id, productId: prod.id },
    });
    if (!existingWish) {
      await prisma.wishlist.create({
        data: { userId: demoUser.id, productId: prod.id },
      });
    }
  }
  console.log("✔ Lista desideri demo sincronizzata.");

  // 7. Notifications
  const notifications = [
    {
      id: "notif-demo-order-8841",
      userId: demoUser.id,
      title: "Ordine #ORD-2026-8841 consegnato",
      message:
        "Il tuo ordine con Galaxy S24 Ultra 5G e Sony WH-1000XM5 è stato consegnato con successo.",
      type: "ORDER_UPDATE",
      isRead: false,
      priority: "NORMAL",
      metadata: { orderId: "ORD-2026-8841", status: "delivered" },
    },
    {
      id: "notif-admin-stock-alert",
      userId: adminUser.id,
      title: "Avviso Magazzino: 1 prodotto esaurito",
      message:
        "Series 9 Pro+ Precision Beard & Hair Trimmer ha disponibilità 0. Esegui il riassortimento dalla dashboard inventario.",
      type: "SYSTEM_ALERT",
      isRead: false,
      priority: "HIGH",
      metadata: { slug: "mens-trimmer-demo", inStock: 0 },
    },
  ];

  for (const notif of notifications) {
    await prisma.notification.upsert({
      where: { id: notif.id },
      update: {
        title: notif.title,
        message: notif.message,
      },
      create: notif,
    });
  }
  console.log(`✔ ${notifications.length} notifiche sincronizzate.`);

  // 8. Sample Completed Bulk Upload Batch (Inventory Audit History)
  const batchId = "batch-initial-catalog-2026";
  await prisma.bulk_upload_batch.upsert({
    where: { id: batchId },
    update: {
      status: "COMPLETED",
      itemCount: 3,
      errorCount: 0,
    },
    create: {
      id: batchId,
      fileName: "catalogo-iniziale-kronovolt-2026.csv",
      status: "COMPLETED",
      itemCount: 3,
      errorCount: 0,
      userId: adminUser.id,
    },
  });

  const batchSlugs = [
    "smart-phone-demo",
    "notebook-horizon-demo",
    "wireless-headphones-demo",
  ];
  for (let i = 0; i < batchSlugs.length; i++) {
    const prod = productBySlug.get(batchSlugs[i]);
    if (!prod) continue;
    await prisma.bulk_upload_item.upsert({
      where: { id: `bui-initial-${i + 1}` },
      update: {
        productId: prod.id,
        price: prod.price,
        inStock: prod.inStock,
        status: "CREATED",
      },
      create: {
        id: `bui-initial-${i + 1}`,
        batchId,
        productId: prod.id,
        title: prod.title,
        slug: prod.slug,
        price: prod.price,
        manufacturer: prod.manufacturer,
        description: prod.description,
        mainImage: prod.mainImage,
        categoryId: prod.categoryId,
        inStock: prod.inStock,
        status: "CREATED",
        error: null,
      },
    });
  }
  console.log("✔ Storico lotto bulk-upload inventario sincronizzato.");
  console.log("\n✅ Seed completato con successo!");
}

main()
  .catch((error) => {
    console.error("❌ Errore durante il seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
