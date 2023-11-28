interface NaboxWindow extends Window {
  nabox: {
    on: (eventName: string, callback: (accounts: string[]) => void) => void;
    chainId: string;
    createSession: () => void;
    invokeView: (data: any) => any;
    contractCall: (data: any) => any;
  };
}

export default NaboxWindow;
