import express from "express";
import {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
} from "../../controllers/admin/UserControllerAdmin.js";

import {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../../controllers/admin/DestinationController.js'; 

import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from '../../controllers/admin/NewsController.js';

import {
  getAllLetterRequests,
  getLetterRequestById,
  createLetterRequest,
  updateLetterRequest,
  deleteLetterRequest,
} from '../../controllers/admin/LetterRequestController.js'; 


import { refreshToken } from "../../controllers/admin/RefreshTokenAdmin.js";
import { verifyToken } from "../../middleware/admin/VerifyToken.js";

const router = express.Router();

// router user
router.get("/api/auth/users", verifyToken, getUsers);
router.post("/api/auth/create", registerUser);
router.post("/api/auth/login", loginUser);
router.get("/api/auth/token", refreshToken);
router.delete("/api/auth/logout", logoutUser);

// Destination Routes
router.get('/destinations', getAllDestinations);
router.get('/destinations/:destination_id', getDestinationById);
router.post('/destinations', createDestination);
router.put('/destinations/:destination_id', updateDestination);
router.delete('/destinations/:destination_id', deleteDestination);

// News Routes
router.get('/news', getAllNews);
router.get('/news/:news_id', getNewsById);
router.post('/news', createNews);
router.put('/news/:news_id', updateNews);
router.delete('/news/:news_id', deleteNews);

// LetterRequest Routes
router.get('/letter-requests', getAllLetterRequests);
router.get('/letter-requests/:request_id', getLetterRequestById);
router.post('/letter-requests', createLetterRequest);
router.put('/letter-requests/:request_id', updateLetterRequest);
router.delete('/letter-requests/:request_id', deleteLetterRequest);



export default router;
