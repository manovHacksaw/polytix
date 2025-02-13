"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Github, Twitter, DiscIcon as Discord, Mail, ArrowRight, Vote, Award, BookOpen, HelpCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function Footer() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Subscribe:", email)
    setEmail("")
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-white dark:bg-gray-950 font-mono">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-purple-600">PolyTix</h2>
            <p className="text-sm text-muted-foreground">
              Decentralized voting platform on Polygon ZkEVM. Create and participate in secure, transparent voting
              processes.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-purple-600"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-purple-600"
              >
                <span className="sr-only">Discord</span>
                <Discord className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-purple-600"
              >
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@polytix.com"
                className="text-muted-foreground transition-colors hover:text-purple-600"
              >
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="grid gap-3 text-sm">
              <li>
                <Link
                  href="/votes"
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-purple-600"
                >
                  <Vote className="h-4 w-4" />
                  Active Votes
                </Link>
              </li>
              <li>
                <Link
                  href="/bounties"
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-purple-600"
                >
                  <Award className="h-4 w-4" />
                  Bounties
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-purple-600"
                >
                  <BookOpen className="h-4 w-4" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-purple-600"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="grid gap-3 text-sm">
              <li>
                <a
                  href="https://polygon.technology"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-purple-600"
                >
                  Polygon ZkEVM
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-purple-600">
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-purple-600">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-purple-600">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-purple-600">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white dark:bg-gray-900"
              />
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="text-sm text-muted-foreground">© {currentYear} PolyTix. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground md:justify-end">
            <a href="#" className="hover:text-purple-600">
              Terms
            </a>
            <a href="#" className="hover:text-purple-600">
              Privacy
            </a>
            <a href="#" className="hover:text-purple-600">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

