import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

// navigation components
import { UserNav } from '@/components/dashboard/user-nav'
import { MainNav } from '@/components/dashboard/main-nav'
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker'
import Home from '@/components/Home'
// basic components
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// high level components
import { Search } from '@/components/dashboard/search'
import { TeamSwitcher } from '@/components/dashboard/team-switcher'
import { RecentSales } from '@/components/dashboard/recent-sales'
import { Transactions } from '@/components/dashboard/transactions'
import { Stats } from '@/components/dashboard/stats'
import { Overview } from '@/components/dashboard/overview'

// Skeleton loaders
import { StatsLoader } from '@/components/dashboard/stats-loader'
import { SwapLayoutLoader } from '@/components/dashboard/swap-layout-loader'
import { OverviewLoader } from '@/components/dashboard/overview-loader'
import { RecentSalesLoader } from '@/components/dashboard/recent-sales-loader'
import { TransactionsLoader } from '@/components/dashboard/transactions-loader'

// swap layout is a client side component, since it uses local storage for this demo.
// In production you might want to save the layout order on server via api call
const SwapLayout = dynamic(() => import('@/components/dashboard/swap-layout'), {
  ssr: false,
  loading: () => <SwapLayoutLoader />,
})

// This is the main page of the app.
export default function AccueilApprenti() {
  return (
    <Home>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SwapLayout
          defaultEditing={false}
          sections={initialSwapSections}
          sectionSlotClassNames={sectionSlotClassNames}
          className='w-full grid grid-cols-2 grid-rows-5 gap-8'
        />
      </div>
    </Home>
  )
}

// this is the initial layout of the swap layout.
const initialSwapSections = {
  top: (
    <Card className='flex-grow h-full'>
      <CardHeader>
        <CardTitle>Stats</CardTitle>
      </CardHeader>
      <CardContent className='pl-2'>
        <Suspense key={'stats'} fallback={<StatsLoader />}>
          <Stats />
        </Suspense>
      </CardContent>
    </Card>
  ),
  center_left: (
    <Card className='flex-grow h-full'>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className='pl-2'>
        <Suspense key={'overview'} fallback={<OverviewLoader />}>
          <Overview />
        </Suspense>
      </CardContent>
    </Card>
  ),
  center_right: (
    <Card className='flex-grow h-full'>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense key={'recent-sales'} fallback={<RecentSalesLoader />}>
          <RecentSales />
        </Suspense>
      </CardContent>
    </Card>
  ),
  bottom: (
    <Card className='flex-grow h-full'>
      <CardHeader className='flex flex-row items-center'>
        <div className='grid gap-2'>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Recent transactions from your store.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense key={'transactions'} fallback={<TransactionsLoader />}>
          <Transactions />
        </Suspense>
      </CardContent>
    </Card>
  ),
}

// this is the class names for the sections of the swap layout.
const sectionSlotClassNames = {
  '1': 'col-span-1 row-span-1 h-full w-full flex flex-col',
  '2': 'col-span-1 row-span-1 h-full w-full flex flex-col',
  '3': 'col-span-1 row-span-1 h-full w-full flex flex-col',
  '4': 'col-span-1 row-span-1 h-full w-full flex flex-col',
}
