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
import ModalConfirmWater from "../ModalConfirmWater/ModalConfirmWater";
import ModalHistoryWater from "../ModalHistoryWater/ModalHistoryWater";

const TableWater = (props) => {
  const { waterData = [], month, year } = props;
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
    queryKey: ["water-history", selectedRoom?.MaPT, selectedRoom?.MaDV],
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
        queryClient.invalidateQueries(["rooms-with-water", month, year]);
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
      ChiSoCu: chiSoCu,
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
            <TableHead className="w-[5%] text-center py-3">STT</TableHead>
            <TableHead className="w-[10%] text-center py-3">Phòng</TableHead>
            <TableHead className="w-[10%] text-center py-3">Nhà</TableHead>
            <TableHead className="w-[20%] text-center py-3">
              Chỉ số cũ
            </TableHead>
            <TableHead className="w-[20%] text-center py-3">
              Chỉ số mới
            </TableHead>
            <TableHead className="w-[10%] text-center py-3">Tiêu thụ</TableHead>
            <TableHead className="w-[25%] text-center py-3">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {waterData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            waterData.map((item, index) => (
              <TableRow
                key={item.MaDN}
                className={index % 2 === 0 ? "bg-blue-50" : ""}
              >
                <TableCell className="text-center py-3">{index + 1}</TableCell>
                <TableCell
                  className="text-center py-3 truncate"
                  title={item.PhongTro?.TenPhong}
                >
                  {item.PhongTro?.TenPhong}
                </TableCell>
                <TableCell
                  className="text-center py-3 truncate"
                  title={item.PhongTro?.TenNha}
                >
                  {item.PhongTro?.TenNha}
                </TableCell>
                <TableCell className="text-center py-3">
                  <Input
                    type="text"
                    value={
                      editedValues[item.MaDN]?.ChiSoCu !== undefined
                        ? editedValues[item.MaDN]?.ChiSoCu
                        : item.ChiSoCu
                    }
                    onChange={(e) =>
                      handleInputChange(item.MaDN, "ChiSoCu", e.target.value)
                    }
                    className="text-right rounded w-full max-w-[150px] mx-auto bg-gray-100"
                    disabled
                  />
                </TableCell>
                <TableCell className="text-center py-3">
                  <Input
                    type="text"
                    value={
                      editedValues[item.MaDN]?.ChiSoMoi !== undefined
                        ? editedValues[item.MaDN]?.ChiSoMoi
                        : item.ChiSoMoi
                    }
                    onChange={(e) =>
                      handleInputChange(item.MaDN, "ChiSoMoi", e.target.value)
                    }
                    className={`text-right rounded w-full max-w-[200px] mx-auto ${
                      hasInvoice(item) ? "bg-gray-100" : ""
                    }`}
                    disabled={hasInvoice(item)}
                  />
                </TableCell>
                <TableCell className="text-center py-3">
                  {(editedValues[item.MaDN]?.ChiSoMoi !== undefined
                    ? editedValues[item.MaDN]?.ChiSoMoi
                    : item.ChiSoMoi) -
                    (editedValues[item.MaDN]?.ChiSoCu !== undefined
                      ? editedValues[item.MaDN]?.ChiSoCu
                      : item.ChiSoCu)}
                </TableCell>
                <TableCell className="text-center py-3">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      className="rounded bg-blue-500 hover:bg-blue-600 cursor-pointer"
                      onClick={() => handleSave(item)}
                      disabled={hasInvoice(item)}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Lưu
                    </Button>
                    <Button
                      size="sm"
                      className="rounded bg-blue-500 hover:bg-blue-600 cursor-pointer"
                      onClick={() => handleViewHistory(item)}
                    >
                      <History className="h-4 w-4 mr-1" />
                      Lịch sử
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ModalConfirmWater
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        pendingSave={pendingSave}
        onConfirm={handleConfirmSave}
      />

      <ModalHistoryWater
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        historyData={historyData?.DT}
        roomName={selectedRoom?.TenPhong}
        houseName={selectedRoom?.TenNha}
        MaPT={selectedRoom?.MaPT}
        MaDV={selectedRoom?.MaDV}
      />
    </div>
  );
};

export default TableWater;
