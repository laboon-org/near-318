import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useConditionStore, useRatioStore, useRoundStore, useTimerStore, useWalletStore } from '../../providers/RootStoreProvider';
import { WalletStore } from '../../stores/WalletStore';
import { contractAddress } from '../../ultilities/contract_address';
import { viewOnlyWallet } from '../../ultilities/view-only-wallet';
import MainFooter from '../Footers/MainFooter';
import LoadingSpin from '../Loading/LoadingSpin';
import Navbar from '../Navbar/Navbar';

interface Props {
  children: React.ReactNode;
  }

const Layout = observer(({children}: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const walletStore = useWalletStore();
  const roundStore = useRoundStore();
  const ratioStore = useRatioStore();
  const timerStore = useTimerStore();
  const conditionStore = useConditionStore();
  
  // Check if user is signed in
  const checkSignedIn = async() => {
    setLoading(true);
    try {
      await walletStore.startUp();
    } catch (error) {
      console.error('[Error] Start up wallet: ', error)
    }
    setLoading(false);
  }

  // Load ratio between NEAR and USD
  const loadNearRatio = async() => {
    setLoading(true);
    try {
      await ratioStore.fetchRatio();
    } catch (error) {
      console.error('[Error] Load NEAR Ratio: ', error)
    }
    setLoading(false);
  }

  // Load round from SC
  const loadRoundWithoutLogin = async() => {
    const wallet = await viewOnlyWallet()
    setLoading(true);
    try {
      await roundStore.fetchAllRounds(contractAddress, wallet);
    } catch (error) {
      console.error('[Error] Get rounds: ', error)
    }
    setLoading(false);
  }

  const timerCountdown = () => {
    const remainingTime = new Date(roundStore.rounds[roundStore.rounds.length - 1].endTime).getTime() - new Date(Date.now()).getTime();
    if (remainingTime > 1000) {
      const seconds = Math.floor((remainingTime / 1000) % 60);
      const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
      const fixedMinutes = minutes.toString().length > 1 ? minutes.toString() : `0${minutes.toString()}`
      const fixedSeconds = seconds.toString().length > 1 ? seconds.toString() : `0${seconds.toString()}`
      if (timerStore.minutes !== fixedMinutes || timerStore.seconds !== fixedSeconds) {
        timerStore.setTimer({minutes: fixedMinutes, seconds: fixedSeconds})
      }
    }
    else {
      timerStore.setTimer({minutes: '00', seconds: '00'});
    }
  }

  const fetchNewRound = async() => {
    const wallet = await viewOnlyWallet()
    const fetchResult = await roundStore.fetchAllRounds(contractAddress, wallet);
    if (fetchResult) {
      conditionStore.setAvailableToBuyTicket(true);
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    if (roundStore.rounds.length > 0) {
      interval = setInterval(() => {
        timerCountdown();
      }, 100)
    }

    return () => clearInterval(interval);
  }, [roundStore.rounds])

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    if (timerStore.minutes === '00') {
      if(conditionStore.availableToBuyTicket) {
        conditionStore.setAvailableToBuyTicket(false);
      }
      if (timerStore.seconds === '00') {
        interval = setInterval(() => {
          fetchNewRound();
        }, 1000)
      }
    }
    

    return () => clearInterval(interval);
  }, [timerStore.minutes, timerStore.seconds])


  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      checkSignedIn();

      const urlParams = new URLSearchParams(window.location.search);
      const accountId = urlParams.get("account_id");
      if (accountId !== null) {
        router.push(window.location.origin + window.location.pathname);
      }
    }

    return () => {isMounted = false};
  }, [])

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      loadRoundWithoutLogin();
      loadNearRatio();
    }

    return () => {isMounted = false};
  }, [walletStore.isSignedIn]);

  if (loading) return (
    <div className='full-screen-loading'>
      <LoadingSpin message='NOW LOADING'/>
    </div>
  )

  return (
    <div className={`layout`}>
      <Head>
        <meta name="description" content="Bingo B18" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Navbar />
      </header>
      {children}
      <footer>
        <MainFooter />
      </footer>
    </div>
  )
});

export default Layout;