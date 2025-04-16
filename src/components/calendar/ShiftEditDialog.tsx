
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ShiftTime } from "@/types/calendar";
import { colorMap, defaultColor } from "./shiftColors";

interface ShiftEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingShift: ShiftTime | null;
  shiftName: string;
  startTime: string;
  endTime: string;
  shiftColor: string;
  onShiftNameChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onShiftColorChange: (value: string) => void;
  onSave: () => void;
}

const ShiftEditDialog = ({
  isOpen,
  onClose,
  editingShift,
  shiftName,
  startTime,
  endTime,
  shiftColor,
  onShiftNameChange,
  onStartTimeChange,
  onEndTimeChange,
  onShiftColorChange,
  onSave,
}: ShiftEditDialogProps) => {
  if (!editingShift) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Shift</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shiftName" className="text-right">
              Name
            </Label>
            <Input
              id="shiftName"
              value={shiftName}
              onChange={(e) => onShiftNameChange(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              End Time
            </Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <Select value={shiftColor} onValueChange={onShiftColorChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(colorMap).map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center">
                      <div 
                        className={`w-4 h-4 mr-2 rounded ${colorMap[color].bg}`} 
                      />
                      <span className="capitalize">{color}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-4 mt-2">
            <div className="flex flex-wrap gap-2">
              {Object.keys(colorMap).map((color) => (
                <Button 
                  key={color}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-8 h-8 p-0 rounded-md",
                    colorMap[color].bg,
                    shiftColor === color && "ring-2 ring-primary"
                  )}
                  onClick={() => onShiftColorChange(color)}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftEditDialog;
