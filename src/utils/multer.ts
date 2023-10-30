import { Request } from "express";
import multer from "multer";
import HttpException from "./http.exceptions";

interface CustomFile {
  mimetype: string;
}

export const multerStorage = (folderName: string): multer.StorageEngine =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/images/${folderName}`);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${folderName}-${req.user.id}-${Date.now()}.${ext}`);
    },
  });

export const multerFilter = (req: Request, file: CustomFile, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new HttpException("Not an image! Please upload only images.", 400),
      false
    );
  }
};
