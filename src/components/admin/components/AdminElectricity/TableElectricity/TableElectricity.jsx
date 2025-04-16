// File: components/TableElectricity/TableElectricity.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getElectricWaterHistoryByRoomService,
  updateElectricWaterService,
} from "@/services/electricWaterServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { History, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalConfirmElectricity from "../ModalConfirmElectricity/ModalConfirmElectricity";
import ModalHistoryElectricity from "../ModalHistoryElectricity/ModalHistoryElectricity";

const TableElectricity = (props) => {
  const { electricData = [], month, year } = props;
  const queryClient = useQueryClient();

  const [editedValues, setEditedValues] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    setEditedValues({});
  }, [month, year]);

  const { data: historyData, refetch: fetchHistory } = useQuery({
    queryKey: ["electric-history", selectedRoom?.MaPT, selectedRoom?.MaDV],
    queryFn: () =>
      getElectricWaterHistoryByRoomService(
        selectedRoom.MaPT,
        selectedRoom.MaDV
      ),
    enabled: !!selectedRoom?.MaPT && !!selectedRoom?.MaDV,
  });

  useEffect(() => {
    if (selectedRoom) {
      fetchHistory();
    }
  }, [selectedRoom, fetchHistory]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateElectricWaterService(id, data),
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success(data.EM || "Cập nhật thành công");
        queryClient.invalidateQueries(["rooms-with-electric", month, year]);
        setEditedValues({});
      } else {
        toast.error(data.EM || "Cập nhật thất bại");
      }
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi cập nhật");
      console.error(error);
    },
  });

  const handleInputChange = (id, field, value) => {
    const numValue = value.replace(/[^0-9]/g, "") === "" ? "" : parseInt(value);

    setEditedValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: numValue,
      },
    }));
  };

  const hasInvoice = (item) => {
    return item.HasInvoice === true;
  };

  const handleSave = (item) => {
    const id = item.MaDN;
    const editedItem = editedValues[id] || {};

    const chiSoCu =
      editedItem.ChiSoCu !== undefined ? editedItem.ChiSoCu : item.ChiSoCu;
    const chiSoMoi =
      editedItem.ChiSoMoi !== undefined ? editedItem.ChiSoMoi : item.ChiSoMoi;

    if (chiSoMoi < chiSoCu) {
      toast.error("Chỉ số mới không thể nhỏ hơn chỉ số cũ");
      return;
    }

    const dataToSave = {
      ChiSoMoi: chiSoMoi,
      Thang: month,
      Nam: year,
      MaPT: item.PhongTro?.MaPT,
      MaDV: item?.MaDV,
    };

    setPendingSave({
      id: id,
      data: dataToSave,
      roomName: item.PhongTro?.TenPhong,
      houseName: item.PhongTro?.TenNha,
    });
    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = () => {
    if (pendingSave) {
      updateMutation.mutate({
        id: pendingSave.id,
        data: pendingSave.data,
      });
      setConfirmDialogOpen(false);
      setPendingSave(null);
    }
  };

  const handleViewHistory = (item) => {
    const roomData = {
      MaPT: item.PhongTro?.MaPT,
      MaDV: item?.MaDV,
      TenPhong: item.PhongTro?.TenPhong,
      TenNha: item.PhongTro?.TenNha,
    };
    setSelectedRoom(roomData);
    setHistoryDialogOpen(true);
  };

  return (
    <div className="w-full overflow-x-auto rounded">
      <Table className="min-w-full border rounded table-fixed">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[5%] text-center">STT</TableHead>
            <TableHead className="w-[10%] text-center">Phòng</TableHead>
            <TableHead className="w-[10%] text-center">Nhà</TableHead>
            <TableHead className="w-[20%] text-center">Chỉ số cũ</TableHead>
            <TableHead className="w-[20%] text-center">Chỉ số mới</TableHead>
            <TableHead className="w-[10%] text-center">Tiêu thụ</TableHead>
            <TableHead className="w-[25%] text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {electricData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            electricData.map((item, index) => {
              const id = item.MaDN;
              const editedItem = editedValues[id] || {};

              const chiSoCu =
                editedItem.ChiSoCu !== undefined
                  ? editedItem.ChiSoCu
                  : item.ChiSoCu;
              const chiSoMoi =
                editedItem.ChiSoMoi !== undefined
                  ? editedItem.ChiSoMoi
                  : item.ChiSoMoi;

              const consumption = chiSoMoi - chiSoCu;

              const invoiced = hasInvoice(item);

              return (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-blue-50" : ""}
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell
                    className="text-center truncate"
                    title={item.PhongTro?.TenPhong}
                  >
                    {item.PhongTro?.TenPhong}
                  </TableCell>
                  <TableCell
                    className="text-center truncate"
                    title={item.PhongTro?.TenNha}
                  >
                    {item.PhongTro?.TenNha}
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="text"
                      value={chiSoCu}
                      onChange={(e) =>
                        handleInputChange(id, "ChiSoCu", e.target.value)
                      }
                      className="text-right rounded shadow-none bg-gray-100 w-full max-w-[150px] mx-auto"
                      disabled={true}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="text"
                      value={chiSoMoi || 0}
                      onChange={(e) =>
                        handleInputChange(id, "ChiSoMoi", e.target.value)
                      }
                      className={`text-right rounded w-full max-w-[200px] mx-auto ${
                        invoiced ? "bg-gray-100" : ""
                      }`}
                      disabled={invoiced}
                    />
                  </TableCell>
                  <TableCell className="text-center">{consumption}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        onClick={() => handleSave(item)}
                        className="bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                        size="sm"
                      >
                        <Save className="mr-1" />
                        Lưu
                      </Button>
                      <Button
                        onClick={() => handleViewHistory(item)}
                        className="bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                        size="sm"
                      >
                        <History className="mr-1" />
                        Lịch sử
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div>
        <ModalConfirmElectricity
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          pendingSave={pendingSave}
          onConfirm={handleConfirmSave}
        />
        <ModalHistoryElectricity
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          historyData={historyData?.DT}
          roomName={selectedRoom?.TenPhong}
          houseName={selectedRoom?.TenNha}
          MaPT={selectedRoom?.MaPT}
          MaDV={selectedRoom?.MaDV}
        />
      </div>
    </div>
  );
};

export default TableElectricity;
