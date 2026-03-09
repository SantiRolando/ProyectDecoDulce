import { useState, useEffect } from "react";
import logoIMG1 from "../assets/BannerFoto1.png";
import logoIMG2 from "../assets/BannerFoto2.png";
import logoIMG3 from "../assets/BannerFoto3.png";


  const images = [
    logoIMG1,
    logoIMG2,
    logoIMG3
  ];

export default function Banner() {

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  // autoplay
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner">

      <div
        className="banner-slider"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <img key={index} src={img} className="banner-img" />
        ))}
      </div>

      {/* botones */}
      <button className="banner-btn left" onClick={prevSlide}>‹</button>
      <button className="banner-btn right" onClick={nextSlide}>›</button>

      {/* indicadores */}
      <div className="banner-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={index === current ? "dot active" : "dot"}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>

    </div>
  );
}