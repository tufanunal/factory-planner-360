
import { useState } from 'react';
import SqlDatabaseService from '@/services/db/SqlDatabaseService';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const DbStructureViewer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dbData, setDbData] = useState<any>(null);

  const handleViewDb = async () => {
    try {
      await SqlDatabaseService.initialize();
      const data = await SqlDatabaseService.dumpDatabase();
      setDbData(data);
      setIsOpen(true);
    } catch (error) {
      console.error('Error loading database structure:', error);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={handleViewDb} className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        View Database
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Database Structure</DialogTitle>
            <DialogDescription>
              Current data stored in the application's local storage.
            </DialogDescription>
          </DialogHeader>

          {dbData && (
            <div className="space-y-6">
              {/* Machines Table */}
              <div>
                <h3 className="text-lg font-medium mb-2">Machines Table</h3>
                {dbData.machines && dbData.machines.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead>Hourly Cost</TableHead>
                        <TableHead>Labour</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dbData.machines.map((machine: any) => (
                        <TableRow key={machine.id}>
                          <TableCell className="font-mono text-xs">{machine.id}</TableCell>
                          <TableCell>{machine.name}</TableCell>
                          <TableCell>{machine.status}</TableCell>
                          <TableCell>{machine.category}</TableCell>
                          <TableCell>{machine.availability}%</TableCell>
                          <TableCell>{machine.hourlyCost}€/h</TableCell>
                          <TableCell>{machine.labourPersonHour} person/h</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No machines found.</p>
                )}
              </div>

              {/* Machine Categories */}
              <div>
                <h3 className="text-lg font-medium mb-2">Machine Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    try {
                      const categoriesJSON = localStorage.getItem('factory-planner-machine-categories');
                      if (categoriesJSON) {
                        const categories = JSON.parse(categoriesJSON);
                        return categories.map((category: string, index: number) => (
                          <div key={index} className="px-3 py-1 bg-muted rounded-md text-sm">
                            {category}
                          </div>
                        ));
                      }
                      return <p className="text-muted-foreground">No categories found.</p>;
                    } catch (error) {
                      return <p className="text-muted-foreground">Error loading categories.</p>;
                    }
                  })()}
                </div>
              </div>

              {/* Raw Database Structure */}
              <div>
                <h3 className="text-lg font-medium mb-2">Raw Database JSON</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs">
                    {JSON.stringify(dbData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DbStructureViewer;
