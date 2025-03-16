// deleteImage.ts
import fs from "fs";
import path from "path";

interface DeleteImageOptions {
  folder: string;
  image: string;
}

const deleteImage = (options: DeleteImageOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { folder, image } = options;

    if(!folder || !image){
      return
    }

    // Construct the full path to the image
    const filePath = path.join(__dirname, "../../", "uploads", folder, image);

    console.log("file path is : ", filePath);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log("File does not exist");
        //note: return disabled from reject for some reason
        // reject(new Error("File does not exist"));
      }

      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          //note: return disabled from reject for some reason
          // reject(new Error("Error deleting file"));
        }
        resolve();
      });
    });
  });
};

export default deleteImage;