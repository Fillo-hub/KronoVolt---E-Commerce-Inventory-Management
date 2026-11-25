const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");

const getAllWishlist = asyncHandler(async (request, response) => {
  const wishlist = await prisma.wishlist.findMany({
    include: {
      product: true,
    },
  });
  return response.json(wishlist);
});

const getAllWishlistByUserId = asyncHandler(async (request, response) => {
  const { userId } = request.params;
  if (!userId) {
    return response.json([]);
  }
  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: true },
  });
  return response.json(wishlist);
});

const createWishItem = asyncHandler(async (request, response) => {
  const { userId, productId } = request.body;
  if (!userId || !productId) {
    throw new AppError("userId and productId are required", 400);
  }
  const existing = await prisma.wishlist.findFirst({
    where: { userId, productId },
  });
  if (existing) {
    return response.status(200).json(existing);
  }
  const wishItem = await prisma.wishlist.create({
    data: { userId, productId },
  });
  return response.status(201).json(wishItem);
});

const deleteWishItem = asyncHandler(async (request, response) => {
  const { userId, productId } = request.params;
  await prisma.wishlist.deleteMany({
    where: { userId, productId },
  });
  return response.status(204).send();
});

const getSingleProductFromWishlist = asyncHandler(async (request, response) => {
  const { userId, productId } = request.params;
  const wishItem = await prisma.wishlist.findFirst({
    where: { userId, productId },
  });
  return response.status(200).json(wishItem || null);
});

module.exports = {
  getAllWishlistByUserId,
  getAllWishlist,
  createWishItem,
  deleteWishItem,
  getSingleProductFromWishlist,
};
