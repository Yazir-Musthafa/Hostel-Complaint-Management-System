import React from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search } from 'lucide-react';
import { FilterOptions } from '../../types';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  showCategory?: boolean;
  showStatus?: boolean;
  showPriority?: boolean;
  showBlock?: boolean;
  searchPlaceholder?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  showCategory = true,
  showStatus = true,
  showPriority = true,
  showBlock = false,
  searchPlaceholder = "Search..."
}) => {
  const filterItems = [
    {
      show: showCategory,
      value: filters.category,
      onChange: (value: string) => onFiltersChange({ category: value }),
      placeholder: "All Categories",
      items: [
        { value: "all", label: "All Categories" },
        { value: "Maintenance", label: "Maintenance" },
        { value: "Cleanliness", label: "Cleanliness" },
        { value: "Noise", label: "Noise" },
        { value: "Security", label: "Security" },
        { value: "Technical", label: "Technical" },
        { value: "Other", label: "Other" }
      ]
    },
    {
      show: showStatus,
      value: filters.status,
      onChange: (value: string) => onFiltersChange({ status: value }),
      placeholder: "All Status",
      items: [
        { value: "all", label: "All Status" },
        { value: "pending", label: "Pending" },
        { value: "in-progress", label: "In Progress" },
        { value: "resolved", label: "Resolved" }
      ]
    },
    {
      show: showPriority,
      value: filters.priority,
      onChange: (value: string) => onFiltersChange({ priority: value }),
      placeholder: "All Priority",
      items: [
        { value: "all", label: "All Priority" },
        { value: "high", label: "High Priority" },
        { value: "medium", label: "Medium Priority" },
        { value: "low", label: "Low Priority" }
      ]
    },
    {
      show: showBlock,
      value: filters.block,
      onChange: (value: string) => onFiltersChange({ block: value }),
      placeholder: "All Blocks",
      items: [
        { value: "all", label: "All Blocks" },
        { value: "Block A", label: "Block A" },
        { value: "Block B", label: "Block B" },
        { value: "Block C", label: "Block C" },
        { value: "Block D", label: "Block D" }
      ]
    }
  ].filter(item => item.show);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="pl-10 bg-muted/30 border-border/50 focus:bg-background transition-colors"
        />
      </div>

      {/* Filters Grid */}
      {filterItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filterItems.map((filterItem, index) => (
            <Select 
              key={index}
              value={filterItem.value} 
              onValueChange={filterItem.onChange}
            >
              <SelectTrigger className="bg-muted/30 border-border/50 focus:bg-background transition-colors">
                <SelectValue placeholder={filterItem.placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-border/50">
                {filterItem.items.map((item) => (
                  <SelectItem key={item.value} value={item.value} className="focus:bg-accent/50">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}
    </div>
  );
};