import { useState } from "react";
import type { MovieType } from "../../types/movie.types";
import { Rating } from "./Rating";
import { Link } from "react-router";

export const Card = (props: MovieType) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleMouseEnter = () => setIsOverlayVisible(true);
  const handleMouseLeave = () => setIsOverlayVisible(false);

  const poster = props.files.find(file => file.type === "poster");

  return (
    <Link to={`/movie/${props.id}`}
      className="relative w-[155px] min-h-[255px] sm:w-[235px] sm:min-h-[355px] cursor-pointer rounded-[4px] overflow-hidden transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        className="w-full h-full object-cover"
        src={poster?.url}
        alt={poster?.alt_text || props.title}
      />

      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOverlayVisible ? "opacity-80" : "opacity-0"
        }`}
      ></div>

      <div
        className={`absolute sm:top-1/4 top-1/6 w-full flex justify-center transition-opacity duration-300 ${
          isOverlayVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Rating percentage={props.rating * 10} />
      </div>

      <div className="absolute bottom-0 p-4 w-full flex flex-col gap-2 text-[#EEEEEE] z-20">
        <h1 className="text-[13px] sm:text-[16px] font-semibold uppercase drop-shadow-2xl">
          {props.title}
        </h1>
        <p
          className={`drop-shadow-2xl text-[12.8px] transition-opacity duration-300 ${
            isOverlayVisible ? "opacity-100" : "hidden opacity-0"
          }`}
        >
          {props.genres.split(", ").join(" / ")}
        </p>
      </div>
    </Link>
  );
};
