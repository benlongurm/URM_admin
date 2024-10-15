"use client";

import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { LatestOrders, Order } from '@/components/dashboard/overview/latest-orders';
import { CircularProgress, Box, Alert, Pagination } from '@mui/material';
import { useState } from 'react';
import AnalysisView from '@/components/dashboard/overview/analysis-view'; // Import the new Analysis component


interface Request {
  id: number;
  businessUrl: string;
  customer: string;
  createdAt: string; // ISO string
  status: string;
}

export default function Page(): React.JSX.Element {

  const [page, setPage] = useState<number>(1);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const limit = 10;

  const { data, error, isLoading } = useSWR<{ submissions: Request[]; total: number; page: number; limit: number; totalPages: number }>(
    `http://localhost:5000/api/admin/lastestRequest?page=${page}&limit=${limit}`,
    fetcher,
    {
      refreshInterval: 5000, // Poll every 5 seconds for real-time updates
    }
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleStartAnalysis = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }


  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">Failed to load submissions.</Alert>
      </Box>
    );
  }

  type OrderStatus = 'requested' | 'approving' | 'scraping' | 'scraped' | 'analysing' | 'analysed';

  function mapStatus(status: string): OrderStatus {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case 'requested':
      case 'approving':
      case 'scraping':
      case 'scraped':
      case 'analysing':
      case 'analysed':
        return lowerStatus;
      default:
        return 'requested'; // Fallback to a default status if the input is invalid
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid lg={12} md={12} xs={12}>
        <LatestOrders
          orders={
            data?.submissions.map(sub => ({
              id: `REQ-${sub.id}`,
              customer: { name: sub.customer },
              business: sub.businessUrl,
              amount: 0, // Adjust if 'amount' exists in your table
              status: mapStatus(sub.status), // Use the function to safely map status
              createdAt: new Date(sub.createdAt),
            })) || []}
          sx={{ height: '100%' }}
          onAnalyse={handleStartAnalysis}
        />
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={data?.totalPages || 1}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Grid>
    </Grid>
  );
}
