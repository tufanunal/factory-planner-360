
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilterableSelect, SelectItem, Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Part } from '@/types/part';

interface DetailTabProps {
  part: Part;
  setPart: (part: Part) => void;
  categories: string[];
}

const DetailTab = ({ part, setPart, categories }: DetailTabProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPart(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPart(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={part.name}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="sku" className="text-right">
          SKU
        </Label>
        <Input
          type="text"
          id="sku"
          name="sku"
          value={part.sku}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <FilterableSelect 
          value={part.category} 
          onValueChange={(value) => handleSelectChange('category', value)}
          triggerClassName="col-span-3"
        >
          {categories.map(category => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </FilterableSelect>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="qualityRate" className="text-right">
          Quality Rate
        </Label>
        <Input
          type="number"
          id="qualityRate"
          name="qualityRate"
          value={part.qualityRate}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stock" className="text-right">
          Stock
        </Label>
        <Input
          type="number"
          id="stock"
          name="stock"
          value={part.stock}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <Select 
          value={part.status} 
          onValueChange={(value) => handleSelectChange('status', value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Low Stock">Low Stock</SelectItem>
            <SelectItem value="Discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right mt-2">
          Description
        </Label>
        <Input
          id="description"
          name="description"
          value={part.description || ""}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
    </div>
  );
};

export default DetailTab;
