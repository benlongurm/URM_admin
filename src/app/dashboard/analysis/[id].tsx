// pages/dashboard/analysis/[id].tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { Box, Typography, Divider, Button } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useEffect } from 'react';
import { Order } from '../../../types/order';

interface AnalysisProps {
    order?: Order;
    error?: string;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Analysis: React.FC<AnalysisProps> = ({ order, error }) => {
    const router = useRouter();

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => router.push('/dashboard')}>
                    Back to Request
                </Button>
            </Box>
        );
    }

    if (!order) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    return ( <Typography variant="h6">Load...</Typography>);

};

// Fetch order data server-side
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;
  
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.get<Order>(`${API_BASE_URL}/api/admin/orders/${id}`);
  
      return {
        props: {
          order: response.data,
        },
      };
    } catch (error: any) {
      console.error('Error fetching order:', error.message);
      return {
        props: {
          error: 'Failed to fetch order data.',
        },
      };
    }
  };

export default Analysis;