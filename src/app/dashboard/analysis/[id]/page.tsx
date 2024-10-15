"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
// import { config } from '@/config';
import AnalysisView from '../../../../components/dashboard/overview/analysis-view'

// export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

interface PageProps {
  params: { id: string }; // Expecting 'id' as a route parameter
}

export default function Page({ params }: PageProps): React.JSX.Element {

  const router = useRouter(); 

  const { id } = params; // Dynamic route parameter

  return (
    <Stack spacing={3}>
      <AnalysisView
            reqId={id}
          />
    </Stack>
  );
}
