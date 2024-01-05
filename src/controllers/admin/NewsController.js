import { PrismaClient } from "@prisma/client";
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

// Set storage engineck file type
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const currentModuleURL = new URL(import.meta.url);
            const currentModulePath = path.dirname(currentModuleURL.pathname);
            const uploadPath = path.join(currentModulePath, 'uploads');

            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            console.error('Error creating folder:', error);
            cb(error, null);
        }
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname;
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, 
}).single('thumbnail');

export const getAllNews = async (req, res) => {
    try {
        // Menangani upload gambar
        upload(req, res, async function (err) {
            if (err) {
                console.error('File Upload Error:', err);

                if (err instanceof multer.MulterError) {
                    // Handle specific Multer errors
                    return res.status(400).json({ msg: 'MulterError: ' + err.message });
                }

                return res.status(400).json({ msg: 'Error uploading file.' });
            }

            // Jika upload berhasil, lanjutkan mendapatkan data berita
            const news = await prisma.news.findMany({
                select: {
                    news_id: true,
                    title: true,
                    content: true,
                    category: true,
                    thumbnail: true,
                    author: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            const newsWithFullThumbnailPath = news.map((item) => ({
                ...item,
                thumbnail: path.resolve(item.thumbnail), // Menggunakan path.resolve untuk mendapatkan path absolut
            }));

            res.status(200).json(newsWithFullThumbnailPath);
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getNewsById = async (req, res) => {
    const { news_id } = req.params;
    try {
        const news = await prisma.news.findUnique({
            where: { news_id },
        });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createNews = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.error('File Upload Error:', err);

            if (err instanceof multer.MulterError) {
                // Handle specific Multer errors
                return res.status(400).json({ msg: 'MulterError: ' + err.message });
            }

            return res.status(400).json({ msg: 'Error uploading file.' });
        }

        const { title, content, author, category, source } = req.body;
        const thumbnail = req.file ? req.file.path : null;

        try {
            const newNews = await prisma.news.create({
                data: {
                    title,
                    content,
                    author,
                    category,
                    thumbnail,
                    source,
                },
            });
            res.status(201).json(newNews);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ msg: 'Error creating news.' });
        }
    });
};

export const updateNews = async (req, res) => {

    upload(req, res, async function (err) {
        if (err) {
            console.error('File Upload Error:', err);

            if (err instanceof multer.MulterError) {
                // Handle specific Multer errors
                return res.status(400).json({ msg: 'MulterError: ' + err.message });
            }

            return res.status(400).json({ msg: 'Error uploading file.' });
        }

        const { news_id } = req.params;
        const { title, content, author, category, source } = req.body;

        const updatedData = {
            title,
            content,
            author,
            category,
            source,
        };

        if (req.file) {
            updatedData.thumbnail = req.file.path;
        }

        try {
            const updatedNews = await prisma.news.update({
                where: { news_id },
                data: updatedData,
            });
            res.status(200).json(updatedNews);
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ msg: 'Error updating news.' });
        }
    });
};

export const deleteNews = async (req, res) => {
    const { news_id } = req.params;
    try {
        const deletedNews = await prisma.news.delete({
            where: { news_id },
        });
        res.status(200).json(deletedNews);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};