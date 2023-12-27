import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getBerita = async (req, res) => {
  try {
    const data = await prisma.post.findMany({
      include: {
        likes: true,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const getBeritaById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const response = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        likes: true,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createBerita = async (req, res) => {
  const { title, content, imageUrl } = req.body;
  try {
    const data = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
      },
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateBerita = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, imageUrl } = req.body;

  try {
    const existingBerita = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!existingBerita) {
      return res.status(404).json({ msg: "Berita not found" });
    }

    const updateBerita = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title: title || existingBerita.title,
        content: content || existingBerita.content,
        imageUrl: imageUrl || existingBerita.imageUrl,
      },
    });

    res.status(200).json(updateBerita);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteBerita = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.menu.delete({
      where: {
        menu_id: id,
      },
    });
    res.status(200).json({ msg: "Berita berhasil dihapus." });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
