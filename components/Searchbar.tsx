"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { isValidUrl } from "@/lib/helper/url";
import { FormEvent, useState } from "react";

const navIcons = [
  { src: "/assets/icons/search.svg", alt: "search" },
  { src: "/assets/icons/black-heart.svg", alt: "heart" },
  { src: "/assets/icons/user.svg", alt: "user" },
];


const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const isValidLink = isValidUrl(searchPrompt, 'www.amazon.com');
    if (!isValidLink){
      alert("Please enter a valid Amazon product link");
    }

    try{
      setIsLoading(true);
      // fetch product data
      const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      ></input>
      <button type="submit" className="searchbar-btn" disabled={searchPrompt === ''}>
        {isLoading ? "Searching..." : "Search"}
      </button>
      <button type="reset" className="searchbar-btn" disabled={searchPrompt === ''} onClick={() => setSearchPrompt('')}>Clear</button>
    </form>
  );
};

export default Searchbar;
