import Head from 'next/head'
import Instruction from '../components/Instruction/Instruction'
import Introduction from '../components/Introduction/Introduction'
import FirstScreen from '../components/Screens/FirstScreen'
import SecondScreen from '../components/Screens/SecondScreen'
import ThirdScreen from '../components/Screens/ThirdScreen'
import History from '../components/History/History'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { usePageStore } from '../providers/RootStoreProvider'

const Home = observer(() => {
  const pageStore = usePageStore();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      pageStore.setPage('Home');
    }
    return () => { isMounted = false };
  }, [])
  
  return (
    <>
      <Head>
        <title>Bingo 318 - Home</title>
      </Head>
      <main className={`main`}>
        <FirstScreen>
          <Introduction />
        </FirstScreen>
        <SecondScreen>
          <History />
        </SecondScreen>
        <ThirdScreen>
          <Instruction />
        </ThirdScreen>
      </main>
    </>
  )
});

export default Home;