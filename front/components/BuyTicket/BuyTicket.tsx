import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import styles from './_BuyTicket.module.scss';

import IMG_LOGO from '../../assets/images/logo.svg'
import CheckMark from '../Marks/CheckMark';
import ModalWrap from '../Modals/ModalWrap';
import BuyTicketM from '../Modals/ModalContents/BuyTicketM';
import { useConditionStore, useRoundStore, useWalletStore } from '../../providers/RootStoreProvider';
import { contractAddress } from '../../ultilities/contract_address';
import { compareNumberArrays } from '../../ultilities/compare-number-array';
import BoughtMark from '../Marks/BoughtMark';
import { observer } from 'mobx-react-lite';
import { Contract, PlayerList } from '../../ultilities/near-interface';

const bingoNumbers = [1, 2, 3, 4, 5, 6];

const BuyTicket = observer(() => {
  const router = useRouter();
  const roundStore = useRoundStore();
  const walletStore = useWalletStore();
  const conditionStore = useConditionStore();
  const [playerList, setPlayerList] = useState<PlayerList[]>([])
  const [chosenNumbers, setChosenNumbers] = useState<number[]>([]);
  const [toggleBuyModal, setToggleBuyModal] = useState<boolean>(false);
  const [loadingBuyTicket, setLoadingBuyTicket] = useState<boolean>(false);

  const setBingoNumbers = (numbers: number[]): void => {
    setChosenNumbers(numbers);
  }

  const checkSelectedNumber = (target: number[]): boolean => {
    return compareNumberArrays(chosenNumbers, target)
    
  }

  const checkBoughtNumber = (target: number[]): boolean => {
    let result = false;
    if (playerList.length > 0 && playerList[0].players) {
      playerList[0].players[0].tickets.forEach(ticket => {
        if (compareNumberArrays(ticket.chosenNumber, target)) {
          result = true;
          return true;
        }
      });
    }
    return result;
  }

  const handleBuyTicket = async(chosenPrice: number | undefined) => {
    try {
      if (chosenPrice && walletStore.accountBalance && chosenPrice <= Number(walletStore.accountBalance)) {
        setLoadingBuyTicket(true);
        if (contractAddress && walletStore) {
          const contract = new Contract({contractId: contractAddress, walletToUse: walletStore})
          const result = await contract.addTickets({chosenNumber: chosenNumbers, betAmount: chosenPrice});
          console.log(result);
          setToggleBuyModal(false);
          setLoadingBuyTicket(false);
        }
      }
      else throw Error(`
        Chosen price isn't valid!
        \nChosen price: ${chosenPrice}
        \nBalance: ${walletStore.accountBalance}
      `)
    } catch(error) {
      console.error('[Error] Buy ticket: ', error);
    }
  }

  const handleTransaction = async() => {
    const urlParams = new URLSearchParams(window.location.search);
    const txhash = urlParams.get("transactionHashes");
    const error = urlParams.get("errorCode");
    if (error) {
      router.push(window.location.origin + window.location.pathname);
    } else if(txhash) {
      // if (walletStore.isSignedIn) {
      //   try {
      //     ticketStore.getTicketsByPlayerAndRound(contractAddress, walletStore, 11);
      //   } catch(error) {
      //     console.error('[Error] Get ticket list: ', error);
      //   }
      // }
      router.push(window.location.origin);
    }
  }

  const handleOrder = () => {
    try {
      if (chosenNumbers.length > 0) {
        setToggleBuyModal(true)
      } else throw Error(`Number isn't set!`)
    } catch(error) {
      console.error('[Error] Order number: ', error)
    }
  }

  const loadTicketList = async() => {
    if (contractAddress && walletStore.accountId && roundStore.rounds.length > 0) {
      const contract = new Contract({contractId: contractAddress, walletToUse: walletStore})
      console.log('load ticket list');
      setPlayerList(
        await contract.getTicketsByPlayerAndRound({
          player: walletStore.accountId, 
          round: roundStore.rounds[roundStore.rounds.length - 1].round,
        }
      ));
    }
  }

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      handleTransaction();
    }

    return () => {isMounted = false}
  }, [])

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (roundStore.rounds.length > 0 && walletStore.isSignedIn) {
        loadTicketList();
      }
    }
    return () => {isMounted = false}
  }, [roundStore.rounds, walletStore.isSignedIn])
  
  useEffect(() => {
    console.log(chosenNumbers);
  }, [chosenNumbers]);

  return (
    <article className={`${styles['buy-ticket-wrap']}`}>
      {toggleBuyModal && chosenNumbers.length > 0 && 
        <ModalWrap setToggleModal={setToggleBuyModal}>
          <BuyTicketM 
            setToggleModal={setToggleBuyModal} 
            chosenNumbers={chosenNumbers}
            loadingBuyTicket={loadingBuyTicket}
            handleBuyTicket={handleBuyTicket}
          />
        </ModalWrap>
      }
      <div className={`${styles['header']} highlight`}>
        <h2 className='content-header'>BUY TICKET</h2>
      </div>
      <div className={`${styles['buy-content-wrap']}`}>
        <div className={`${styles['buy-content']}`}>
          <div className={`${styles['upper-part']}`}>
            <div className={`${styles['content']}`}>
              <div className={`${styles['info']}`}>
                <Image src={IMG_LOGO} alt="Bingo" objectFit='contain'/>
              </div>
            </div>
          </div>
          <div className={`${styles['lower-part']}`}>
            <div className={`${styles['choices']} ${(!walletStore.isSignedIn || !conditionStore.availableToBuyTicket) && 'disabled'}`}>

              {/* Single Number Choice */}
              <div className={`${styles['choice-numbers-wrap']}`}>
                <div className={`${styles['header']}`}>
                  <h4>1 Match x1.2</h4>
                  <div className={`${styles['seperation']}`}/>
                  <h4>2 Match x2</h4>
                  <div className={`${styles['seperation']}`}/>
                  <h4>3 Match x3</h4>
                </div>
                <div className={`${styles['choice-numbers']}`}>
                  {bingoNumbers.map(bingoNum => (
                    <button
                      type='button'
                      key={bingoNum} 
                      className={`
                        ${styles['number']} 
                        ${(checkSelectedNumber([bingoNum]) || checkBoughtNumber([bingoNum])) && 'check-mark-container'}
                      `}
                      onClick={() => setBingoNumbers([bingoNum])}
                    >
                      {checkBoughtNumber([bingoNum]) && <BoughtMark />}
                      {checkSelectedNumber([bingoNum]) && <CheckMark />}
                      <div className={`${styles['row']}`}>
                        <p>{bingoNum}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Double Number Choice */}
              <div className={`${styles['choice-numbers-wrap']}`}>
                <div className={`${styles['header']}`}>
                  <h4>2 Match x7.5</h4>
                </div>
                <div className={`${styles['choice-numbers']}`}>
                  {bingoNumbers.map(bingoNum => (
                    <button
                      type='button'
                      key={bingoNum} 
                      className={`
                        ${styles['number']} 
                        ${(checkSelectedNumber([bingoNum, bingoNum]) || checkBoughtNumber([bingoNum, bingoNum])) && 'check-mark-container'}
                      `}
                      onClick={() => setBingoNumbers([bingoNum, bingoNum])}
                    >
                      {checkBoughtNumber([bingoNum, bingoNum]) && <BoughtMark />}
                      {checkSelectedNumber([bingoNum, bingoNum]) && <CheckMark />}
                      <div className={`${styles['row']}`}>
                        <p>{bingoNum}</p>
                        <p>{bingoNum}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Triple Number Choice */}
              <div className={`${styles['choice-numbers-wrap']}`}>
                <div className={`${styles['header']}`}>
                  <h4>3 Match x120</h4>
                  <div className={`${styles['seperation']}`}/>
                  <h4>Any 3 matching number x20</h4>
                </div>
                <div className={`${styles['choice-numbers']} ${styles['triple']}`}>
                  {bingoNumbers.map(bingoNum => (
                    <button
                      type='button'
                      key={bingoNum} 
                      className={`${styles['number']} 
                      ${(checkSelectedNumber([bingoNum, bingoNum, bingoNum]) || checkBoughtNumber([bingoNum, bingoNum, bingoNum])) && 'check-mark-container'}`}
                      onClick={() => setBingoNumbers([bingoNum, bingoNum, bingoNum])}
                    >
                      {checkBoughtNumber([bingoNum, bingoNum, bingoNum]) && <BoughtMark />}
                      {checkSelectedNumber([bingoNum, bingoNum, bingoNum]) && <CheckMark />}
                      <div className={`${styles['row']}`}>
                        <p>{bingoNum}</p>
                        <p>{bingoNum}</p>
                      </div>
                      <div className={`${styles['row']}`}>
                        <p>{bingoNum}</p>
                      </div>
                    </button>
                  ))}
                  <button
                    type='button'
                    className={`
                      ${styles['number']} 
                      ${styles['optional']} 
                      ${(checkSelectedNumber([0, 0, 0]) || checkBoughtNumber([0, 0, 0])) && 'check-mark-container'}`}
                    onClick={() => setBingoNumbers([0, 0, 0])}
                  >
                    {checkBoughtNumber([0, 0, 0]) && <BoughtMark />}
                    {checkSelectedNumber([0, 0, 0]) && <CheckMark />}
                    <div className={`${styles['row']}`}>
                      <p><span>*</span></p>
                      <p><span>*</span></p>
                    </div>
                    <div className={`${styles['row']}`}>
                      <p><span>*</span></p>
                    </div>
                    
                  </button>
                </div>
              </div>
            </div>
            <div className={`${styles['confirmation']} ${chosenNumbers.length < 1 && 'disabled'}`}>
              <button 
                type='button' 
                className={`tertiary-btn`}
                onClick={() => setChosenNumbers([])}
              >
                Reset
              </button>
              <button 
                type='button'
                className={`primary-btn ${chosenNumbers.length < 1 && 'disabled'}`}
                onClick={() => handleOrder()}
              >
                Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
});

export default  BuyTicket;