import { StatusCodes } from "http-status-codes";
import Product from "../models/product";
import slugify from "slugify";
import Category from "../models/category";

export const create = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      slug: slugify(req.body.name, "-"),
      category: req.body.category,
      price: req.body.price,
      image: req.body.image,
      gallery: req.body.gallery,
      description: req.body.description,
      discount: req.body.discount,
      countInStock: req.body.countInStock,
      featured: req.body.featured,
    });
    return res.status(StatusCodes.CREATED).json({ product });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const getAll = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category");
    if (products.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không có sản phẩm nào" });
    }
    return res.status(StatusCodes.OK).json(products);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (product.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không có sản phẩm nào" });
    }
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    return res.status(StatusCodes.OK).json({ product });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(StatusCodes.OK).json({ product });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};
export const related = async (req, res) => {
  try {
    const product = await Product.find({ category: req.params.categoryId });
    return res.status(StatusCodes.OK).json(product);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const sort = req.query.sort; // Thêm tham số sort

    if (!searchTerm) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Search term is required" });
    }

    console.log("searchTerm", searchTerm);

    let sortOption = {};
    if (sort === "asc") {
      sortOption = { price: 1 }; // Sắp xếp giá tăng dần
    } else if (sort === "desc") {
      sortOption = { price: -1 }; // Sắp xếp giá giảm dần
    }

    const products = await Product.find({
      name: new RegExp(searchTerm.trim(), "i"),
    })
      .populate("category")
      .sort(sortOption); // Áp dụng sắp xếp

    console.log("products", products);

    if (products.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sản phẩm nào" });
    }

    return res.status(StatusCodes.OK).json(products);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
