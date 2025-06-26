import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
const RoomMap = ({ roomAddress, title }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [roomLocation, setRoomLocation] = useState(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOXGL;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [105.8048, 21.0285],
      zoom: 15,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        roomAddress
      )}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.features?.length > 0) {
          const [lng, lat] = data.features[0].center;
          setRoomLocation([lng, lat]);
          map.current.setCenter([lng, lat]);
          new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup({ maxWidth: "200px" }).setHTML(
                `<h3 style='font-size: 14px; margin: 0;'>${title}</h3>`
              )
            )
            .addTo(map.current);
        } else {
          toast.error(`Không tìm thấy vị trí cho ${roomAddress}`);
        }
      })
      .catch((error) => {
        toast.error("Lỗi khi tải bản đồ");
        console.error("Mapbox Geocoding error:", error);
      });

    return () => map.current?.remove();
  }, [roomAddress, title]);

  return (
    <div>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "300px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      />
      <p className="text-gray-600 mt-2">
        {roomLocation
          ? `Tọa độ: ${roomLocation[1].toFixed(6)}, ${roomLocation[0].toFixed(
              6
            )}`
          : "Đang tải bản đồ..."}
      </p>
    </div>
  );
};

export default RoomMap;
