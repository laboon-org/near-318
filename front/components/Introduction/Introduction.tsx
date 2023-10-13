import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from "react";
import { useConditionStore, useRoundStore, useTimerStore, useWalletStore } from '../../providers/RootStoreProvider';
import { contractAddress } from '../../ultilities/contract_address';
import { delay } from '../../ultilities/delay';
import { formatDateShort } from '../../ultilities/format-date';
import { Contract, PlayerList } from '../../ultilities/near-interface';
import { viewOnlyWallet } from '../../ultilities/view-only-wallet';
import BoughtTicketListM from '../Modals/ModalContents/BoughtTicketListM';
import ModalWrap from '../Modals/ModalWrap';
import Modal from '../Modals/ModalWrap';
import styles from './_Introduction.module.scss';

interface Timer {
  minutes: string;
  seconds: string;
}

const Introduction = observer(() => {
  const walletStore = useWalletStore();
  const roundStore = useRoundStore();
  const timerStore = useTimerStore();
  const conditionStore = useConditionStore();
  const [playerList, setPlayerList] = useState<PlayerList[]>([]);
  const [toggleTicketListModal, setToggleTicketListModal] =
    useState<boolean>(false);

  const loadTicketList = useCallback(async () => {
    if (contractAddress && walletStore.accountId) {
      const contract = new Contract({
        contractId: contractAddress,
        walletToUse: walletStore,
      });
      setPlayerList(
        await contract.getTicketsByPlayerAndRound({
          player: walletStore.accountId,
          round: roundStore.rounds[roundStore.rounds.length - 1].round,
        })
      );
    }
  }, [walletStore, roundStore.rounds]); // add dependencies here

  useEffect(() => {
    // use loadTicketList here
  }, [loadTicketList]); // add loadTicketList as a dependency

  useEffect(() => {
    let isMounted = true;
    if (isMounted && walletStore.isSignedIn && roundStore.rounds.length > 0) {
      loadTicketList();
    }
    return () => {
      isMounted = false;
    };
  }, [loadTicketList, roundStore.rounds, walletStore.isSignedIn]);

  return (
    <article className={`${styles["intro-wrap"]}`}>
      {toggleTicketListModal && playerList.length > 0 && (
        <ModalWrap setToggleModal={setToggleTicketListModal}>
          <BoughtTicketListM
            setToggleModal={setToggleTicketListModal}
            playerList={playerList[0]}
          />
        </ModalWrap>
      )}
      <div className={`${styles["header"]} highlight`}>
        <h2 className="content-header">GET YOUR TICKET NOW!</h2>
      </div>
      <div className={`${styles["timer"]}`}>
        <div className={`${styles["timer-item"]}`}>
          <p>{`${timerStore.minutes}`}</p>
          <small>Minute</small>
        </div>
        <div className={`${styles["timer-seperation"]}`}>:</div>
        <div className={`${styles["timer-item"]}`}>
          <p>{timerStore.seconds}</p>
          <small>Second</small>
        </div>
      </div>
      <div className={`${styles["next-draw"]}`}>
        <div className={`${styles["draw-header"]} highlight`}>
          <h3>Until the next draw</h3>
        </div>
        <div className={`${styles["draw-content"]}`}>
          <div className={`${styles["upper-part"]}`}>
            <div className={`${styles["content"]}`}>
              <div className={`${styles["header"]}`}>
                <h4>NEXT DRAW</h4>
              </div>
              <div className={`${styles["info"]}`}>
                <div>
                  <p>Round:</p>
                  <span>
                    #
                    {roundStore.rounds.length > 0
                      ? roundStore.rounds[roundStore.rounds.length - 1].round
                      : ""}
                  </span>
                </div>
                <div className={`${styles["seperation"]}`}></div>
                <div>
                  <p>Draw: </p>
                  <span>
                    {roundStore.rounds.length > 0
                      ? formatDateShort(
                          roundStore.rounds[roundStore.rounds.length - 1]
                            .endTime
                        )
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles["lower-part"]}`}>
            {playerList.length > 0 &&
              playerList[0].players &&
              playerList[0].players.length > 0 && (
                <div className={`${styles["ticket-info"]}`}>
                  <p>
                    You have
                    <span>{` ${playerList[0].players[0].tickets.length} `}</span>
                    {playerList[0].players[0].tickets.length < 2
                      ? "ticket"
                      : "tickets"}{" "}
                    this round
                  </p>
                  <button
                    type="button"
                    onClick={() => setToggleTicketListModal(true)}
                  >
                    <small>View your tickets</small>
                  </button>
                </div>
              )}
            <div
              className={`${styles["buy-ticket-btn"]} ${
                !conditionStore.availableToBuyTicket && "disabled"
              }`}
            >
              <Link href="/buy">Buy Ticket</Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});

export default Introduction;