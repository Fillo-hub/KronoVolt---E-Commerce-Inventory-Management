const prisma = require("../utills/db");

async function searchProducts(request, response) {
  try {
    const { query } = request.query;
    if (!query || !query.trim()) {
      const allProducts = await prisma.product.findMany({
        take: 24,
        include: { category: true },
      });
      return response.json(allProducts);
    }

    const q = query.trim();
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { manufacturer: { contains: q, mode: "insensitive" } },
          { category: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: {
        category: true,
      },
    });

    return response.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    return response.status(500).json({ error: "Error searching products" });
  }
}

module.exports = { searchProducts };
