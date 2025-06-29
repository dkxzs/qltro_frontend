import { useNavigate } from "react-router-dom";

const RoomCard = ({
  roomId,
  image,
  title,
  area,
  roomTypeDesc,
  maxOccupancy,
  price,
  location,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div
      className="bg-white rounded shadow-md overflow-hidden hover:shadow-lg transition-shadow h-[420px] cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 py-1 text-truncate text-ellipsis line-clamp-2">
          {title}
        </h3>
        <div className="mb-2 text-truncate text-ellipsis line-clamp-2">
          {roomTypeDesc}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {area && maxOccupancy
            ? `${area}m² | ${maxOccupancy} người tối đa`
            : "Thông tin không có sẵn"}
        </div>
        <div className="text-lg font-bold text-blue-500 mb-2">{price}</div>
        <div className="text-sm text-gray-500 text-truncate text-ellipsis line-clamp-2">
          {location}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
