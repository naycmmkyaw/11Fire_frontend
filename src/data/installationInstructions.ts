// Installation instruction data for 11Fire IPFS Setup
export interface InstallationData {
  setSwarmKey: string;
  download: string;
  makeExecutable?: string;
  run: string;
  daemon: string;
}

export interface InstallationInstructions {
  windows: InstallationData;
  macos: InstallationData;
  linux: InstallationData;
}

export const installationInstructions: InstallationInstructions = {
  windows: {
    setSwarmKey:
      '$env:IPFS_SWARM_KEY = "/key/swarm/psk/1.0.0/`n/base16/`n2654c429053c8a7cdca6845c955ef11b139bc0bd41f8c42b706e0d6e65a16695"',
    download:
      'Invoke-WebRequest -Uri "https://raw.githubusercontent.com/suleiyinwin/11Fire_IPFS_Setup/main/ipfs_setup/windows/ipfs-setup.ps1" -OutFile "$HOME\\ipfs-setup.ps1"',
    run: '& "$HOME\\ipfs-setup.ps1"',
    daemon: "ipfs daemon",
  },
  macos: {
    setSwarmKey: `export IPFS_SWARM_KEY='/key/swarm/psk/1.0.0/
/base16/
2654c429053c8a7cdca6845c955ef11b139bc0bd41f8c42b706e0d6e65a16695'`,
    download:
      "curl -O https://raw.githubusercontent.com/suleiyinwin/11Fire_IPFS_Setup/main/ipfs_setup/macos/ipfs-setup.sh",
    makeExecutable: "chmod +x ipfs-setup.sh",
    run: "./ipfs-setup.sh",
    daemon: "ipfs daemon",
  },
  linux: {
    setSwarmKey: `export IPFS_SWARM_KEY='/key/swarm/psk/1.0.0/
/base16/
2654c429053c8a7cdca6845c955ef11b139bc0bd41f8c42b706e0d6e65a16695'`,
    download:
      "wget https://raw.githubusercontent.com/suleiyinwin/11Fire_IPFS_Setup/main/ipfs_setup/linux/ipfs-setup.sh",
    makeExecutable: "chmod +x ipfs-setup.sh",
    run: "./ipfs-setup.sh",
    daemon: "ipfs daemon",
  },
};

// Provider instructions data
export interface ProviderInstructionData {
  downloadToken: string;
  downloadBinary: string;
  placeToken: string;
  runProvider: string;
}

export interface ProviderInstructions {
  windows: ProviderInstructionData;
  macos: ProviderInstructionData;
  linux: ProviderInstructionData;
}

export const providerInstructions: ProviderInstructions = {
  windows: {
    downloadToken:
      "Click the button below to download your provider.token file. This token is essential for the provider listener to authenticate and claim the provider's peer ID.",
    downloadBinary: 'Invoke-WebRequest -Uri "https://raw.githubusercontent.com/suleiyinwin/11Fire_Provider_Binary/main/Provider_Binary/Windows_Binary/provider-listener-windows.exe" -OutFile "provider-listener-windows.exe"',
    placeToken:
      "Move the provider.token file you downloaded in Step 1 into the provider listener folder you just downloaded. The folder should now contain both the provider listener binary and the provider.token file.",
    runProvider:
      "Simply double-click the .exe file to run the provider listener.",
  },
  macos: {
    downloadToken:
      "Click the button below to download your provider.token file. This token is essential for the provider listener to authenticate and claim the provider's peer ID.",
    downloadBinary: "curl -L -o provider-listener-macos https://raw.githubusercontent.com/suleiyinwin/11Fire_Provider_Binary/main/Provider_Binary/MacOs_Binary/provider-listener-macos && chmod +x provider-listener-macos",
    placeToken:
      "Move the provider.token file you downloaded in Step 1 into the provider listener folder you just downloaded. The folder should now contain both the provider listener binary and the provider.token file.",
    runProvider:
      "Simply double-click the .exe file to run the provider listener.",
  },
  linux: {
    downloadToken:
      "Click the button below to download your provider.token file. This token is essential for the provider listener to authenticate and claim the provider's peer ID.",
    downloadBinary: "wget https://raw.githubusercontent.com/suleiyinwin/11Fire_Provider_Binary/main/Provider_Binary/Linux_Binary/provider-listener-linux && chmod +x provider-listener-linux",
    placeToken:
      "Move the provider.token file you downloaded in Step 1 into the provider listener folder you just downloaded. The folder should now contain both the provider listener binary and the provider.token file.",
    runProvider:
      "Simply double-click the .exe file to run the provider listener.",
  },
};
