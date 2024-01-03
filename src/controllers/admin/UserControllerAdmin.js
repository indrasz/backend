import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.staus(500).json({ msg: error.message });
  }
};

export const registerUser = async (req, res) => {
  const { name, username, password, confPassword, nik } = req.body;

  // Validasi name
  if (!name) return res.status(400).json({ msg: "Nama tidak boleh kosong" });

  // Validasi username
  if (!username)
    return res.status(400).json({ msg: "Username tidak boleh kosong" });
  else if (username.length > 16)
    return res.status(400).json({ msg: "Username maksimal 16 karakter" });

  // Validasi password
  if (!password)
    return res.status(400).json({ msg: "Password tidak boleh kosong" });
  else if (password.length < 6)
    return res.status(400).json({ msg: "Password minimal 6 karakter" });
  else if (!/^[A-Z]/.test(password))
    return res
      .status(400)
      .json({ msg: "Password harus diawali huruf kapital" });
  else if (!/(?=.*\d)(?=.*[!@#$%^&*()_+])/.test(password))
    return res
      .status(400)
      .json({ msg: "Password harus mengandung angka dan simbol" });

  // Validasi konfirmasi password
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password tidak cocok" });

  // Validasi NIK
  if (!nik) return res.status(400).json({ msg: "NIK tidak boleh kosong" });
  else if (nik.length !== 16)
    return res.status(400).json({ msg: "NIK harus memiliki 16 digit" });

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { nik }],
    },
  });
  if (existingUser)
    return res
      .status(400)
      .json({ msg: "Username atau NIK sudah terdaftar, silahkan login " });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hashSync(password, salt);

  try {
    await prisma.user.create({
      data: {
        name,
        username,
        password: hashPassword,
        nik,
      },
      select: {
        id: true,
      },
    });
    res.status(200).json({ msg: "Registrasi Berhasil " });
  } catch (error) {
    console.log(error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const usr = req.body.username;
    const pwd = req.body.password;

    if (!usr && !pwd)
      res.status(400).json({ msg: "Username dan Password tidak boleh kosong" });
    else if (!usr) res.status(400).json({ msg: "Username tidak boleh kosong" });
    else if (!pwd) res.status(400).json({ msg: "Password tidak boleh kosong" });

    const user = await prisma.user.findMany({
      where: {
        username: usr,
      },
    });

    if (!user[0]) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const match = await bcrypt.compareSync(pwd, user[0].password);
    if (!match) return res.status(400).json({ msg: "Password salah " });
    const id = user[0].id;
    const name = user[0].name;
    const username = user[0].username;
    const accessToken = jwt.sign(
      {
        id,
        name,
        username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      {
        id,
        name,
        username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await prisma.user.update({
      data: {
        refresh_token: refreshToken,
      },
      where: {
        id: id,
      },
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });
    res.json({ accessToken });
  } catch (error) {
    console.log({ msg: error.message, response: error.response });
  }
};

// export const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ msg: "Username dan password harus diisi" });
//     }

//     const user = await prisma.user.findFirst({
//       where: {
//         username,
//       },
//     });

//     if (!user) {
//       return res.status(401).json({ msg: "Username atau password salah" });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ msg: "Username atau password salah" });
//     }

//     res.status(200).json({ msg: "Login berhasil" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

export const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(400);
  const user = await prisma.user.findMany({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await prisma.user.update({
    data: {
      refresh_token: null,
    },
    where: {
      id: userId,
    },
  });
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
