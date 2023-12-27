import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMenu = async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        subMenus: {
          select: {
            subMenu_id: true,
            subMenu_name: true,
            subMenu_url: true,
          },
        },
      },
    });
    res.status(200).json(menus);
  } catch (error) {
    res.staus(500).json({ msg: error.message });
  }
};

export const getMenuById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const response = await prisma.menu.findUnique({
      where: {
        menu_id: id,
      },
      include: {
        subMenus: {
          select: {
            subMenu_id: true,
            subMenu_name: true,
            subMenu_url: true,
          },
        },
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createMenu = async (req, res) => {
  const { menu_name, menu_url, menu_status, subMenus } = req.body;

  try {
    const newMenu = await prisma.menu.create({
      data: {
        menu_name,
        menu_url,
        menu_status,
        subMenus: {
          createMany: {
            data: subMenus.map((subMenu) => ({
              subMenu_name: subMenu.subMenu_name,
              subMenu_url: subMenu.subMenu_url,
            })),
          },
        },
      },
      include: {
        subMenus: true,
      },
    });
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateMenu = async (req, res) => {
  const id = parseInt(req.params.id);
  const { menu_name, menu_url, menu_status, subMenus } = req.body;
  try {
    const updatedMenu = await prisma.menu.update({
      where: {
        menu_id: id,
      },
      data: {
        menu_name,
        menu_url,
        menu_status,
        subMenus: {
          upsert: subMenus.map((subMenu) => ({
            where: {
              subMenu_id: parseInt(subMenu.subMenu_id) || -1,
            },
            update: {
              subMenu_name: subMenu.subMenu_name,
              subMenu_url: subMenu.subMenu_url,
            },
            create: {
              subMenu_name: subMenu.subMenu_name,
              subMenu_url: subMenu.subMenu_url,
            },
          })),
        },
      },
      include: {
        subMenus: true,
      },
    });

    res.json(updatedMenu);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const deleteMenu = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.menu.delete({
      where: {
        menu_id: id,
      },
    });
    res.status(200).json({ msg: "Menu berhasil dihapus." });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};
