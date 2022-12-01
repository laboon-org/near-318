import { enableStaticRendering } from "mobx-react-lite";
import { createContext, useContext } from "react";
import { RootStore, RootStoreHydration } from "../stores/RootStore";

enableStaticRendering(typeof window === "undefined");

interface RootStoreProps {
  children: React.ReactNode;
  hydrationData?: RootStoreHydration;
}

let store: RootStore;

const StoreContext = createContext<RootStore | undefined>(undefined);

export function useRootStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useRootStore must be used within a RootStoreProvider");
  }
  return context;
}

export function usePageStore() {
  const {pageStore} = useRootStore();
  return pageStore;
}

export function useWalletStore() {
  const {walletStore} = useRootStore();
  return walletStore;
}

export function useRoundStore() {
  const {roundStore} = useRootStore();
  return roundStore;
}

export function useRatioStore() {
  const {ratioStore} = useRootStore();
  return ratioStore;
}

export function useTimerStore() {
  const {timerStore} = useRootStore();
  return timerStore;
}

export function useConditionStore() {
  const {conditionStore} = useRootStore();
  return conditionStore;
}

// export function useTicketStore() {
//   const {ticketStore} = useRootStore();
//   return ticketStore;
// }

export function RootStoreProvider({children, hydrationData}: RootStoreProps) {
  const _store = initializeStore(hydrationData);
  return (
    <StoreContext.Provider value={_store}>
      {children}
    </StoreContext.Provider>
  );
}

function initializeStore(initialData?: RootStoreHydration): RootStore {
  const _store = store ?? new RootStore();
  // if (initialData) {
  //   _store.hydrate(initialData);
  // }
  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}
