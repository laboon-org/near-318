import Head from 'next/head'
import FirstScreen from '../components/Screens/FirstScreen'
import BuyTicket from '../components/BuyTicket/BuyTicket'
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { usePageStore } from '../providers/RootStoreProvider';

const Buy = observer(() => {
  const pageStore = usePageStore();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      pageStore.setPage('Buy');
    }
    return () => { isMounted = false };
  }, [])

  return (
    <>
      <Head>
        <title>Bingo 318 - Buy Ticket</title>
      </Head>
      <main className={`main`}>
        <FirstScreen>
          <BuyTicket />
        </FirstScreen>
      </main>
    </>
  )
});

export default Buy;