export function optimizedImageUrl(src, width = 800) {
  if (
    typeof src !== "string" ||
    !src.includes("res.cloudinary.com/") ||
    !src.includes("/image/upload/")
  ) {
    return src;
  }

  const uploadPath = "/image/upload/";
  const uploadIndex = src.indexOf(uploadPath);
  const pathAfterUpload = src.slice(
    uploadIndex + uploadPath.length
  );

  if (pathAfterUpload.startsWith("f_auto,")) {
    return src;
  }

  const targetWidth = Math.max(1, Math.round(width));

  return src.replace(
    uploadPath,
    `${uploadPath}f_auto,q_auto,c_limit,w_${targetWidth}/`
  );
}