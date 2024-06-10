import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: "duzmyzmpa",
  api_key: "667322765163825",
  api_secret: "3vbirFk2VL-InUpDy7BMdpPdRdk",
});
export const UploadOnCloudinary = async (localpath: string) => {
  try {
    if (localpath) {
      const res = await cloudinary.uploader.upload(localpath, {
        resource_type: "auto",
      });
      fs.unlinkSync(localpath);
      return res;
    } else {
      fs.unlinkSync(localpath);
      return null;
    }
  } catch (error) {
    return null;
  }
};
