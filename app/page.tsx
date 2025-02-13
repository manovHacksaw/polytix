import { Button } from "@/components/ui/button"
import { ArrowRight, Award, Crown, Users, Vote } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white px-6 py-24 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-purple-900 dark:text-purple-100 sm:text-5xl md:text-6xl">
                Decentralized Voting <br />
                <span className="text-purple-600">Made Simple</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                Create and participate in secure, transparent voting processes on Polygon ZkEVM. Perfect for DAOs,
                organizations, and communities.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/votes/create">
                    Create Vote <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/votes">Explore Votes</Link>
                </Button>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-lg lg:mx-0">
              <div className="relative w-full rounded-2xl bg-purple-100 p-6 dark:bg-purple-900/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <Vote className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Student Council Election</h3>
                      <p className="text-sm text-gray-500">156 votes • 4 candidates</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <Crown className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Project Priority Poll</h3>
                      <p className="text-sm text-gray-500">89 votes • 6 options</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Community Guidelines</h3>
                      <p className="text-sm text-gray-500">234 votes • Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-6 py-24 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Choose Your Voting Type
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Multiple voting mechanisms to suit your needs
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
              <Crown className="h-12 w-12 text-purple-600" />
              <h3 className="mt-4 text-xl font-semibold">Candidate Based</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Perfect for elections with multiple candidates. Includes registration and verification features.
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/votes/create?type=candidate">Get Started</Link>
              </Button>
            </div>
            <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
              <Vote className="h-12 w-12 text-purple-600" />
              <h3 className="mt-4 text-xl font-semibold">Rank Based</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Rank options in order of preference. Ideal for decision making with multiple choices.
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/votes/create?type=rank">Get Started</Link>
              </Button>
            </div>
            <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
              <Users className="h-12 w-12 text-purple-600" />
              <h3 className="mt-4 text-xl font-semibold">Proposal Based</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Submit and vote on proposals with customizable restrictions and requirements.
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/votes/create?type=proposal">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bounties Section */}
      <section className="bg-purple-50 px-6 py-24 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Featured Bounties
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Earn rewards by participating in community-driven initiatives
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
              <Award className="h-12 w-12 text-purple-600" />
              <h3 className="mt-4 text-xl font-semibold">Community Feedback</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">500 ETH reward for valuable platform feedback</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-purple-600">by Popular Creator</span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
              <Award className="h-12 w-12 text-purple-600" />
              <h3 className="mt-4 text-xl font-semibold">Feature Suggestions</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">300 ETH for innovative platform ideas</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-purple-600">by PolyTix Team</span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
              <Award className="h-12 w-12 text-purple-600" />
              <h3 className="mt-4 text-xl font-semibold">UI/UX Improvements</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">400 ETH for design enhancement proposals</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-purple-600">by Design Team</span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

