const { parse } = require("csv-parse/sync");

// Map localized/Italian or alternative column headers to canonical schema fields
function normalizeRowKeys(rawRow) {
  const normalized = {};
  for (const [k, v] of Object.entries(rawRow || {})) {
    const cleanKey = String(k)
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase();

    if (["title", "titolo", "nome", "prodotto", "product"].includes(cleanKey)) {
      normalized.title = v;
    } else if (
      ["price", "prezzo", "prezzo eur", "prezzo (€)"].includes(cleanKey)
    ) {
      normalized.price = v;
    } else if (
      ["manufacturer", "produttore", "brand", "marca"].includes(cleanKey)
    ) {
      normalized.manufacturer = v;
    } else if (
      ["instock", "stock", "disponibilita", "disponibilità"].includes(cleanKey)
    ) {
      normalized.inStock = v;
    } else if (
      ["mainimage", "image", "immagine"].includes(cleanKey)
    ) {
      normalized.mainImage = v;
    } else if (
      ["description", "descrizione", "specifiche"].includes(cleanKey)
    ) {
      normalized.description = v;
    } else if (["slug", "url"].includes(cleanKey)) {
      normalized.slug = v;
    } else if (
      ["categoryid", "category", "categoria"].includes(cleanKey)
    ) {
      normalized.categoryId = v;
    } else {
      normalized[k.trim()] = v;
    }
  }
  return normalized;
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Validate a single CSV row according to the Product schema constraints
function validateRow(rawRow) {
  const row = normalizeRowKeys(rawRow);
  const errs = [];
  const clean = {};

  const title = String(row.title ?? "").trim();
  const slug = String(row.slug ?? "").trim() || slugify(title);

  // Parse price supporting "1199", "1199,99", "€1199"
  const rawPriceStr = String(row.price ?? "")
    .replace(/[€$\s]/g, "")
    .replace(",", ".");
  const price = Number(rawPriceStr);

  const categoryId = String(row.categoryId ?? "").trim() || "smart-phones";

  // Parse inStock supporting numbers or "Disponibile"/"Esaurito"/"Si"/"No"
  const rawStockStr = String(row.inStock ?? "1").trim().toLowerCase();
  let inStock = 1;
  if (["0", "no", "false", "esaurito", "out of stock"].includes(rawStockStr)) {
    inStock = 0;
  } else if (!Number.isNaN(Number(rawStockStr))) {
    inStock = Number(rawStockStr) > 0 ? 1 : 0;
  }

  if (!title) errs.push("title (Titolo) obbligatorio");
  if (!slug) errs.push("slug obbligatorio");
  if (!Number.isFinite(price) || price < 0)
    errs.push("price (Prezzo) deve essere un numero valido");
  if (!categoryId) errs.push("categoryId (Categoria) obbligatorio");

  if (errs.length) return { ok: false, error: errs.join(", ") };

  clean.title = title;
  clean.slug = slug;
  clean.price = Math.round(price); // Prisma Product.price is Int
  clean.categoryId = categoryId;
  clean.inStock = inStock;

  clean.manufacturer = row.manufacturer
    ? String(row.manufacturer).trim()
    : "KronoVolt";
  clean.description = row.description
    ? String(row.description).trim()
    : `${title} - Garanzia Ufficiale 24 Mesi`;
  clean.mainImage = row.mainImage
    ? String(row.mainImage).trim()
    : "product1.webp";

  return { ok: true, data: clean };
}

async function parseCsvBufferToRows(buffer) {
  let text = buffer.toString("utf-8").replace(/^\uFEFF/, "");

  // Remove Excel sep=; or sep=, directive line if present
  const lines = text.split(/\r?\n/);
  if (lines[0] && /^sep=[;,|\t]$/i.test(lines[0].trim())) {
    lines.shift();
    text = lines.join("\n");
  }

  // Auto-detect delimiter from the header line (; for Italian Excel, , for standard, \t for TSV)
  const firstLine = (lines.find((l) => l.trim().length > 0) || "").trim();
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  let delimiter = ",";
  if (semicolonCount > commaCount && semicolonCount >= tabCount) {
    delimiter = ";";
  } else if (tabCount > commaCount && tabCount > semicolonCount) {
    delimiter = "\t";
  }

  const records = parse(text, {
    columns: true,
    delimiter,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  });
  return records;
}

function computeBatchStatus(successCount, errorCount) {
  if (successCount > 0 && errorCount === 0) return "COMPLETED";
  if (successCount > 0 && errorCount > 0) return "PARTIAL";
  if (successCount === 0 && errorCount > 0) return "FAILED";
  return "PENDING";
}

// Create products + items for valid rows, error items for invalid
async function createBatchWithItems(tx, batchId, validRows, errorRows) {
  // Ensure a valid default merchant exists for foreign key merchantId
  let defaultMerchant = await tx.merchant.findFirst();
  if (!defaultMerchant) {
    defaultMerchant = await tx.merchant.create({
      data: {
        id: "1",
        name: "KronoVolt Official Store",
        status: "ACTIVE",
      },
    });
  }

  // Fetch all categories for ID and case-insensitive name lookup
  const allCategories = await tx.category.findMany({
    select: { id: true, name: true },
  });

  const categoryMap = new Map();
  allCategories.forEach((cat) => {
    categoryMap.set(cat.id.toLowerCase(), cat.id);
    categoryMap.set(cat.name.toLowerCase(), cat.id);
    categoryMap.set(cat.name.toLowerCase().replace(/-/g, " "), cat.id);
  });

  let success = 0;
  let failed = 0;

  for (const row of validRows) {
    const rawCatKey = row.categoryId.toLowerCase();
    let resolvedCategoryId =
      categoryMap.get(rawCatKey) ||
      categoryMap.get(rawCatKey.replace(/\s+/g, "-"));

    // If category doesn't exist yet, create it dynamically so valid CSV rows never fail
    if (!resolvedCategoryId && rawCatKey) {
      try {
        const newCatName = slugify(rawCatKey) || "electronics";
        const createdCat = await tx.category.upsert({
          where: { name: newCatName },
          update: {},
          create: { name: newCatName },
        });
        resolvedCategoryId = createdCat.id;
        categoryMap.set(rawCatKey, resolvedCategoryId);
        categoryMap.set(newCatName, resolvedCategoryId);
      } catch {
        resolvedCategoryId = allCategories[0]?.id || null;
      }
    }

    if (!resolvedCategoryId) {
      await tx.bulk_upload_item.create({
        data: {
          batchId,
          title: row.title,
          slug: row.slug,
          price: row.price,
          manufacturer: row.manufacturer,
          description: row.description,
          mainImage: row.mainImage,
          categoryId: row.categoryId,
          inStock: row.inStock,
          status: "ERROR",
          error: `Categoria non trovata: ${row.categoryId}`,
        },
      });
      failed++;
      continue;
    }

    try {
      const productData = {
        title: row.title,
        slug: row.slug,
        price: row.price,
        rating: 5,
        description: row.description ?? "",
        manufacturer: row.manufacturer ?? "KronoVolt",
        mainImage: row.mainImage ?? "product1.webp",
        categoryId: resolvedCategoryId,
        inStock: row.inStock,
        merchantId: defaultMerchant.id,
      };

      const product = await tx.product.upsert({
        where: { slug: row.slug },
        update: productData,
        create: productData,
      });

      await tx.bulk_upload_item.create({
        data: {
          batchId,
          productId: product.id,
          title: row.title,
          slug: row.slug,
          price: row.price,
          manufacturer: row.manufacturer,
          description: row.description,
          mainImage: row.mainImage,
          categoryId: resolvedCategoryId,
          inStock: row.inStock,
          status: "CREATED",
          error: null,
        },
      });
      success++;
    } catch (e) {
      await tx.bulk_upload_item.create({
        data: {
          batchId,
          title: row.title,
          slug: row.slug,
          price: row.price,
          manufacturer: row.manufacturer,
          description: row.description,
          mainImage: row.mainImage,
          categoryId: resolvedCategoryId || row.categoryId,
          inStock: row.inStock,
          status: "ERROR",
          error: e?.message || "Creazione prodotto fallita",
        },
      });
      failed++;
    }
  }

  for (const err of errorRows) {
    await tx.bulk_upload_item.create({
      data: {
        batchId,
        title: "",
        slug: "",
        price: 0,
        manufacturer: null,
        description: null,
        mainImage: null,
        categoryId: "",
        inStock: 0,
        status: "ERROR",
        error: `Riga ${err.index}: ${err.error}`,
      },
    });
    failed++;
  }

  return { successCount: success, errorCount: failed };
}

async function getBatchSummary(prisma, batchId) {
  const total = await prisma.bulk_upload_item.count({ where: { batchId } });
  const errors = await prisma.bulk_upload_item.count({
    where: { batchId, status: "ERROR" },
  });
  const created = await prisma.bulk_upload_item.count({
    where: { batchId, status: "CREATED" },
  });
  const updated = await prisma.bulk_upload_item.count({
    where: { batchId, status: "UPDATED" },
  });
  return { total, errors, created, updated };
}

async function canDeleteProductsForBatch(prisma, batchId) {
  const items = await prisma.bulk_upload_item.findMany({
    where: { batchId, productId: { not: null } },
    select: { productId: true },
  });
  const productIds = items.map((i) => i.productId).filter(Boolean);

  if (productIds.length === 0) {
    return { canDelete: true, blockedProductIds: [] };
  }

  const referenced = await prisma.customer_order_product.findMany({
    where: { productId: { in: productIds } },
    select: { productId: true },
  });

  const blocked = new Set(referenced.map((r) => r.productId));
  const blockedList = productIds.filter((id) => blocked.has(id));

  if (blockedList.length > 0) {
    return {
      canDelete: false,
      reason: "Alcuni prodotti sono associati a ordini esistenti",
      blockedProductIds: blockedList,
    };
  }

  return { canDelete: true, blockedProductIds: [] };
}

async function applyItemUpdates(tx, batchId, updates) {
  const ids = updates.map((u) => u.itemId);
  const items = await tx.bulk_upload_item.findMany({
    where: { id: { in: ids }, batchId },
    select: { id: true, productId: true },
  });
  const byId = new Map(items.map((i) => [i.id, i]));
  const result = [];

  for (const upd of updates) {
    const current = byId.get(upd.itemId);
    if (!current) continue;

    const price = Math.round(Number(upd.price));
    const inStock = Number(upd.inStock) === 1 ? 1 : 0;

    if (current.productId) {
      await tx.product.update({
        where: { id: current.productId },
        data: { price, inStock },
      });
    }

    const updatedItem = await tx.bulk_upload_item.update({
      where: { id: upd.itemId },
      data: { price, inStock, status: "UPDATED", error: null },
    });
    result.push(updatedItem);
  }
  return result;
}

module.exports = {
  parseCsvBufferToRows,
  validateRow,
  createBatchWithItems,
  computeBatchStatus,
  getBatchSummary,
  canDeleteProductsForBatch,
  applyItemUpdates,
};
