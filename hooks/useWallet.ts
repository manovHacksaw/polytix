"use client"

import { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  connectWallet,
  disconnect,
  updateBalance,
  checkWalletConnection,
  selectWallet,
} from "@/lib/redux/features/wallet/walletSlice"
import { POLLING_INTERVAL, POLYGON_ZKEVM_CARDONA_TESTNET } from "@/lib/constants"
import type { AppDispatch } from "@/types/redux"
import { toast } from "sonner"

export function useWalletConnection() {
  const dispatch = useDispatch<AppDispatch>()
  const { address, balance, isConnected, isConnecting, error, chainId } = useSelector(selectWallet)
  const [shortAddress, setShortAddress] = useState<string>("")

  // Check initial connection
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      dispatch(checkWalletConnection())
    }
  }, [dispatch])

  // Handle address changes
  useEffect(() => {
    if (address) {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`)
    }
  }, [address])

  // Auto refresh balance
  useEffect(() => {
    if (address && isConnected) {
      const interval = setInterval(() => {
        dispatch(updateBalance(address))
      }, POLLING_INTERVAL)

      return () => clearInterval(interval)
    }
  }, [address, isConnected, dispatch])

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  // Handle account changes
  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      dispatch(disconnect())
      toast.error("Wallet disconnected")
    } else {
      dispatch(checkWalletConnection())
      toast.success("Account changed successfully")
    }
  }

  // Handle chain changes
  function handleChainChanged(newChainId: string) {
    if (newChainId.toLowerCase() !== POLYGON_ZKEVM_CARDONA_TESTNET.chainId.toLowerCase()) {
      toast.error("Please switch to Polygon ZkEVM Testnet")
      dispatch(disconnect())
    } else {
      dispatch(checkWalletConnection())
      toast.success("Network changed to Polygon ZkEVM Testnet")
    }
  }

  const connect = useCallback(async () => {
    try {
      await dispatch(connectWallet()).unwrap()
      toast.success("Wallet connected successfully")
    } catch (error) {
      toast.error(error as string)
    }
  }, [dispatch])

  const disconnectWallet = useCallback(() => {
    dispatch(disconnect())
    toast.success("Wallet disconnected")
  }, [dispatch])

  // Format balance to 4 decimal places
  const formattedBalance = balance ? Number.parseFloat(balance).toFixed(4) : "0"

  return {
    connect,
    disconnect: disconnectWallet,
    isConnected,
    isConnecting,
    address,
    shortAddress,
    balance: formattedBalance,
    error,
    chainId,
  }
}

