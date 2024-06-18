import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";

const injected = new InjectedConnector({ supportedChainIds: [1] });

const SemaphoreButton: React.FC = () => {
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [group, setGroup] = useState<Group | null>(null);

  const handleConnectWallet = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleSignMessage = async () => {
    if (!library) return;

    const signer = library.getSigner();
    const message = "welcome to freedom";
    const signature = await signer.signMessage(message);
    const identity = new Identity(signature);
    console.log("Identity commitment:", identity.commitment.toString());

    const semaphoreSubgraph = new SemaphoreSubgraph("sepolia");
    const groupData = await semaphoreSubgraph.getGroup("42", { members: true });
    const members = groupData?.members;

    if (members && members.includes(identity.commitment.toString())) {
      setIsAuthenticated(true);
    } else {
      const code = prompt("Enter your invite code:");
      if (code) {
        const group = new Group(members || []);
        group.addMember(identity.commitment);
        setIsAuthenticated(true);
      }
    }
  };

  return (
    <div>
      {!active ? (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      ) : (
        <button onClick={handleSignMessage}>Sign In with Semaphore</button>
      )}
      {isAuthenticated && <p>Welcome to the site!</p>}
    </div>
  );
};

export default SemaphoreButton;
