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

const TableElectricity = (props) => {
  const { meterData } = props;
  return (
    <div>
      {" "}
      <Table className="rounded">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-semibold">STT</TableHead>
            <TableHead className="font-semibold">Nhà</TableHead>
            <TableHead className="font-semibold ">Phòng</TableHead>
            <TableHead className="font-semibold text-right">
              CS Điện Cũ
            </TableHead>
            <TableHead className="font-semibold text-right">
              CS Điện Mới
            </TableHead>
            <TableHead className="font-semibold text-right">Sử dụng</TableHead>
            <TableHead className="font-semibold text-right">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meterData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.floor}</TableCell>
              <TableCell>{row.room}</TableCell>
              <TableCell className="text-right">
                <Input
                  type="text"
                  value={row.oldReading}
                  className="w-full text-right"
                />
              </TableCell>
              <TableCell className="text-right">
                <Input
                  type="text"
                  value={row.newReading}
                  className="w-full text-right"
                />
              </TableCell>
              <TableCell className="text-right">{row.usage}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded float-right"
                >
                  Lưu
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableElectricity;
