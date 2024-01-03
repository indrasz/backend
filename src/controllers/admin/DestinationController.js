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

const upload = multer({ storage: storage }).single('image');

export const getAllDestinations = async (req, res) => {
    try {
        const destinations = await prisma.destination.findMany({
            select: {
                destination_id: true,
                name: true,
                description: true,
                location: true,
                category: true,
                created_at: true,
                updated_at: true,
            },
        });
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getDestinationById = async (req, res) => {
    const { destination_id } = req.params;
    try {
        const destination = await prisma.destination.findUnique({
            where: { destination_id },
        });
        res.status(200).json(destination);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createDestination = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.error('File Upload Error:', err);

            if (err instanceof multer.MulterError) {
                // Handle specific Multer errors
                return res.status(400).json({ msg: 'MulterError: ' + err.message });
            }

            return res.status(400).json({ msg: 'Error uploading file.' });
        }

        const { name, description, location, category } = req.body;
        const image = req.file ? req.file.path : null;

        try {
            const newDestination = await prisma.destination.create({
                data: {
                    name,
                    description,
                    location,
                    category,
                    image,
                },
            });
            res.status(201).json(newDestination);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};

export const updateDestination = async (req, res) => {
    const { destination_id } = req.params;
    const { name, description, location, category } = req.body;

    upload(req, res, async function (err) {
        if (err) {
            console.error('File Upload Error:', err);

            if (err instanceof multer.MulterError) {
                // Handle specific Multer errors
                return res.status(400).json({ msg: 'MulterError: ' + err.message });
            }

            return res.status(400).json({ msg: 'Error uploading file.' });
        }

        const updatedData = {
            name,
            description,
            location,
            category,
        };

        if (req.file) {
            updatedData.image = req.file.path;
        }

        try {
            const updatedDestination = await prisma.destination.update({
                where: { destination_id },
                data: updatedData,
            });
            res.status(200).json(updatedDestination);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    });
};

export const deleteDestination = async (req, res) => {
    const { destination_id } = req.params;
    try {
        const deletedDestination = await prisma.destination.delete({
            where: { destination_id },
        });
        res.status(200).json(deletedDestination);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};