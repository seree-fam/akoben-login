import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";

const injected = new InjectedConnector({ supportedChainIds: [1] });

const SemaphoreButton: React.FC = () => {
  const { chainId, account, activate, active, library } = useWeb3React<Web3Provider>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [group, setGroup] = useState<Group | null>(null);

  const handleConnectWallet = async () => {
    try {
      console.log("Connecting wallet...");
      await activate(injected);
      console.log("Wallet connected");

      if (!library) {
        console.error("Library is not available");
        return;
      }

      const signer = library.getSigner();
      const message = "welcome to freedom";
      console.log("Signing message...");
      const signature = await signer.signMessage(message);
      console.log("Message signed:", signature);
      const identity = new Identity(signature);
      console.log("Identity commitment:", identity.commitment.toString());

      const semaphoreSubgraph = new SemaphoreSubgraph("sepolia");
      console.log("Fetching group data...");
      const groupData = await semaphoreSubgraph.getGroup("42", { members: true });
      const members = groupData?.members;
      console.log("Group members:", members);

      if (members && members.includes(identity.commitment.toString())) {
        setIsAuthenticated(true);
        console.log("User is authenticated");
      } else {
        const code = prompt("Enter your invite code:");
        if (code) {
          const group = new Group(members || []);
          group.addMember(identity.commitment);
          setIsAuthenticated(true);
          console.log("User added to the group and authenticated");
        }
      }
    } catch (error) {
      console.error("Error connecting wallet or during sign message or group check:", error);
    }
  };

  return (
    <div>
      {!active ? (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      ) : (
        <p>Connecting...</p>
      )}
      {isAuthenticated && <p>Welcome to the site!</p>}
    </div>
  );
};

export default SemaphoreButton;
