import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';


const statusMap = {
  requested: { label: 'Requested', color: 'warning' },
  approving: { label: 'Approving', color: 'info' },
  scraping: { label: 'Scraping', color: 'primary' },
  scraped: { label: 'Scraped', color: 'info' },
  analysing: { label: 'Analysing', color: 'success' },
  analysed:{label: 'Analysed', color: 'primary'}
} as const;

export interface Order {
  id: string;
  customer: { name: string };
  business: string,
  amount: number;
  status: keyof typeof statusMap;
  createdAt: Date;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
  onAnalyse?: (order: Order) => void; // Add onAnalyse prop
}

export function LatestOrders({ orders = [], sx, onAnalyse }: LatestOrdersProps): React.JSX.Element {

  const router = useRouter();  // Initialize the router for navigation
  const [isMounted, setIsMounted] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  // Inside your component
  const searchParams = useSearchParams();
  const openModalQuery = searchParams.get('openModal');
  const orderId = searchParams.get('orderId');

  React.useEffect(() => {
    setIsMounted(true); // Ensures the component is mounted on the client
  }, []);

  React.useEffect(() => {

    console.log({ searchParams, openModalQuery, orderId, orders });
    

    if (openModalQuery && orderId && orders.length > 0) {
      // Find the corresponding order by ID
      const strOrderId = "REQ-" + orderId;
      const orderToOpen = orders.find((order) => order.id == strOrderId);
      console.log(orderToOpen,"orderToOpen")
      if (orderToOpen) {
        setSelectedOrder(orderToOpen);
        setOpenModal(true);
      }
    }
  }, [openModalQuery, orderId, orders]);

  const handleRowClick = (order: Order) => {
    if (order.status === 'requested' || order.status === 'scraped') {
      setSelectedOrder(order);
      setOpenModal(true);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  const handleApprove = async () => {
    // Implement your approve logic here
    if (selectedOrder) {
      try {
        // Extract the number from the order ID (e.g., "REQ-7" => 7)
        const orderIdNumber = selectedOrder.id.match(/\d+/)?.[0];

        if (!orderIdNumber) {
          throw new Error("Invalid order ID");
        }
        // Make the API call to update the order status
        await axios.post(`http://localhost:5000/api/admin/orders/${orderIdNumber}/status`, {
          status: 'scraping',
        });
        // Example logic for approving the order
        console.log(`Order ${selectedOrder.id} status updated to "scraping"!`);
        // Update the order status if needed
        setOpenModal(false);
        setSelectedOrder(null);
        setSnackbarMessage(`Order ${selectedOrder.id} status updated successfully!`);
        setOpenSnackbar(true);
      } catch (error) {
        console.error("Failed to update order status:", error);
        // Handle error (e.g., show a notification)
      }
    }
  };

  // Modified handleAnalyse to use the onAnalyse callback
  const handleAnalyse = async () => {
    if (isMounted && selectedOrder) {
      if (onAnalyse) {
        // onAnalyse(selectedOrder); // Notify parent component
        console.log('haaaaaaa')
        console.log({ router })
        const orderIdNumber = selectedOrder.id.match(/\d+/)?.[0];
        // router?.push(`/dashboard/analysis/${orderIdNumber}`)

        await axios.post(`http://localhost:5000/api/admin/startAnalysing/${orderIdNumber}`);

      }
      // Optionally, you can also close the modal
      setOpenModal(false);
      setSelectedOrder(null);
    }
  };


  return (
    <>
      <Card sx={sx}>
        <CardHeader title="Latest Requests" />
        <Divider />
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Customer</TableCell>
                <TableCell align="center">Business URL(Name)</TableCell>
                <TableCell align="center" sortDirection="desc">Date</TableCell>  {/* Align date to the right */}
                <TableCell align="center">Status</TableCell> {/* Status centered */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

                return (
                  <TableRow hover key={order.id} onClick={() => handleRowClick(order)} sx={{ cursor: order.status === 'requested' || order.status === 'scraped' ? 'pointer' : 'default' }}>
                    <TableCell align="left">{order.id}</TableCell>
                    <TableCell align="left">{order.customer.name}</TableCell>
                    <TableCell align="center">{order.business}</TableCell>
                    <TableCell align="center">{dayjs(order.createdAt).format('hh:mm MMM D, YYYY')}</TableCell>
                    <TableCell align="center">
                      <Chip color={color} label={label} size="small" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            color="inherit"
            endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
            size="small"
            variant="text"
          >
            View all
          </Button>
        </CardActions>

        {/* Modal */}
        {/* Enhanced Modal */}
        <Modal open={openModal} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            outline: 'none',
            border: '2px solid #1976d2', // Add a border to enhance the modal
          }}>
            <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Status:{selectedOrder?.status.charAt(0).toUpperCase()}{selectedOrder?.status.slice(1)}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography id="modal-description" sx={{ mt: 1 }}>
              {selectedOrder ? (
                <>
                  <Typography variant="body1"><strong>ID:</strong> {selectedOrder.id}</Typography>
                  <Typography variant="body1"><strong>Customer:</strong> {selectedOrder.customer.name}</Typography>
                  <Typography variant="body1"><strong>Business:</strong> {selectedOrder.business}</Typography>
                  <Typography variant="body1"><strong>Date:</strong> {dayjs(selectedOrder.createdAt).format('HH:mm MMM D, YYYY')}</Typography>
                </>
              ) : (
                <Typography variant="body1">Loading...</Typography>
              )}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              {selectedOrder?.status === 'requested' && (
                <Button variant="contained" color="success" onClick={handleApprove} size="small" sx={{ width: '48%' }}>
                  Approve
                </Button>)}
              {selectedOrder?.status === 'scraped' && (
                <Button variant="contained" color="success" onClick={handleAnalyse} size="small" sx={{ width: '48%' }}>
                  Analyse
                </Button>)}
                {selectedOrder?.status === 'analysing' && (
                <Button variant="contained" color="success" onClick={handleAnalyse} size="small" sx={{ width: '48%' }}>
                  Review
                </Button>)}
              <Button variant="contained" onClick={handleClose} color="primary" size="small" sx={{ width: '48%' }}>
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      </Card>
      {/* Snackbar for alert messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
