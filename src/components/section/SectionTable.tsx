import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

// Define types for the props
interface SectionTableProps {
  headers: string[]; // Array of strings for the headers
  rows: Array<{
    id: string | number; // Unique identifier for each row
    data: Array<{
      id: string | number; // Unique identifier for each cell
      text: string; // Text content of the cell
    }>;
  }>;
}

// Table Component with types
const SectionTable: React.FC<SectionTableProps> = ({ headers, rows }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead style={{ backgroundColor: "#092b4d" }}>
          <TableRow>
            {headers?.map((header, index) => (
              <TableCell key={index} align="center" style={{ color: "white",  backgroundColor: "#092b4d"  }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <TableRow key={row.id}>
              {row.data.map((cell) => (
                <TableCell key={cell.id} align="center">
                  {cell.text}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SectionTable;
