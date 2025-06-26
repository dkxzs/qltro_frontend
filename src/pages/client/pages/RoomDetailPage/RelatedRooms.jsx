import { Loader2 } from "lucide-react";
import RoomCard from "./RoomCard";

const RelatedRooms = ({ relatedRooms, relatedLoading, currentRoomId }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold mb-4">Các phòng trọ khác</h2>
    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 min-w-max">
      {relatedLoading ? (
        <div className="flex justify-center items-center w-full">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : relatedRooms.length > 0 ? (
        relatedRooms
          .filter((room) => room.roomId !== currentRoomId)
          .map((relatedRoom) => (
            <RoomCard
              key={relatedRoom.roomId}
              roomId={relatedRoom.roomId}
              image={relatedRoom.image}
              title={relatedRoom.title}
              area={relatedRoom.area}
              roomTypeDesc={relatedRoom.roomTypeDesc}
              maxOccupancy={relatedRoom.maxOccupancy}
              price={relatedRoom.price}
              location={relatedRoom.location}
            />
          ))
      ) : (
        <p className="text-gray-600 italic">Không có phòng trọ nào khác.</p>
      )}
    </div>
  </div>
);

export default RelatedRooms;
