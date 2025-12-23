import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Sweets");
  const [subCategory, setSubCategory] = useState("Sugar");
  const [bestseller, setBestseller] = useState(false);

  const uploadFileToCloudinary = async (file) => {
    try {
      console.log('Starting Cloudinary upload for file:', file.name);
      
      // Request signature from backend (protected)
      const sigResp = await axios.get(backendUrl + '/api/upload/cloudinary/signature', {
        headers: { Authorization: `Bearer ${token}`, token }
      });

      console.log('Signature response:', sigResp.data);

      if (!sigResp.data.success) throw new Error('Failed to get upload signature');

      const { signature, timestamp, api_key, cloud_name } = sigResp.data.data;
      
      if (!signature || !timestamp || !api_key || !cloud_name) {
        throw new Error(`Missing required Cloudinary parameters: signature=${!!signature}, timestamp=${!!timestamp}, api_key=${!!api_key}, cloud_name=${!!cloud_name}`);
      }

      console.log('Cloudinary params:', { timestamp, api_key, cloud_name, signature: signature.substring(0, 20) + '...' });

      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', api_key);
      fd.append('timestamp', timestamp);
      fd.append('signature', signature);

      // Upload to Cloudinary using fetch (more reliable with multipart)
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
      console.log('Uploading to:', uploadUrl);
      
      const uploadResp = await fetch(uploadUrl, {
        method: 'POST',
        body: fd
      });
      
      console.log('Cloudinary upload response status:', uploadResp.status);
      
      const uploadData = await uploadResp.json();
      console.log('Cloudinary upload response data:', uploadData);

      if (!uploadResp.ok) {
        throw new Error(`Cloudinary upload failed: ${uploadData.error?.message || uploadResp.statusText}`);
      }

      if (!uploadData.secure_url) {
        console.error('No secure URL in response:', uploadData);
        throw new Error('No secure URL returned from Cloudinary. Response: ' + JSON.stringify(uploadData));
      }
      
      const secureUrl = uploadData.secure_url;
      console.log('Successfully uploaded:', secureUrl);
      return secureUrl;
    } catch (error) {
      console.error('Cloudinary upload error full:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Validate form fields
      if (!name.trim()) {
        toast.error('Product name is required');
        return;
      }
      if (!description.trim()) {
        toast.error('Product description is required');
        return;
      }
      if (!price) {
        toast.error('Product price is required');
        return;
      }

      // Get images to upload
      const imagesToUpload = [image1, image2, image3, image4].filter(Boolean);
      
      if (imagesToUpload.length === 0) {
        toast.error('At least one product image is required');
        return;
      }

      // Try direct Cloudinary upload first
      let uploadedUrls = [];
      let useDirectUpload = true;

      try {
        toast.info('Uploading images to Cloudinary...');
        
        for (const file of imagesToUpload) {
          try {
            const url = await uploadFileToCloudinary(file);
            uploadedUrls.push(url);
            console.log('Added URL to uploadedUrls:', url, 'Total:', uploadedUrls.length);
          } catch (uploadError) {
            console.error('Direct upload failed for this file:', uploadError.message);
            useDirectUpload = false;
            break;
          }
        }
      } catch (error) {
        console.error('Direct upload failed:', error.message);
        useDirectUpload = false;
      }

      // If direct upload failed, fall back to server-side upload via multipart
      if (!useDirectUpload || uploadedUrls.length === 0) {
        console.log('Falling back to server-side upload...');
        toast.info('Uploading images via server...');
        uploadedUrls = [];

        // Send multipart form data instead
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("subCategory", subCategory);
        formData.append("bestseller", bestseller);

        image1 && formData.append("image1", image1);
        image2 && formData.append("image2", image2);
        image3 && formData.append("image3", image3);
        image4 && formData.append("image4", image4);

        console.log('Sending multipart form data to backend');

        const response = await axios.post(
          backendUrl + '/api/product/add',
          formData,
          { headers: { Authorization: `Bearer ${token}`, token } }
        );

        console.log('Backend response:', response.data);

        if (response.data.success) {
          toast.success(response.data.message);
          setName('');
          setDescription('');
          setImage1(false);
          setImage2(false);
          setImage3(false);
          setImage4(false);
          setPrice('');
        } else {
          toast.error(response.data.message);
        }
        return;
      }

      // If direct upload succeeded, send JSON to backend
      const payload = {
        name,
        description,
        price,
        category,
        subCategory,
        bestseller,
        images: uploadedUrls
      };

      console.log('Sending payload to backend:', payload);

      const response = await axios.post(
        backendUrl + '/api/product/add',
        payload,
        { headers: { Authorization: `Bearer ${token}`, token, 'Content-Type': 'application/json' } }
      );

      console.log('Backend response:', response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error in form submission:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Upload Image</p>

        <div className="flex gap-2">
          <label htmlFor="image1">
            <img
              className="w-20"
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label htmlFor="image2">
            <img
              className="w-20"
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label htmlFor="image3">
            <img
              className="w-20"
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label htmlFor="image4">
            <img
              className="w-20"
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Sweets">Sweets</option>
            <option value="Namkeens">Namkeens</option>
            <option value="CookiesAndBiscuits">Cookies And Biscuits</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Sugar">Sugar</option>
            <option value="SugarFree">SugarFree</option>
            <option value="NoSugar">NoSugar</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="Number"
            placeholder="25"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
