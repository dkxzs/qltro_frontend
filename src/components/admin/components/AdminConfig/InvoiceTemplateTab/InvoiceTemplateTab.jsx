import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const InvoiceTemplateTab = () => {
  const [invoiceTemplate, setInvoiceTemplate] = useState({
    header: "",
    footer: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceTemplate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveTemplate = () => {
    // Xử lý lưu mẫu hóa đơn
    console.log("Lưu mẫu hóa đơn:", invoiceTemplate);
  };

  return (
    <div className="mt-6 space-y-6">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-medium">
                Cấu hình mẫu hóa đơn
              </Label>
              <div className="text-sm text-gray-500">
                Sử dụng các biến như {'{TenKhachHang}'}, {'{TienPhong}'}, {'{TienDien}'} để tự động điền thông tin
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="header">Tiêu đề hóa đơn</Label>
              <Input
                id="header"
                name="header"
                placeholder="Nhập tiêu đề hóa đơn"
                value={invoiceTemplate.header}
                onChange={handleChange}
                className="rounded shadow-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoiceContent">Nội dung mẫu hóa đơn</Label>
              <Textarea
                id="invoiceContent"
                name="content"
                placeholder="Nhập nội dung mẫu hóa đơn..."
                value={invoiceTemplate.content}
                onChange={handleChange}
                className="rounded shadow-none min-h-[300px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="footer">Chân trang hóa đơn</Label>
              <Textarea
                id="footer"
                name="footer"
                placeholder="Nhập chân trang hóa đơn"
                value={invoiceTemplate.footer}
                onChange={handleChange}
                className="rounded shadow-none min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="rounded cursor-pointer">
                Xem trước
              </Button>
              <Button 
                className="rounded cursor-pointer"
                onClick={handleSaveTemplate}
              >
                Lưu mẫu hóa đơn
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceTemplateTab;