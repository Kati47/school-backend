import { Router } from "express";
import multer from "multer";
import path from "path";
import { GridFSBucket, ObjectId } from "mongodb";
import mongoose from "mongoose";
import { authenticate } from "../../common/middleware/auth";
import { asyncHandler } from "../../common/middleware/asyncHandler";
import { FileModel } from "./file.model";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    if (!mongoose.connection.db) {
      return res.status(500).json({ message: "Database not ready" });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const storedName = `${Date.now()}-${req.file.originalname}`;
    const uploadStream = bucket.openUploadStream(storedName, {
      contentType: req.file.mimetype,
      metadata: { uploaderId: req.user?.id }
    });

    await new Promise<void>((resolve, reject) => {
      uploadStream.on("finish", () => resolve());
      uploadStream.on("error", (error) => reject(error));
      uploadStream.end(req.file?.buffer);
    });

    const fileId = uploadStream.id as ObjectId;
    const fileUrl = path.posix.join("/files", fileId.toString());
    const record = await FileModel.create({
      uploaderId: req.user?.id,
      gridFsId: fileId,
      originalName: req.file.originalname,
      storedName,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl
    });

    return res.status(201).json(record);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.connection.db) {
      return res.status(500).json({ message: "Database not ready" });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const fileId = new ObjectId(req.params.id);
    res.setHeader("Content-Type", "application/octet-stream");
    bucket.openDownloadStream(fileId).pipe(res);
  })
);

export default router;
