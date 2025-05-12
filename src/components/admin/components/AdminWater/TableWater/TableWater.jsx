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
import { Save, History, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import ModalConfirmWater from "../ModalConfirmWater/ModalConfirmWater";
import ModalHistoryWater from "../ModalHistoryWater/ModalHistoryWater";

const TableWater = ({ waterData, month, year }) => {
  const queryClient = useQueryClient();

  // --- State Hooks ---
  const [inputValues, setInputValues] = useState([]);
  const [canEditChiSoCuList, setCanEditChiSoCuList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isUnusedRoomList, setIsUnusedRoomList] = useState([]);
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
      setCanEditChiSoCuList(waterData.map(() => true));
      setIsUnusedRoomList(waterData.map(() => false));
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
              return true;
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
                return !hasPrevReading;
              } catch (checkError) {
                console.error(
                  `Error checking prev month for room ${item.MaPT}:`,
                  checkError
                );
                return true;
              }
            }
            return true;
          })
        );

        setIsUnusedRoomList(unusedStatuses);

        const canEditStatuses = unusedStatuses.map((isUnused, index) => {
          const item = inputValues[index];
          if (item.HasInvoice) {
            return false;
          }
          return isUnused;
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
          [field]: numValue,
        };
      }
      return updatedValues;
    });
  };

  const handleSave = (index) => {
    if (index < 0 || index >= inputValues.length || index >= waterData.length) {
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
          toast.error("Không tìm thấy mã để cập nhật.");
        }
      }
      setConfirmDialogOpen(false);
      setPendingSave(null);
    }
  };

  const handleViewHistory = (index) => {
    if (index < 0 || index >= waterData.length) {
      toast.warn("Chỉ mục dữ liệu không hợp lệ, không thể xem lịch sử.");
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
      toast.warn("Thiếu thông tin để xem lịch sử.");
    }
  };

  // --- Render Logic ---
  if (
    !Array.isArray(inputValues) ||
    !Array.isArray(waterData) ||
    inputValues.length !== waterData.length
  ) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (waterData?.length === 0) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="bg-white shadow-md rounded p-6 max-w-md w-full text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">
            Không có dữ liệu nước
          </h3>
          <p className="mt-1 text-gray-500">
            Không có thông tin nước cho tháng {month}/{year}. Vui lòng kiểm tra
            lại hoặc thêm dữ liệu mới.
          </p>
          <div className="mt-4">
            <Button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["rooms-with-water", month, year],
                })
              }
              className="bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer"
              aria-label="Tải lại dữ liệu"
            >
              Tải lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded shadow-md bg-white">
      <Table className="min-w-full table-fixed border border-gray-200">
        <TableHeader className="bg-gray-100">
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
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
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
                    className={`w-full max-w-[150px] mx-auto text-right rounded shadow-none ${
                      !canEditChiSoCu
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                    aria-label="Chỉ số cũ"
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
                    className={`w-full max-w-[150px] mx-auto text-right rounded shadow-none ${
                      isDisabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                    }`}
                    aria-label="Chỉ số mới"
                  />
                </TableCell>
                <TableCell className="text-center">{consumption}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <Button
                      onClick={() => handleSave(index)}
                      className="bg-transparent border-none rounded-none shadow-none outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        isDisabled ||
                        createMutation.isPending ||
                        updateMutation.isPending
                      }
                      aria-label="Lưu chỉ số nước"
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Save className="size-4 text-green-700" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleViewHistory(index)}
                      className="bg-transparent border-none rounded-none shadow-none outline-none cursor-pointer"
                      aria-label="Xem lịch sử nước"
                    >
                      <History className="size-4 text-blue-700" />
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
