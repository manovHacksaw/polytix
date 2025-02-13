

import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { BrowserProvider, formatEther } from "ethers"
import {  POLYGON_ZKEVM_CARDONA_TESTNET } from "@/lib/constants"
import type { RootState } from "@/types/redux"

interface WalletState {
  address: string | null
  balance: string | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  chainId: string | null
}

const initialState: WalletState = {
  address: null,
  balance: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  chainId: null,
}

async function switchToPolygonZkEVM() {
  try {
    await window.ethereum?.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: POLYGON_ZKEVM_CARDONA_TESTNET.chainId }],
    })
  } catch (error: any) {
    if (error.code === 4902) {
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [POLYGON_ZKEVM_CARDONA_TESTNET],
      })
    } else {
      throw error
    }
  }
}

export const connectWallet = createAsyncThunk<
  { address: string; balance: string; chainId: string },
  void,
  { rejectValue: string }
>("wallet/connectWallet", async (_, { rejectWithValue }) => {
  if (typeof window.ethereum === "undefined") {
    return rejectWithValue("Please install MetaMask or a similar wallet to continue!")
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    await switchToPolygonZkEVM()

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    const balance = formatEther(await provider.getBalance(address))
    const chainId = (await provider.getNetwork()).chainId.toString(16)

    return { address, balance, chainId }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to connect wallet")
  }
})

export const checkWalletConnection = createAsyncThunk<
  { address: string; balance: string; chainId: string },
  void,
  { rejectValue: string }
>("wallet/checkWalletConnection", async (_, { rejectWithValue }) => {
  if (typeof window.ethereum === "undefined") {
    return rejectWithValue("No Ethereum provider detected.")
  }

  try {
    const provider = new BrowserProvider(window.ethereum)
    const accounts = await provider.send("eth_accounts", [])

    if (accounts.length === 0) {
      return rejectWithValue("No connected account found.")
    }

    const chainId = (await provider.getNetwork()).chainId.toString(16)
    if (chainId !== POLYGON_ZKEVM_CARDONA_TESTNET.chainId.toLowerCase()) {
      await switchToPolygonZkEVM()
    }

    const address = accounts[0]
    const balance = formatEther(await provider.getBalance(address))

    return { address, balance, chainId }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to check wallet connection")
  }
})

export const updateBalance = createAsyncThunk<string, string, { rejectValue: string }>(
  "wallet/updateBalance",
  async (address, { rejectWithValue }) => {
    try {
      const provider = new BrowserProvider(window.ethereum!)
      const balance = formatEther(await provider.getBalance(address))
      return balance
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update balance")
    }
  },
)

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    disconnect: (state) => {
      state.address = null
      state.balance = null
      state.isConnected = false
      state.error = null
      state.chainId = null
    },
    clearError: (state) => {
      state.error = null
    },
    setChainId: (state, action: PayloadAction<string>) => {
      state.chainId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        state.isConnecting = true
        state.error = null
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.isConnecting = false
        state.isConnected = true
        state.address = action.payload.address
        state.balance = action.payload.balance
        state.chainId = action.payload.chainId
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.isConnecting = false
        state.error = action.payload as string
      })
      .addCase(checkWalletConnection.fulfilled, (state, action) => {
        state.isConnected = true
        state.address = action.payload.address
        state.balance = action.payload.balance
        state.chainId = action.payload.chainId
      })
      .addCase(updateBalance.fulfilled, (state, action) => {
        state.balance = action.payload
      })
  },
})

export const { disconnect, clearError, setChainId } = walletSlice.actions
export const selectWallet = (state: RootState) => state.wallet
export default walletSlice.reducer

