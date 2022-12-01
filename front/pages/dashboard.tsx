import { observer } from 'mobx-react-lite';
import Head from 'next/head'
import React, { useEffect } from 'react'
import UserDashboard from '../components/Dashboard/Dashboard'
import FirstScreen from '../components/Screens/FirstScreen'
import { usePageStore } from '../providers/RootStoreProvider';

const Dashboard = observer(() => {
  const pageStore = usePageStore();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      pageStore.setPage('Dashboard');
    }
    return () => { isMounted = false };
  }, [])

  return (
    <>
      <Head>
        <title>Bingo - Dashboard</title>
      </Head>
      <main className={`main`}>
        <FirstScreen>
          <UserDashboard />
        </FirstScreen>
      </main>
    </>
  )
});

export default Dashboard