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
    setSwarmKey: "$env:IPFS_SWARM_KEY = \"/key/swarm/psk/1.0.0/`n/base16/`n2654c429053c8a7cdca6845c955ef11b139bc0bd41f8c42b706e0d6e65a16695\"",
    download: "Invoke-WebRequest -Uri \"https://raw.githubusercontent.com/suleiyinwin/11Fire_IPFS_Setup/main/ipfs_setup/windows/ipfs-setup.ps1\" -OutFile \"ipfs-setup.ps1\"",
    run: ".\\ipfs-setup.ps1",
    daemon: "ipfs daemon"
  },
  macos: {
    setSwarmKey: "export IPFS_SWARM_KEY='/key/swarm/psk/1.0.0/ /base16/ 2654c429053c8a7cdca6845c955ef11b139bc0bd41f8c42b706e0d6e65a16695'",
    download: "curl -O https://raw.githubusercontent.com/suleiyinwin/11Fire_IPFS_Setup/main/ipfs_setup/macos/ipfs-setup.sh",
    makeExecutable: "chmod +x ipfs-setup.sh",
    run: "./ipfs-setup.sh",
    daemon: "ipfs daemon"
  },
  linux: {
    setSwarmKey: "export IPFS_SWARM_KEY='/key/swarm/psk/1.0.0/ /base16/ 2654c429053c8a7cdca6845c955ef11b139bc0bd41f8c42b706e0d6e65a16695'",
    download: "wget https://raw.githubusercontent.com/suleiyinwin/11Fire_IPFS_Setup/main/ipfs_setup/linux/ipfs-setup.sh",
    makeExecutable: "chmod +x ipfs-setup.sh",
    run: "./ipfs-setup.sh",
    daemon: "ipfs daemon"
  }
};
