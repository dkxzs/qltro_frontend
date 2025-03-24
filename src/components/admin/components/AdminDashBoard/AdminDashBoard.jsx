import { Building, FileText, Users, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminDashBoard = () => {
  return (
    <div className="w-full bg-orange-400 p-4">
      <div className=" mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">
            Chào mừng đến với nhatro24h.vn
          </h1>
          <Button
            variant="secondary"
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold"
          >
            Nâng cấp tài khoản liên hệ 0946 268 630
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6 flex justify-between items-start">
              <div>
                <p className="text-gray-700 font-medium mb-2">Số Phòng</p>
                <p className="text-4xl font-bold">10</p>
              </div>
              <div className="bg-purple-200 p-2 rounded-md">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardContent className="p-6 flex justify-between items-start">
              <div>
                <p className="text-gray-700 font-medium mb-2">Số bài đăng</p>
                <p className="text-4xl font-bold">0</p>
              </div>
              <div className="bg-purple-200 p-2 rounded-md">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardContent className="p-6 flex justify-between items-start">
              <div>
                <p className="text-gray-700 font-medium mb-2">Số người ở</p>
                <p className="text-4xl font-bold">0</p>
              </div>
              <div className="bg-purple-200 p-2 rounded-md">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardContent className="p-6 flex justify-between items-start">
              <div>
                <p className="text-gray-700 font-medium mb-2">Lợi nhuận</p>
                <p className="text-xl font-bold">Đang cập nhật...</p>
              </div>
              <div className="bg-purple-200 p-2 rounded-md">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
