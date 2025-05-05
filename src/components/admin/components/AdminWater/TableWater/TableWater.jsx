import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createElectricWaterService,
  updateElectricWaterService,
  checkPreviousMonthHasReadingService,
  getElectricWaterHistoryByRoomService,
} from "@/services/electricWaterServices";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Save, History } from "lucide-react";
import { toast } from "react-toastify";
import ModalConfirmWater from "../ModalConfirmWater/ModalConfirmWater";
import ModalHistoryWater from "../ModalHistoryWater/ModalHistoryWater";

const TableWater = ({ waterData, month, year }) => {
  const queryClient = useQueryClient();

  // --- State Hooks ---
  const [inputValues, setInputValues] = useState([]);
  const [canEditChiSoCuList, setCanEditChiSoCuList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isUnusedRoomList, setIsUnusedRoomList] = useState([]); // Thêm state để theo dõi phòng lâu không dùng
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isCurrentMonth, setIsCurrentMonth] = useState(false);

  // Kiểm tra tháng hiện tại
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    setIsCurrentMonth(month === currentMonth && year === currentYear);
  }, [month, year]);

  // --- React Query Hooks ---
  const { data: historyData, refetch: fetchHistory } = useQuery({
    queryKey: ["water-history", selectedRoom?.MaPT, selectedRoom?.MaDV],
    queryFn: () =>
      getElectricWaterHistoryByRoomService(
        selectedRoom?.MaPT,
        selectedRoom?.MaDV
      ),
    enabled: !!selectedRoom?.MaPT && !!selectedRoom?.MaDV,
  });

  const createMutation = useMutation({
    mutationFn: createElectricWaterService,
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success(data.EM || "Tạo mới thành công");
        queryClient.invalidateQueries({
          queryKey: ["rooms-with-water", month, year],
        });
      } else {
        toast.error(data.EM || "Tạo mới thất bại");
      }
    },
    onError: (error) => {
      console.error("Error creating water record:", error);
      toast.error("Có lỗi xảy ra khi tạo mới");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateElectricWaterService(id, data),
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success(data.EM || "Cập nhật thành công");
        queryClient.invalidateQueries({
          queryKey: ["rooms-with-water", month, year],
        });
      } else {
        toast.error(data.EM || "Cập nhật thất bại");
      }
    },
    onError: (error) => {
      console.error("Error updating water record:", error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    },
  });

  // --- useEffect Hooks ---
  // Đồng bộ inputValues với prop waterData
  useEffect(() => {
    if (Array.isArray(waterData)) {
      setInputValues(
        waterData.map((item) => ({
          MaDN: item?.MaDN || null,
          MaPT: item?.PhongTro?.MaPT || null,
          MaDV: item?.MaDV || null,
          ChiSoCu: item?.ChiSoCu?.toString() || "",
          ChiSoMoi: item?.ChiSoMoi?.toString() || "",
          HasInvoice: item?.HasInvoice || false,
        }))
      );
      setCanEditChiSoCuList(waterData.map(() => true)); // Khởi tạo mặc định
      setIsUnusedRoomList(waterData.map(() => false)); // Khởi tạo mặc định
    } else {
      setInputValues([]);
      setCanEditChiSoCuList([]);
      setIsUnusedRoomList([]);
    }
  }, [waterData]);

  // Kiểm tra trạng thái phòng lâu không dùng và khả năng chỉnh sửa ChiSoCu
  useEffect(() => {
    if (
      !inputValues ||
      inputValues.length === 0 ||
      inputValues.length !== waterData?.length
    ) {
      setCanEditChiSoCuList([]);
      setIsUnusedRoomList([]);
      return;
    }

    const checkRooms = async () => {
      try {
        const unusedStatuses = await Promise.all(
          inputValues.map(async (item, index) => {
            const currentWaterItem = waterData[index];
            if (!currentWaterItem || !item) {
              return true; // Cho phép chỉnh sửa nếu dữ liệu không hợp lệ
            }

            if (item.MaPT && item.MaDV && month && year) {
              try {
                const hasPrevReading =
                  await checkPreviousMonthHasReadingService(
                    item.MaPT,
                    item.MaDV,
                    month,
                    year
                  );
                return !hasPrevReading; // Phòng lâu không dùng nếu không có bản ghi tháng trước
              } catch (checkError) {
                console.error(
                  `Error checking prev month for room ${item.MaPT}:`,
                  checkError
                );
                return true; // Cho phép chỉnh sửa nếu có lỗi
              }
            }
            return true; // Cho phép chỉnh sửa nếu thiếu thông tin
          })
        );

        // Cập nhật danh sách phòng lâu không dùng
        setIsUnusedRoomList(unusedStatuses);

        // Cập nhật khả năng chỉnh sửa ChiSoCu
        const canEditStatuses = unusedStatuses.map((isUnused, index) => {
          const item = inputValues[index];
          if (item.HasInvoice) {
            return false; // Khóa nếu có hóa đơn
          }
          return isUnused; // Cho phép chỉnh sửa ChiSoCu nếu phòng lâu không dùng
        });

        setCanEditChiSoCuList(canEditStatuses);
      } catch (error) {
        console.error("Error checking rooms:", error);
        setIsUnusedRoomList(inputValues.map(() => true));
        setCanEditChiSoCuList(inputValues.map(() => true));
      }
    };

    checkRooms();
  }, [inputValues, month, year, waterData]);

  // Refetch lịch sử khi phòng được chọn thay đổi
  useEffect(() => {
    if (selectedRoom?.MaPT && selectedRoom?.MaDV) {
      fetchHistory();
    }
  }, [selectedRoom, fetchHistory]);

  // --- Event Handlers ---
  const handleInputChange = (index, field, value) => {
    const numValue = value.replace(/[^0-9]/g, "");
    setInputValues((prev) => {
      const updatedValues = [...prev];
      if (updatedValues[index]) {
        updatedValues[index] = {
          ...updatedValues[index],
          [field]: numValue === "" ? "" : parseInt(numValue, 10),
        };
      }
      return updatedValues;
    });
  };

  const handleSave = (index) => {
    if (index < 0 || index >= inputValues.length || index >= waterData.length) {
      console.error("Invalid index for saving:", index);
      toast.error("Chỉ mục dữ liệu không hợp lệ, không thể lưu.");
      return;
    }

    const rowState = inputValues[index];
    const originalData = waterData[index];

    const maPT = rowState.MaPT || originalData?.PhongTro?.MaPT;
    const maDV = rowState.MaDV || originalData?.MaDV;

    if (!maPT || !maDV) {
      toast.error("Thiếu Mã Phòng Trọ hoặc Mã Dịch Vụ, không thể lưu.");
      return;
    }

    const chiSoCu = parseInt(rowState.ChiSoCu, 10) || 0;
    const chiSoMoi = parseInt(rowState.ChiSoMoi, 10) || 0;

    if (chiSoCu < 0 || chiSoMoi < 0) {
      toast.error("Chỉ số không được nhỏ hơn 0");
      return;
    }

    if (rowState.ChiSoMoi !== "" && chiSoMoi < chiSoCu) {
      toast.error("Chỉ số mới không được nhỏ hơn chỉ số cũ");
      return;
    }

    const dataToSend = {
      MaPT: maPT,
      MaDV: maDV,
      ChiSoCu: chiSoCu,
      ChiSoMoi: chiSoMoi,
      Thang: month,
      Nam: year,
    };

    setPendingSave({
      roomName: originalData?.PhongTro?.TenPhong || `Phòng ${maPT}`,
      houseName: originalData?.PhongTro?.TenNha || "N/A",
      data: dataToSend,
      isNew: !rowState.MaDN,
      maDNToUpdate: rowState.MaDN,
    });
    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = () => {
    if (pendingSave) {
      if (pendingSave.isNew) {
        createMutation.mutate(pendingSave.data);
      } else {
        if (pendingSave.maDNToUpdate) {
          updateMutation.mutate({
            id: pendingSave.maDNToUpdate,
            data: pendingSave.data,
          });
        } else {
          console.error("Missing MaDN for update operation", pendingSave);
          toast.error("Không tìm thấy mã để cập nhật.");
        }
      }
      setConfirmDialogOpen(false);
      setPendingSave(null);
    }
  };

  const handleViewHistory = (index) => {
    if (index < 0 || index >= waterData.length) {
      console.error("Invalid index for viewing history:", index);
      return;
    }
    const originalData = waterData[index];
    if (originalData && originalData.PhongTro && originalData.MaDV) {
      const roomData = {
        MaPT: originalData.PhongTro.MaPT,
        MaDV: originalData.MaDV,
        TenPhong: originalData.PhongTro.TenPhong,
        TenNha: originalData.PhongTro.TenNha,
      };
      setSelectedRoom(roomData);
      setHistoryDialogOpen(true);
    } else {
      console.warn(
        "Missing data to view history at index:",
        index,
        originalData
      );
      toast.warn("Thiếu thông tin để xem lịch sử.");
    }
  };

  // --- Render Logic ---
  if (
    !Array.isArray(inputValues) ||
    !Array.isArray(waterData) ||
    inputValues.length !== waterData.length
  ) {
    if (waterData?.length === 0) {
      return null;
    }
    return <p className="text-center p-4">Đang cập nhật bảng...</p>;
  }

  return (
    <div className="w-full overflow-x-auto rounded">
      <Table className="min-w-full rounded table-fixed">
        <TableHeader className="/backdrop-filter backdrop-blur-sm bg-white/30">
          <TableRow>
            <TableHead className="w-[10%] text-center">Phòng</TableHead>
            <TableHead className="w-[15%] text-center">Nhà</TableHead>
            <TableHead className="w-[20%] text-center">Chỉ số cũ</TableHead>
            <TableHead className="w-[25%] text-center">Chỉ số mới</TableHead>
            <TableHead className="w-[15%] text-center">Tiêu thụ</TableHead>
            <TableHead className="w-[15%] text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inputValues.map((itemState, index) => {
            const originalItem = waterData[index];

            if (!originalItem || !itemState || !originalItem.PhongTro) {
              console.warn(
                `Skipping render for inconsistent data at index ${index}`
              );
              return null;
            }

            const isDisabled = itemState.HasInvoice || !isCurrentMonth;
            const canEditChiSoCu = isDisabled
              ? false
              : canEditChiSoCuList[index];

            const chiSoCuNum = parseInt(itemState.ChiSoCu, 10) || 0;
            const chiSoMoiNum = parseInt(itemState.ChiSoMoi, 10) || 0;
            const consumption =
              chiSoMoiNum > chiSoCuNum ? chiSoMoiNum - chiSoCuNum : 0;

            return (
              <TableRow
                key={`${
                  itemState.MaPT || originalItem.PhongTro.MaPT
                }-${month}-${year}-${index}`}
                className={index % 2 === 0 ? "bg-blue-50" : ""}
              >
                <TableCell className="text-center truncate">
                  {originalItem.PhongTro.TenPhong}
                </TableCell>
                <TableCell className="text-center truncate">
                  {originalItem.PhongTro.TenNha}
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={itemState.ChiSoCu}
                    onChange={(e) =>
                      handleInputChange(index, "ChiSoCu", e.target.value)
                    }
                    disabled={!canEditChiSoCu}
                    className={`w-full max-w-[150px] mx-auto text-right rounded ${
                      !canEditChiSoCu
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={itemState.ChiSoMoi}
                    onChange={(e) =>
                      handleInputChange(index, "ChiSoMoi", e.target.value)
                    }
                    disabled={isDisabled}
                    className={`w-full max-w-[200px] mx-auto text-right rounded ${
                      isDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                    }`}
                  />
                </TableCell>
                <TableCell className="text-center">{consumption}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={() => handleSave(index)}
                      className="bg-green-600 hover:bg-green-700 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isDisabled}
                    >
                      <Save className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleViewHistory(index)}
                      className="bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                    >
                      <History className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
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
