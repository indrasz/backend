import { PrismaClient } from "@prisma/client";
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

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

const upload = multer({ storage: storage }).single('pdf_file');

export const downloadLetterRequestPdf = async (req, res) => {
    const { request_id } = req.params;

    try {
        const letterRequest = await prisma.letterRequest.findUnique({
            where: { request_id },
            select: { pdf_file: true },
        });

        if (!letterRequest) {
            return res.status(404).json({ msg: 'Letter request not found' });
        }

        const pdfFilePath = letterRequest.pdf_file;

        if (!pdfFilePath) {
            return res.status(404).json({ msg: 'PDF file not found for the letter request' });
        }

        const absolutePath = path.resolve(pdfFilePath);

        res.download(absolutePath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

export const getAllLetterRequests = async (req, res) => {
    try {
        const letterRequests = await prisma.letterRequest.findMany({
            select: {
                request_id: true,
                requester_name: true,
                requester_nik: true,
                letter_type: true,
                purpose: true,
                status: true,
                pdf_file: true,
                submitted_at: true,
                updated_at: true,
            },
        });
        res.status(200).json(letterRequests);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getLetterRequestById = async (req, res) => {
    const { request_id } = req.params;
    try {
        const letterRequest = await prisma.letterRequest.findUnique({
            where: { request_id },
        });
        res.status(200).json(letterRequest);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createLetterRequest = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.error('File Upload Error:', err);

            if (err instanceof multer.MulterError) {
                // Handle specific Multer errors
                return res.status(400).json({ msg: 'MulterError: ' + err.message });
            }

            return res.status(400).json({ msg: 'Error uploading file.' });
        }

        const { requester_name, requester_nik, letter_type, purpose } = req.body;
        const pdf_file = req.file ? req.file.path : null;
        const status = "PENDING";

        try {
            const newLetterRequest = await prisma.letterRequest.create({
                data: {
                    requester_name,
                    requester_nik,
                    letter_type,
                    purpose,
                    status,
                    pdf_file,
                },
            });
            res.status(201).json(newLetterRequest);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};

export const updateLetterRequest = async (req, res) => {

    upload(req, res, async function (err) {
        if (err) {
            console.error('File Upload Error:', err);

            if (err instanceof multer.MulterError) {
                // Handle specific Multer errors
                return res.status(400).json({ msg: 'MulterError: ' + err.message });
            }

            return res.status(400).json({ msg: 'Error uploading file.' });
        }

        const { request_id } = req.params;
        const { requester_name, requester_nik, letter_type, purpose, status } = req.body;

        const updatedData = {
            requester_name,
            requester_nik,
            letter_type,
            purpose,
            status,
        };

        if (req.file) {
            updatedData.pdf_file = req.file.path;
        }

        try {
            const updatedLetterRequest = await prisma.letterRequest.update({
                where: { request_id },
                data: updatedData,
            });
            res.status(200).json(updatedLetterRequest);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};

export const deleteLetterRequest = async (req, res) => {
    const { request_id } = req.params;
    try {
        const deletedLetterRequest = await prisma.letterRequest.delete({
            where: { request_id },
        });
        res.status(200).json(deletedLetterRequest);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
