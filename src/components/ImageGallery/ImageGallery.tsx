import { useState } from "react";

export const ImageGallery = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div>
      <div className="w-auto h-96">
        <img
          src={
            selectedImage ??
            "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=384"
          }
          alt="Selected"
          className="w-full h-full object-contain rounded-lg bg-gray-200"
        />
      </div>
      <div className="flex justify-center space-x-2 mt-5">
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Thumbnail ${index}`}
            onClick={() => setSelectedImage(url)}
            className={`shadow-md rounded-md w-24 h-24 object-cover cursor-pointer ${
              selectedImage === url ? "ring-2 ring-blue-500" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
