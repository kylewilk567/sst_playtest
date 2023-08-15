"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormProps {
  url: string;
}

const Form = ({ url } : { url: string}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>();

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };
  

  const handleFileSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(url, {
        body: formData,
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
          "Content-Disposition": `attachment; filename="${selectedFile.name}"`,
        },
      });

      // if (response.ok) {
      //   const image = await response.json(); // Empty response returned from server.
      //   window.location.href = image.url.split("?")[0];
      // } else {
      //   // Handle error if the upload fails
      //   console.log("error")
      // }
    }
  };

  // TODO: Fix issue where div lies over the inputs, making them unclickable.
  // I did this using "relative" and "z-50" below, but this is very temporary
  // https://stackoverflow.com/questions/22184181/some-input-tags-are-not-working
  return (
    <>
    <form onSubmit={handleFileSubmit}>
      <div>
        <label className="relative z-50" htmlFor="fileInput">
          File:{" "}
        </label>
        <input
          className="relative z-50"
          id="fileInput"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileUpload}
        />{" "}
      </div>
      <button className="relative z-50" type="submit">
        Submit
      </button>
    </form>
    </>
  );
};

export default Form;
