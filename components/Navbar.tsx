"use client"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Award, Copy, ExternalLink, Github, Loader2, Menu, Vote, Wallet, X } from "lucide-react"
import { useState } from "react"
import { useWalletConnection } from "@/hooks/useWallet"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"
import { POLYGON_ZKEVM_CARDONA_TESTNET } from "@/lib/constants"

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const { connect, disconnect, isConnected, isConnecting, shortAddress, balance, address } = useWalletConnection()
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const menuItems = [
    {
      title: "Vote",
      icon: Vote,
      items: [
        {
          href: "/votes/candidate",
          title: "Candidate Based",
          description: "Traditional voting with registered candidates",
        },
        {
          href: "/votes/rank",
          title: "Rank Based",
          description: "Rank multiple options in order of preference",
        },
        {
          href: "/votes/proposal",
          title: "Proposal Based",
          description: "Submit and vote on proposals",
        },
      ],
    },
    {
      title: "Bounties",
      icon: Award,
      items: [
        {
          href: "/bounties/active",
          title: "Active Bounties",
          description: "Participate in ongoing bounties",
        },
        {
          href: "/bounties/create",
          title: "Create Bounty",
          description: "Start a new bounty program",
        },
      ],
    },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm transition-colors dark:bg-gray-950/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <motion.a
            href="/"
            className="text-xl font-bold text-purple-600 transition-colors hover:text-purple-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            PolyTix
          </motion.a>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                      {item.items.map((subItem) => (
                        <NavigationMenuLink
                          key={subItem.href}
                          href={subItem.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-50 focus:bg-purple-50 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5 text-purple-600" />
                            <div>
                              <div className="text-sm font-medium leading-none">{subItem.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {subItem.description}
                              </p>
                            </div>
                          </div>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/manovHacksaw/polytix"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg border border-purple-600 px-4 py-2 text-sm text-purple-600 transition-colors hover:bg-purple-100 dark:hover:bg-purple-950 md:flex"
          >
            <Github className="h-4 w-4" />
            Contribute
          </a>
          <ThemeToggle />
          <div className="hidden md:block">
            <AnimatePresence mode="wait">
              {isConnected ? (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-4 rounded-lg bg-purple-100 px-4 py-2 shadow-sm transition-colors dark:bg-gray-800"
                >
                  <Wallet className="h-5 w-5 text-purple-600" />
                  <div className="text-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={copyAddress}
                            className="flex items-center gap-2 font-medium text-purple-600 hover:text-purple-700"
                          >
                            {shortAddress}
                            {copied ? (
                              <span className="text-xs text-green-600">Copied!</span>
                            ) : (
                              <Copy className="h-3.5 w-3.5 opacity-50" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to copy full address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{balance} ETH</p>
                      <a
                        href={`${POLYGON_ZKEVM_CARDONA_TESTNET.blockExplorerUrls}/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-purple-600 hover:text-purple-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={disconnect}
                    className="border-purple-600 text-purple-600 transition-colors hover:bg-purple-200 dark:hover:bg-purple-900"
                  >
                    Disconnect
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Button onClick={connect} disabled={isConnecting} className="bg-purple-600 hover:bg-purple-700">
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t md:hidden"
          >
            <nav className="flex flex-col space-y-4 p-4">
              {menuItems.map((item) =>
                item.items.map((subItem) => (
                  <a
                    key={subItem.href}
                    href={subItem.href}
                    className="flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-purple-50 dark:hover:bg-gray-800"
                  >
                    <item.icon className="h-5 w-5 text-purple-600" /> {subItem.title}
                  </a>
                )),
              )}
              <a
                href="https://github.com/manovHacksaw/polytix"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-purple-50 dark:hover:bg-gray-800"
              >
                <Github className="h-5 w-5 text-purple-600" /> Contribute on GitHub
              </a>
              {isConnected ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 rounded-lg bg-purple-100 p-3 shadow-sm dark:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-purple-600" />
                    <button
                      onClick={copyAddress}
                      className="flex items-center gap-2 text-sm font-medium text-purple-600"
                    >
                      {shortAddress}
                      {copied ? (
                        <span className="text-xs text-green-600">Copied!</span>
                      ) : (
                        <Copy className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{balance} MATIC</p>
                    <a
                      href={`https://testnet-zkevm.polygonscan.com/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-purple-600 hover:text-purple-700"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    onClick={disconnect}
                    className="w-full border-purple-600 text-purple-600 transition-colors hover:bg-purple-200 dark:hover:bg-purple-900"
                  >
                    Disconnect
                  </Button>
                </motion.div>
              ) : (
                <Button
                  onClick={connect}
                  disabled={isConnecting}
                  className={cn(
                    "w-full bg-purple-600 hover:bg-purple-700",
                    isConnecting && "cursor-not-allowed opacity-50",
                  )}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

