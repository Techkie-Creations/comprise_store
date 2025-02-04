import axios from "axios";
import { ImageURL } from "./Types";

const blobToFile = (blob: Blob, fileName: string) => {
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

export const fileObject = async (
  { fileUrl, fileName }: ImageURL = {
    fileUrl:
      "http://localhost:5000/avatar/man-with-beard-glasses-is-wearing-jacket-that-says-hes-wearing-jacket_113255-93084.png",
    fileName: "default.jpg",
    fileType: "image/jpeg",
  },
  clear: boolean = false
): Promise<FileList> => {
  const dataTransfer = new DataTransfer();
  if (clear) {
    dataTransfer.clearData();
  }

  // const blob = new Blob([fileUrl], { type: fileType });
  // const imageFileObject = new File([blob], fileName, { type: fileType });
  const results: Blob = await axios
    .get(fileUrl, { responseType: "blob" })
    .then((res) => res.data)
    .catch(() => false);
  // console.log(results);
  const imageFileObject: File = blobToFile(results, fileName);
  console.log(imageFileObject, "FILE");

  dataTransfer.items.add(imageFileObject);
  console.log("data", dataTransfer.files);
  return dataTransfer.files;
};

// EXTRA
export const formatName = (val: string) => {
  if (val.indexOf(" ") >= 0) {
    return val
      .split(" ")
      .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(" ");
  }
  if (val.indexOf("_") >= 0) {
    return val
      .split("_")
      .map((name: string) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(" ");
  }
  return val[0].toUpperCase() + val.slice(1);
};
